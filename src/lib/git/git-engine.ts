/**
 * ファイル概要：
 * ブラウザ内仮想Gitエンジン（Git State & Command Interpreter）
 *
 * 主な処理：
 * 1. コミットグラフ（DAG構造）、ブランチ、HEADポインタのイミュータブル管理
 * 2. 主要Gitコマンド（commit, branch, checkout/switch, merge, rebase, log, status, reset）の解釈と実行
 * 3. 解答状態（現在のGitツリー）と目標状態（Goalツリー）の自動判定照合
 */

export interface GitCommit {
  id: string; // 例: "C0", "C1", "C2"
  hash: string; // 例: "e3b0c44"
  parents: string[]; // 親コミットID一覧
  message: string;
}

export interface GitHead {
  target: string; // ブランチ名（例: "main"）または コミットID（デタッチ時）
  isDetached: boolean;
}

export interface GitState {
  commits: Record<string, GitCommit>;
  branches: Record<string, string>; // branchName -> commitId
  head: GitHead;
  commitCounter: number;
}

export interface GitCommandResult {
  state: GitState;
  output: string;
  isError: boolean;
  command: string;
}

/**
 * 簡易ハッシュ生成
 */
function generateCommitHash(id: string, counter: number): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 7; i++) {
    hash += chars[(id.charCodeAt(0) + counter * 13 + i * 7) % chars.length];
  }
  return hash;
}

/**
 * 初期Gitリポジトリ状態を生成する（初期コミット C0、mainブランチ、HEAD -> main）
 */
export function createInitialGitState(initialCommits?: GitCommit[], defaultBranch = "main"): GitState {
  if (initialCommits && initialCommits.length > 0) {
    const commits: Record<string, GitCommit> = {};
    for (const c of initialCommits) {
      commits[c.id] = c;
    }
    const lastCommit = initialCommits[initialCommits.length - 1];
    return {
      commits,
      branches: { [defaultBranch]: lastCommit.id },
      head: { target: defaultBranch, isDetached: false },
      commitCounter: initialCommits.length,
    };
  }

  const c0: GitCommit = {
    id: "C0",
    hash: "initial",
    parents: [],
    message: "Initial commit",
  };

  return {
    commits: { C0: c0 },
    branches: { [defaultBranch]: "C0" },
    head: { target: defaultBranch, isDetached: false },
    commitCounter: 1,
  };
}

/**
 * 現在のHEADが指しているコミットIDを取得
 */
export function getHeadCommitId(state: GitState): string {
  if (state.head.isDetached) {
    return state.head.target;
  }
  return state.branches[state.head.target] || "C0";
}

/**
 * 単一のGitコマンドを実行し、新しいGitStateと出力を返す
 */
