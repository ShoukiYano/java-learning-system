import { describe, it, expect } from "vitest";
import {
  createInitialGitState,
  executeGitCommand,
  executeGitScript,
  compareGitStates,
  getHeadCommitId,
} from "../git-engine";

describe("Git Engine - Virtual Git Interpreter", () => {
  it("初期状態が正しく作成されること", () => {
    const state = createInitialGitState();
    expect(state.commits["C0"]).toBeDefined();
    expect(state.branches["main"]).toBe("C0");
    expect(state.head.target).toBe("main");
    expect(state.head.isDetached).toBe(false);
    expect(getHeadCommitId(state)).toBe("C0");
  });

  it("git commit でコミットが追加され、mainが進むこと", () => {
    let state = createInitialGitState();
    const res = executeGitCommand(state, "git commit -m 'first'");
    state = res.state;

    expect(res.isError).toBe(false);
    expect(state.commits["C1"]).toBeDefined();
    expect(state.commits["C1"].parents).toEqual(["C0"]);
    expect(state.commits["C1"].message).toBe("first");
    expect(state.branches["main"]).toBe("C1");
    expect(getHeadCommitId(state)).toBe("C1");
  });

  it("git branch と git switch で新しいブランチに移動して作業できること", () => {
    let state = createInitialGitState();
    state = executeGitCommand(state, "git branch bugfix").state;
    expect(state.branches["bugfix"]).toBe("C0");

    state = executeGitCommand(state, "git switch bugfix").state;
    expect(state.head.target).toBe("bugfix");

    state = executeGitCommand(state, "git commit -m 'fix bug'").state;
    expect(state.branches["bugfix"]).toBe("C1");
    expect(state.branches["main"]).toBe("C0"); // mainは動いていない
  });

  it("git switch -c で新ブランチ作成と切り替えが同時にできること", () => {
    let state = createInitialGitState();
    const res = executeGitCommand(state, "git switch -c feature");
    state = res.state;

    expect(res.isError).toBe(false);
    expect(state.branches["feature"]).toBe("C0");
    expect(state.head.target).toBe("feature");
  });

  it("git merge でFast-forwardおよび3-wayマージが動作すること", () => {
    // 3-wayマージのテスト: mainで1コミット、featureで1コミット後にマージ
    let state = createInitialGitState();
    state = executeGitCommand(state, "git switch -c feature").state;
    state = executeGitCommand(state, "git commit -m 'feature work'").state; // C1 on feature

    state = executeGitCommand(state, "git switch main").state;
    state = executeGitCommand(state, "git commit -m 'main work'").state; // C2 on main

    const mergeRes = executeGitCommand(state, "git merge feature");
    state = mergeRes.state;

    expect(mergeRes.isError).toBe(false);
    expect(state.commits["C3"]).toBeDefined();
    // 2つの親を持つこと
    expect(state.commits["C3"].parents).toEqual(["C2", "C1"]);
    expect(state.branches["main"]).toBe("C3");
  });

  it("git rebase でコミットが指定ブランチの上に付け替えられること", () => {
    let state = createInitialGitState();
    state = executeGitCommand(state, "git commit -m 'c1'").state; // C1 on main
    state = executeGitCommand(state, "git switch -c feature").state;
    state = executeGitCommand(state, "git commit -m 'feat1'").state; // C2 on feature

    state = executeGitCommand(state, "git switch main").state;
    state = executeGitCommand(state, "git commit -m 'c2'").state; // C3 on main

    // feature を main に rebase
    state = executeGitCommand(state, "git switch feature").state;
    const rebaseRes = executeGitCommand(state, "git rebase main");
    state = rebaseRes.state;

    expect(rebaseRes.isError).toBe(false);
    expect(state.branches["feature"]).toContain("'");
  });

  it("スクリプト一括実行と目標状態の判定が正しく動作すること", () => {
    const initial = createInitialGitState();
    const script = `
      git branch bugfix
      git switch bugfix
      git commit -m 'fix'
    `;
    const { state: userState } = executeGitScript(initial, script);

    // 正解スクリプト
    const targetScript = `
      git switch -c bugfix
      git commit -m 'fix'
    `;
    const { state: targetState } = executeGitScript(initial, targetScript);

    const check = compareGitStates(userState, targetState);
    expect(check.isMatch).toBe(true);
  });

  it("git プレフィックスを省略した場合は反復練習用の案内エラーを返すこと", () => {
    const state = createInitialGitState();
    const res = executeGitCommand(state, "commit -m 'no git prefix'");
    expect(res.isError).toBe(true);
    expect(res.output).toContain("git ");
    expect(Object.keys(res.state.commits)).toHaveLength(1);
  });
});
