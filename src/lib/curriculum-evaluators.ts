/**
 * Shared Evaluators for IT Literacy Quizzes & Practical Project GitHub URL Submissions
 */

export interface LiteracyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LiteracyQuizSpec {
  questions: LiteracyQuizQuestion[];
}

export interface LiteracyGradeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  details: Array<{
    id: string;
    question: string;
    selectedIndex: number;
    correctIndex: number;
    passed: boolean;
    explanation: string;
  }>;
}

export function parseLiteracyQuizSpec(starterCode: string): LiteracyQuizSpec | null {
  try {
    const parsed = JSON.parse(starterCode) as LiteracyQuizSpec;
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function evaluateLiteracySubmission(
  starterCodeJson: string,
  userSubmissionJson: string
): LiteracyGradeResult {
  const spec = parseLiteracyQuizSpec(starterCodeJson);
  if (!spec) {
    return { passed: false, passedCount: 0, totalCount: 0, details: [] };
  }

  let answers: Record<string, number> = {};
  try {
    const parsed = JSON.parse(userSubmissionJson);
    if (parsed && typeof parsed === "object") {
      answers = parsed as Record<string, number>;
    }
  } catch {
    answers = {};
  }

  const details = spec.questions.map((q) => {
    const selected = typeof answers[q.id] === "number" ? answers[q.id] : -1;
    const passed = selected === q.correctIndex;
    return {
      id: q.id,
      question: q.question,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      passed,
      explanation: q.explanation,
    };
  });

  const passedCount = details.filter((d) => d.passed).length;
  return {
    passed: details.length > 0 && passedCount === details.length,
    passedCount,
    totalCount: details.length,
    details,
  };
}

// ---------------------------------------------------------------------------
// Project (Spring Boot Individual & 3-Person Team Dev) GitHub URL Submission
// ---------------------------------------------------------------------------
export interface ProjectStepSpec {
  stepNumber: number;
  designDocPath: string;
  designDocLabel: string;
  checklist: string[];
  requireGithubUrl?: boolean;
  isTeamProject?: boolean;
}

export interface ProjectSubmissionPayload {
  githubUrl: string;
  checkedItems: number[];
  summaryNote?: string;
}

export interface ProjectGradeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  checks: Array<{
    label: string;
    passed: boolean;
    message: string;
  }>;
}

export function parseProjectStepSpec(starterCode: string): ProjectStepSpec | null {
  try {
    const parsed = JSON.parse(starterCode) as ProjectStepSpec;
    if (parsed && typeof parsed.stepNumber === "number" && Array.isArray(parsed.checklist)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function isValidGithubUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/.*)?$/.test(trimmed);
}

export function evaluateProjectSubmission(
  starterCodeJson: string,
  userSubmissionJson: string
): ProjectGradeResult {
  const spec = parseProjectStepSpec(starterCodeJson);
  if (!spec) {
    return { passed: false, passedCount: 0, totalCount: 0, checks: [] };
  }

  let payload: ProjectSubmissionPayload = { githubUrl: "", checkedItems: [], summaryNote: "" };
  try {
    const parsed = JSON.parse(userSubmissionJson);
    if (parsed && typeof parsed === "object") {
      payload = {
        githubUrl: typeof parsed.githubUrl === "string" ? parsed.githubUrl.trim() : "",
        checkedItems: Array.isArray(parsed.checkedItems) ? parsed.checkedItems : [],
        summaryNote: typeof parsed.summaryNote === "string" ? parsed.summaryNote.trim() : "",
      };
    }
  } catch {
    // Allow plain GitHub URL fallback
    payload.githubUrl = userSubmissionJson.trim();
  }

  const checks: Array<{ label: string; passed: boolean; message: string }> = [];

  // 1. GitHub URL check
  const requireUrl = spec.requireGithubUrl !== false;
  if (requireUrl) {
    const urlOk = isValidGithubUrl(payload.githubUrl);
    checks.push({
      label: "GitHubリポジトリURL形式チェック",
      passed: urlOk,
      message: urlOk
        ? `有効なGitHub URLを確認しました（${payload.githubUrl}）`
        : "有効なGitHubリポジトリURL（例: https://github.com/your-id/product-manager）を入力してください",
    });
  }

  // 2. Checklist completion check
  const allChecked =
    spec.checklist.length === 0 ||
    spec.checklist.every((_, idx) => payload.checkedItems.includes(idx));
  checks.push({
    label: `完了チェックリスト（${payload.checkedItems.length}/${spec.checklist.length}項目）`,
    passed: allChecked,
    message: allChecked
      ? "すべての完了確認項目にチェックが入っています"
      : "未確認のチェック項目があります。手順をすべて完了してチェックを入れてください",
  });

  const passedCount = checks.filter((c) => c.passed).length;
  return {
    passed: checks.length > 0 && passedCount === checks.length,
    passedCount,
    totalCount: checks.length,
    checks,
  };
}
