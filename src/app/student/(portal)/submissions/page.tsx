import React from "react";
import Link from "next/link";
import { getCurrentProfile, getStudentDashboardData } from "@/lib/data-service";
import { SEED_PROBLEMS } from "@/lib/seed-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  ExternalLink,
} from "lucide-react";

export default async function StudentSubmissionsPage() {
  const profile = await getCurrentProfile();
  const dashboard = await getStudentDashboardData(profile.id);

  const submissions =
    dashboard.recentSubmissions.length > 0
      ? dashboard.recentSubmissions
      : [
          {
            id: "sub-demo-1",
            user_id: profile.id,
            problem_id: SEED_PROBLEMS[0].id,
            code: SEED_PROBLEMS[0].solution_code,
            status: "passed" as const,
            passed_count: 2,
            total_count: 2,
            execution_time_ms: 4,
            memory_kb: 256,
            compile_error: null,
            time_spent_seconds: 185,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            problems: {
              id: SEED_PROBLEMS[0].id,
              title: SEED_PROBLEMS[0].title,
              difficulty: SEED_PROBLEMS[0].difficulty,
              tags: SEED_PROBLEMS[0].tags,
            },
          },
          {
            id: "sub-demo-2",
            user_id: profile.id,
            problem_id: SEED_PROBLEMS[12].id,
            code: SEED_PROBLEMS[12].solution_code,
            status: "passed" as const,
            passed_count: 2,
            total_count: 2,
            execution_time_ms: 2,
            memory_kb: 128,
            compile_error: null,
            time_spent_seconds: 210,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            problems: {
              id: SEED_PROBLEMS[12].id,
              title: SEED_PROBLEMS[12].title,
              difficulty: SEED_PROBLEMS[12].difficulty,
              tags: SEED_PROBLEMS[12].tags,
            },
          },
        ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">提出履歴</h1>
        <p className="text-sm text-slate-600 mt-1">
          これまでに提出したJavaコード・SQLクエリ、採点結果、実行時間を確認できます。
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {sub.status === "passed" ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      全テスト合格 ({sub.passed_count}/{sub.total_count})
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      {sub.status} ({sub.passed_count}/{sub.total_count})
                    </Badge>
                  )}
                  <CardTitle className="text-base">
                    {sub.problems?.title ?? "演習問題"}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    実行時間: {sub.execution_time_ms ?? 1} ms
                  </span>
                  <span>
                    提出日時: {new Date(sub.created_at).toLocaleString("ja-JP")}
                  </span>
                  <Link
                    href={`/student/problems/${sub.problem_id}`}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    問題を開く
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              <CardDescription />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-900 p-3.5 text-slate-100 font-mono text-xs overflow-x-auto">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-2 pb-1.5 border-b border-slate-800">
                  <Code2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>提出コード</span>
                </div>
                <pre>{sub.code}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