export function executeGitCommand(currentState: GitState, commandLine: string): GitCommandResult {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { state: currentState, output: "", isError: false, command: commandLine };
  }

  // help は単独コマンドとして許可。それ以外のGit操作は実務と同様に "git " プレフィックスを必須とする
  const lowerTrimmed = trimmed.toLowerCase();
  if (lowerTrimmed === "help") {
    return {
      state: currentState,
      output: [
        "利用可能なGitコマンド一覧:",
        "  git commit [-m <msg>]    : 新しいコミットを作成して進める",
        "  git branch <name>        : 新しいブランチを作成する",
        "  git branch -d <name>     : ブランチを削除する",
        "  git switch <name>        : ブランチを切り替える",
        "  git switch -c <name>     : 新しいブランチを作成して即座に切り替える",
        "  git checkout <name/id>   : ブランチまたはコミットへ切り替える",
        "  git merge <name>         : 指定ブランチを現在のブランチにマージする",
        "  git rebase <name>        : 指定ブランチの上に履歴を付け替える",
        "  git status               : 現在のブランチ・作業ツリー状態を確認する",
        "  git log                  : コミット履歴を表示する",
        "  clear                    : ターミナルのログを消去する",
        "  reset                    : 初期状態にリセットする",
      ].join("\n"),
      isError: false,
      command: commandLine,
    };
  }

  if (lowerTrimmed === "git") {
    return {
      state: currentState,
      output: "usage: git <command> [<args>]（'help' でコマンド一覧を確認できます）",
      isError: true,
      command: commandLine,
    };
  }

  if (!lowerTrimmed.startsWith("git ")) {
    const firstWord = trimmed.split(/\s+/)[0];
    return {
      state: currentState,
      output: `command not found: ${firstWord}\nヒント: Gitコマンドは先頭に 'git ' を付けて入力してください（例: git ${trimmed}）。`,
      isError: true,
      command: commandLine,
    };
  }

  const cleanCmd = trimmed.slice(4).trim();
  const parts = cleanCmd.split(/\s+/);
  const subcommand = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  // ディープコピー
  const nextState: GitState = {
    commits: { ...currentState.commits },
    branches: { ...currentState.branches },
    head: { ...currentState.head },
    commitCounter: currentState.commitCounter,
  };

  switch (subcommand) {
    // -------------------------------------------------------------------------
    // git commit [-m "message"]
    // -------------------------------------------------------------------------
    case "commit": {
      const parentId = getHeadCommitId(nextState);
      const nextId = `C${nextState.commitCounter}`;
      nextState.commitCounter += 1;

      let msg = `Commit ${nextId}`;
      const mIdx = args.indexOf("-m");
      if (mIdx !== -1 && args[mIdx + 1]) {
        msg = args.slice(mIdx + 1).join(" ").replace(/^["']|["']$/g, "");
      }

      const hash = generateCommitHash(nextId, nextState.commitCounter);
      const newCommit: GitCommit = {
        id: nextId,
        hash,
        parents: [parentId],
        message: msg,
      };

      nextState.commits[nextId] = newCommit;

      if (nextState.head.isDetached) {
        nextState.head.target = nextId;
      } else {
        nextState.branches[nextState.head.target] = nextId;
      }

      return {
        state: nextState,
        output: `[${nextState.head.isDetached ? "HEAD" : nextState.head.target} ${hash}] ${msg}\n 1 file changed, 1 insertion(+)`,
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git branch [name] | git branch -d [name] | git branch
    // -------------------------------------------------------------------------
    case "branch": {
      if (args.length === 0) {
        // 一覧表示
        const branchList = Object.keys(nextState.branches)
          .map((b) => (b === nextState.head.target && !nextState.head.isDetached ? `* ${b}` : `  ${b}`))
          .join("\n");
        return {
          state: nextState,
          output: branchList,
          isError: false,
          command: commandLine,
        };
      }

      if (args[0] === "-d" || args[0] === "-D") {
        const targetBranch = args[1];
        if (!targetBranch) {
          return {
            state: currentState,
            output: "fatal: branch name required for -d",
            isError: true,
            command: commandLine,
          };
        }
        if (targetBranch === nextState.head.target && !nextState.head.isDetached) {
          return {
            state: currentState,
            output: `error: Cannot delete branch '${targetBranch}' checked out at '${getHeadCommitId(nextState)}'`,
            isError: true,
            command: commandLine,
          };
        }
        if (!nextState.branches[targetBranch]) {
          return {
            state: currentState,
            output: `error: branch '${targetBranch}' not found.`,
            isError: true,
            command: commandLine,
          };
        }
        delete nextState.branches[targetBranch];
        return {
          state: nextState,
          output: `Deleted branch ${targetBranch}.`,
          isError: false,
          command: commandLine,
        };
      }

      const branchName = args[0];
      if (nextState.branches[branchName]) {
        return {
          state: currentState,
          output: `fatal: A branch named '${branchName}' already exists.`,
          isError: true,
          command: commandLine,
        };
      }

      const currentCommitId = getHeadCommitId(nextState);
      nextState.branches[branchName] = currentCommitId;

      return {
        state: nextState,
        output: `Created branch '${branchName}' at ${currentCommitId}.`,
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git switch [name] | git switch -c [name]
    // git checkout [name/commit] | git checkout -b [name]
    // -------------------------------------------------------------------------
    case "switch":
    case "checkout": {
      if (args.length === 0) {
        return {
          state: currentState,
          output: `fatal: missing branch or commit argument for ${subcommand}`,
          isError: true,
          command: commandLine,
        };
      }

      const isCreateAndSwitch = args[0] === "-c" || args[0] === "-b";
      const targetName = isCreateAndSwitch ? args[1] : args[0];

      if (!targetName) {
        return {
          state: currentState,
          output: `fatal: missing branch name for ${args[0]}`,
          isError: true,
          command: commandLine,
        };
      }

      if (isCreateAndSwitch) {
        if (nextState.branches[targetName]) {
          return {
            state: currentState,
            output: `fatal: a branch named '${targetName}' already exists`,
            isError: true,
            command: commandLine,
          };
        }
        const currId = getHeadCommitId(nextState);
        nextState.branches[targetName] = currId;
        nextState.head = { target: targetName, isDetached: false };
        return {
          state: nextState,
          output: `Switched to a new branch '${targetName}'`,
          isError: false,
          command: commandLine,
        };
      }

      // 既存ブランチへの切り替え
      if (nextState.branches[targetName]) {
        nextState.head = { target: targetName, isDetached: false };
        return {
          state: nextState,
          output: `Switched to branch '${targetName}'`,
          isError: false,
          command: commandLine,
        };
      }

      // コミットIDへのチェックアウト（Detached HEAD）
      const upperTarget = targetName.toUpperCase();
      if (nextState.commits[upperTarget] || nextState.commits[targetName]) {
        const commitId = nextState.commits[upperTarget] ? upperTarget : targetName;
        nextState.head = { target: commitId, isDetached: true };
        return {
          state: nextState,
          output: `Note: switching to '${commitId}'.\nYou are in 'detached HEAD' state.`,
          isError: false,
          command: commandLine,
        };
      }

      return {
        state: currentState,
        output: `error: pathspec '${targetName}' did not match any file(s) known to git`,
        isError: true,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git merge [targetBranch]
    // -------------------------------------------------------------------------
    case "merge": {
      if (args.length === 0) {
        return {
          state: currentState,
          output: "fatal: No commit specified for merge.",
          isError: true,
          command: commandLine,
        };
      }

      const targetBranch = args[0];
      const targetCommitId = nextState.branches[targetBranch] || nextState.commits[targetBranch]?.id;

      if (!targetCommitId) {
        return {
          state: currentState,
          output: `merge: '${targetBranch}' - not something we can merge`,
          isError: true,
          command: commandLine,
        };
      }

      const currentHeadCommitId = getHeadCommitId(nextState);
      if (currentHeadCommitId === targetCommitId) {
        return {
          state: nextState,
          output: "Already up to date.",
          isError: false,
          command: commandLine,
        };
      }

      // Fast-forward判定：currentHeadCommitIdがtargetCommitIdの先祖である場合
      const isAncestor = checkIfAncestor(nextState, currentHeadCommitId, targetCommitId);
      if (isAncestor) {
        if (!nextState.head.isDetached) {
          nextState.branches[nextState.head.target] = targetCommitId;
        } else {
          nextState.head.target = targetCommitId;
        }
        return {
          state: nextState,
          output: `Updating ${currentHeadCommitId}..${targetCommitId}\nFast-forward`,
          isError: false,
          command: commandLine,
        };
      }

      // 3-wayマージコミット作成
      const nextId = `C${nextState.commitCounter}`;
      nextState.commitCounter += 1;
      const hash = generateCommitHash(nextId, nextState.commitCounter);
      const newCommit: GitCommit = {
        id: nextId,
        hash,
        parents: [currentHeadCommitId, targetCommitId],
        message: `Merge branch '${targetBranch}'`,
      };

      nextState.commits[nextId] = newCommit;
      if (!nextState.head.isDetached) {
        nextState.branches[nextState.head.target] = nextId;
      } else {
        nextState.head.target = nextId;
      }

      return {
        state: nextState,
        output: `Merge made by the 'ort' strategy.\nMerge commit: ${nextId} (${hash})`,
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git rebase [targetBranch]
    // -------------------------------------------------------------------------
    case "rebase": {
      if (args.length === 0) {
        return {
          state: currentState,
          output: "fatal: No branch specified for rebase.",
          isError: true,
          command: commandLine,
        };
      }

      const targetBranch = args[0];
      const ontoCommitId = nextState.branches[targetBranch] || nextState.commits[targetBranch]?.id;
      if (!ontoCommitId) {
        return {
          state: currentState,
          output: `fatal: invalid upstream '${targetBranch}'`,
          isError: true,
          command: commandLine,
        };
      }

      const currentCommitId = getHeadCommitId(nextState);
      if (currentCommitId === ontoCommitId) {
        return {
          state: nextState,
          output: `Current branch is up to date.`,
          isError: false,
          command: commandLine,
        };
      }

      // 現在のコミットから共通先祖までのコミット群を抽出
      const branchCommits = getCommitsBetween(nextState, currentCommitId, ontoCommitId);
      if (branchCommits.length === 0) {
        // Fast-forward rebase
        if (!nextState.head.isDetached) {
          nextState.branches[nextState.head.target] = ontoCommitId;
        } else {
          nextState.head.target = ontoCommitId;
        }
        return {
          state: nextState,
          output: `Fast-forwarded to ${ontoCommitId}.`,
          isError: false,
          command: commandLine,
        };
      }

      let lastRebasedId = ontoCommitId;
      for (const orig of branchCommits) {
        const nextId = `C${nextState.commitCounter}'`;
        nextState.commitCounter += 1;
        const hash = generateCommitHash(nextId, nextState.commitCounter);
        const rebasedCommit: GitCommit = {
          id: nextId,
          hash,
          parents: [lastRebasedId],
          message: orig.message,
        };
        nextState.commits[nextId] = rebasedCommit;
        lastRebasedId = nextId;
      }

      if (!nextState.head.isDetached) {
        nextState.branches[nextState.head.target] = lastRebasedId;
      } else {
        nextState.head.target = lastRebasedId;
      }

      return {
        state: nextState,
        output: `Successfully rebased and updated refs/heads/${nextState.head.target}.`,
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git status
    // -------------------------------------------------------------------------
    case "status": {
      const headDesc = nextState.head.isDetached
        ? `HEAD detached at ${nextState.head.target}`
        : `On branch ${nextState.head.target}`;
      return {
        state: nextState,
        output: `${headDesc}\nnothing to commit, working tree clean`,
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // git log
    // -------------------------------------------------------------------------
    case "log": {
      const history: string[] = [];
      let cur: string | undefined = getHeadCommitId(nextState);
      const visited = new Set<string>();

      while (cur && !visited.has(cur)) {
        visited.add(cur);
        const commitObj: GitCommit | undefined = nextState.commits[cur];
        if (!commitObj) break;
        const branches = Object.entries(nextState.branches)
          .filter(([, cid]) => cid === commitObj.id)
          .map(([b]) => b);

        const isHead = nextState.head.isDetached
          ? nextState.head.target === commitObj.id
          : nextState.branches[nextState.head.target] === commitObj.id;

        let refStr = "";
        if (branches.length > 0 || isHead) {
          const refs: string[] = [];
          if (isHead) refs.push(`HEAD -> ${nextState.head.target}`);
          for (const b of branches) {
            if (!refs.includes(b)) refs.push(b);
          }
          refStr = ` (${refs.join(", ")})`;
        }

        history.push(`commit ${commitObj.hash} (${commitObj.id})${refStr}\n    ${commitObj.message}`);
        cur = commitObj.parents[0];
      }

      return {
        state: nextState,
        output: history.join("\n\n"),
        isError: false,
        command: commandLine,
      };
    }

    // -------------------------------------------------------------------------
    // help
    // -------------------------------------------------------------------------
    case "help": {
      return {
        state: nextState,
        output: [
          "利用可能なGitコマンド一覧:",
          "  git commit [-m <msg>]    : 新しいコミットを作成して進める",
          "  git branch <name>        : 新しいブランチを作成する",
          "  git branch -d <name>     : ブランチを削除する",
          "  git switch <name>        : ブランチを切り替える",
          "  git switch -c <name>     : 新しいブランチを作成して即座に切り替える",
          "  git checkout <name/id>   : ブランチまたはコミットへ切り替える",
          "  git merge <name>         : 指定ブランチを現在のブランチにマージする",
          "  git rebase <name>        : 指定ブランチの上に履歴を付け替える",
          "  git status               : 現在のブランチ・作業ツリー状態を確認する",
          "  git log                  : コミット履歴を表示する",
          "  clear                    : ターミナルのログを消去する",
          "  reset                    : 初期状態にリセットする",
        ].join("\n"),
        isError: false,
        command: commandLine,
      };
    }

    default:
      return {
        state: currentState,
        output: `git: '${subcommand}' はサポートされていないか、有効なコマンドではありません。'help' で確認してください。`,
        isError: true,
        command: commandLine,
      };
  }
}

/**
 * 祖先関係の確認（nodeAがnodeBの祖先であるかどうか）
 */
function checkIfAncestor(state: GitState, ancestorId: string, descendentId: string): boolean {
  if (ancestorId === descendentId) return true;
  const queue = [descendentId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const curId = queue.shift()!;
    if (visited.has(curId)) continue;
    visited.add(curId);

    const commit = state.commits[curId];
    if (!commit) continue;

    for (const p of commit.parents) {
      if (p === ancestorId) return true;
      queue.push(p);
    }
  }

  return false;
}

/**
 * 共通祖先から現在のコミットまでのコミットリスト（Rebase用）を取得
 */
function getCommitsBetween(state: GitState, fromCommitId: string, ontoCommitId: string): GitCommit[] {
  const result: GitCommit[] = [];
  let cur: string | undefined = fromCommitId;
  const visited = new Set<string>();

  while (cur && cur !== ontoCommitId && !visited.has(cur)) {
    visited.add(cur);
    const commitObj: GitCommit | undefined = state.commits[cur];
    if (!commitObj) break;
    // ontoCommitIdの祖先に入ったら停止
    if (checkIfAncestor(state, cur, ontoCommitId)) {
      break;
    }
    result.unshift(commitObj); // 親から子の順序にするため前に追加
    cur = commitObj.parents[0];
  }

  return result;
}

/**
 * 複数コマンド（スクリプト）を一括実行
 */
export function executeGitScript(initialState: GitState, script: string): { state: GitState; results: GitCommandResult[] } {
  let state = initialState;
  const results: GitCommandResult[] = [];
  const lines = script
    .split(/\r?\n|;/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  for (const line of lines) {
    const res = executeGitCommand(state, line);
    results.push(res);
    state = res.state;
  }

  return { state, results };
}

/**
 * 現在のGitツリー状態が目標（Goal）ツリーと一致しているか厳密判定する
 */
export function compareGitStates(
  current: GitState,
  target: GitState
): { isMatch: boolean; reason?: string } {
  // 1. ブランチ一覧とポインタ先の照合
  for (const [branchName, targetCommitId] of Object.entries(target.branches)) {
    const curCommitId = current.branches[branchName];
    if (!curCommitId) {
      return { isMatch: false, reason: `ブランチ '${branchName}' が存在しません。` };
    }

    // コミットの構造検証（親関係のチェック）
    const targetCommit = target.commits[targetCommitId];
    const curCommit = current.commits[curCommitId];
    if (!curCommit || !targetCommit) {
      return { isMatch: false, reason: `ブランチ '${branchName}' のコミット情報が一致しません。` };
    }

    if (curCommit.parents.length !== targetCommit.parents.length) {
      return {
        isMatch: false,
        reason: `ブランチ '${branchName}' の親コミット数が異なります（マージ有無の不一致）。`,
      };
    }
  }

  // 2. HEADの位置（ブランチまたはコミット）の照合
  if (target.head.isDetached !== current.head.isDetached) {
    return {
      isMatch: false,
      reason: target.head.isDetached
        ? "HEADがデタッチされたコミットを指している必要があります。"
        : `HEADがブランチ '${target.head.target}' を指している必要があります。`,
    };
  }

  if (target.head.target !== current.head.target) {
    return {
      isMatch: false,
      reason: `現在のブランチは '${current.head.target}' ですが、目標は '${target.head.target}' です。`,
    };
  }

  // 3. 総コミット数の検証
  const targetCommitCount = Object.keys(target.commits).length;
  const currentCommitCount = Object.keys(current.commits).length;
  if (currentCommitCount < targetCommitCount) {
    return {
      isMatch: false,
      reason: `コミット数が不足しています（目標: ${targetCommitCount}、現在: ${currentCommitCount}）。`,
    };
  }

  return { isMatch: true };
}

export interface GitGoalCheckItem {
  id: string;
  label: string;
  passed: boolean;
}

/**
 * 現在のGit状態と目標状態を項目ごとに照合し、リアルタイムチェックリストを返す
 */
export function evaluateGitGoalChecklist(
  current: GitState,
  target: GitState
): GitGoalCheckItem[] {
  const items: GitGoalCheckItem[] = [];

  // 1. 必要なブランチの存在と構造チェック
  for (const [branchName, targetCommitId] of Object.entries(target.branches)) {
    const curCommitId = current.branches[branchName];
    const targetCommit = target.commits[targetCommitId];
    const curCommit = curCommitId ? current.commits[curCommitId] : undefined;

    const exists = !!curCommit;
    const isMergeTarget = (targetCommit?.parents.length ?? 0) >= 2;

    if (isMergeTarget) {
      const hasMerged = (curCommit?.parents.length ?? 0) >= 2;
      items.push({
        id: `branch-merge-${branchName}`,
        label: `ブランチ「${branchName}」にマージコミットが作成されている`,
        passed: exists && hasMerged,
      });
    } else {
      items.push({
        id: `branch-${branchName}`,
        label: `ブランチ「${branchName}」が存在し、期待される履歴構成になっている`,
        passed:
          exists &&
          (curCommit?.parents.length ?? 0) === (targetCommit?.parents.length ?? 0),
      });
    }
  }

  // 2. HEAD位置のチェック
  const headMatched =
    current.head.isDetached === target.head.isDetached &&
    current.head.target === target.head.target;
  items.push({
    id: "head-target",
    label: target.head.isDetached
      ? `HEAD がコミット「${target.head.target}」を指している`
      : `現在の作業ブランチ（HEAD）が「${target.head.target}」になっている`,
    passed: headMatched,
  });

  // 3. コミット数のチェック
  const targetCount = Object.keys(target.commits).length;
  const currentCount = Object.keys(current.commits).length;
  items.push({
    id: "commit-count",
    label: `リポジトリのコミット数が目標（${targetCount}件）に達している（現在 ${currentCount}件）`,
    passed: currentCount >= targetCount,
  });

  return items;
}
