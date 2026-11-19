"use client";

/**
 * ファイル概要：
 * 90日間カリキュラム 日別詳細学習ページ クライアントコンポーネント（/student/roadmap/[day]）
 *
 * 主な機能：
 * - 学習目標・前提知識・解説教材（MarkdownRenderer）の表示
 * - 既存の自動採点演習問題（Java / SQL / Git ワークスペース）への直結リンク
 * - インタラクティブ理解度確認テスト（即時採点・解説表示・履歴保存）
 * - 実務成果物提出フォーム（Spring Boot / JDBC / 最終課題用：GitHub PR URL・コード・テストエビデンス）
 */

import React, { useState } from "react";
import Link from "next/link";
import {
  CurriculumDay,
  DeliverableSubmissionRecord,
} from "@/types/curriculum";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Code2,
  Clock,
  FileCheck2,
  HelpCircle,
  Target,
  Send,
  AlertCircle,
} from "lucide-react";

interface LinkedProblemSummary {
  id: string;
  title: string;
  difficulty: string;
  language: string;
  completed: boolean;
}

interface DayDetailClientProps {
  dayPlan: CurriculumDay;
  linkedProblems: LinkedProblemSummary[];
  initialDeliverables: DeliverableSubmissionRecord[];
}

export function DayDetailClient({
  dayPlan,
  linkedProblems,
  initialDeliverables,
}: DayDetailClientProps) {
  // 理解度確認テスト状態
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    correctCount: number;
    totalCount: number;
    scorePercent: number;
    details: Array<{
      questionId: string;
      isCorrect: boolean;
      correctIndex: number;
      explanation: string;
    }>;
  } | null>(null);

  // 成果物提出フォーム状態
  const [repoUrl, setRepoUrl] = useState("");
  const [codeOrNotes, setCodeOrNotes] = useState("");
  const [testEvidence, setTestEvidence] = useState("");
  const [delivSubmitting, setDelivSubmitting] = useState(false);
  const [delivMessage, setDelivMessage] = useState<string | null>(null);
  const [delivError, setDelivError] = useState<string | null>(null);
  const [deliverables, setDeliverables] =
    useState<DeliverableSubmissionRecord[]>(initialDeliverables);

  const handleSubmitQuiz = async () => {
    if (!dayPlan.quizzes || quizSubmitting) return;
    setQuizSubmitting(true);
    try {
      const res = await fetch("/api/curriculum/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: dayPlan.day,
          answers: selectedAnswers,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setQuizResult({
          correctCount: data.correctCount,
          totalCount: data.totalCount,
          scorePercent: data.scorePercent,
          details: data.details,
        });
      }
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setDelivSubmitting(true);
    setDelivMessage(null);
    setDelivError(null);
    try {
      const res = await fetch("/api/curriculum/deliverables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: dayPlan.day,
          repositoryUrl: repoUrl,
          codeOrNotes,
          testEvidence,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDelivError(data.error || "提出に失敗しました。");
      } else {
        setDelivMessage(data.message);
        if (data.submission) {
          setDeliverables((prev) => [data.submission, ...prev]);
        }
        setRepoUrl("");
        setCodeOrNotes("");
        setTestEvidence("");
      }
    } catch {
      setDelivError("通信エラーが発生しました。");
    } finally {
      setDelivSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
      {/* ナビゲーション */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/roadmap"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          90日間ロードマップへ戻る
        </Link>

        <div className="flex items-center gap-2">
          {dayPlan.day > 1 && (
            <Link href={`/student/roadmap/${dayPlan.day - 1}`}>
              <Button size="sm" variant="outline">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Day {dayPlan.day - 1}
              </Button>
            </Link>
          )}
          {dayPlan.day < 90 && (
            <Link href={`/student/roadmap/${dayPlan.day + 1}`}>
              <Button size="sm" variant="outline">
                Day {dayPlan.day + 1}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Day ヘッダーカード */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-900 text-white">
              Day {dayPlan.day} / 90
            </span>
            <Badge variant="outline" className="text-xs">
              第{dayPlan.phase}フェーズ ・ 第{dayPlan.week}週
            </Badge>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              学習目安: {dayPlan.estimatedMinutes}分
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-600">
              {dayPlan.chapterTitle}
            </div>
            <CardTitle className="text-2xl mt-1">{dayPlan.title}</CardTitle>
          </div>
          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-950 flex items-start gap-2.5">
            <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-xs text-blue-700 mb-0.5">
                本日の学習目標
              </span>
              {dayPlan.learningGoal}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ② 解説教材 */}
      {dayPlan.lessonContentMd ? (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              解説教材
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <MarkdownRenderer content={dayPlan.lessonContentMd} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-slate-300 bg-slate-50/70">
          <CardContent className="py-6 flex items-start gap-3 text-sm text-slate-600">
            <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-800">
                このDayの詳細解説教材は順次拡充中です（設計確定済み）
              </div>
              <p className="text-xs mt-1">
                90日間カリキュラムのフェーズ別実装計画に基づき、高品質な解説・演習問題を段階的に追加しています。下の演習問題または前後Dayから学習を進めてください。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ③ 連携コーディング・Git・SQL演習問題 */}
      {linkedProblems.length > 0 && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              本日の演習問題（自動採点ワークスペース）
            </CardTitle>
            <CardDescription className="text-xs">
              クリックするとブラウザ内の実行・自動採点ワークスペースが開きます。
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5">
            {linkedProblems.map((prob) => (
              <Link
                key={prob.id}
                href={`/student/problems/${prob.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-3">
                  {prob.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Code2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {prob.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      種別: {prob.language.toUpperCase()}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                  {prob.completed ? "再挑戦する" : "演習を開始"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ④ 理解度確認テスト */}
      {dayPlan.quizzes && dayPlan.quizzes.length > 0 && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              理解度確認テスト（全{dayPlan.quizzes.length}問）
            </CardTitle>
            <CardDescription className="text-xs">
              本日の学習内容が定着しているか確認しましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            {dayPlan.quizzes.map((q, qIdx) => {
              const resDetail = quizResult?.details.find(
                (d) => d.questionId === q.id
              );
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="font-bold text-sm text-slate-900">
                    Q{qIdx + 1}. {q.question}
                  </div>
                  {q.codeSnippet && (
                    <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}
                  <div className="space-y-2">
                    {q.choices.map((ch, cIdx) => {
                      const isSelected = selectedAnswers[q.id] === cIdx;
                      return (
                        <label
                          key={cIdx}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer text-sm transition ${
                            isSelected
                              ? "bg-blue-50 border-blue-500 font-semibold text-blue-950"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={isSelected}
                            onChange={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q.id]: cIdx,
                              }))
                            }
                            className="accent-blue-600"
                          />
                          <span className="whitespace-pre-wrap">{ch}</span>
                        </label>
                      );
                    })}
                  </div>
                  {resDetail && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        resDetail.isCorrect
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                          : "bg-rose-50 border border-rose-200 text-rose-900"
                      }`}
                    >
                      {resDetail.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">
                          {resDetail.isCorrect ? "正解！" : "不正解"}
                        </div>
                        <p className="mt-0.5">{resDetail.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-2">
              {quizResult ? (
                <div className="text-sm font-bold text-slate-900">
                  結果: {quizResult.correctCount} / {quizResult.totalCount} 問正解（
                  <span className="text-blue-600">{quizResult.scorePercent}%</span>）
                </div>
              ) : (
                <span className="text-xs text-slate-500">
                  すべて選択して「採点する」を押してください
                </span>
              )}
              <Button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={quizSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {quizSubmitting ? "採点中..." : "理解度テストを採点する"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ⑤ 実務成果物提出フォーム（Spring Boot / JDBC / 最終課題向け） */}
      {dayPlan.executionMode === "deliverable_review" && (
        <Card className="border-emerald-200">
          <CardHeader className="pb-3 bg-emerald-50/50 border-b border-emerald-100">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-950">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              {dayPlan.deliverable?.title ?? "実務成果物の提出（レビュー採点）"}
            </CardTitle>
            <CardDescription className="text-xs text-emerald-900/80">
              {dayPlan.deliverable?.overview ??
                "ローカル環境（IDE / Maven / PostgreSQL）で実装した成果物のGitHub URL・ソースコード・テスト実行結果を提出してください。研修担当者が評価シートに基づきレビューします。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {dayPlan.deliverable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="font-bold text-slate-800 mb-1.5">必須提出項目</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {dayPlan.deliverable.requiredItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <div className="font-bold text-slate-800 mb-1.5">レビュー評価基準</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {dayPlan.deliverable.evaluationCriteria.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitDeliverable} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  GitHub リポジトリ / Pull Request URL
                </label>
                <Input
                  placeholder="https://github.com/your-org/customer-management-api/pull/1"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  実装内容・工夫した点・コード抜粋
                </label>
                <Textarea
                  rows={4}
                  placeholder="実装したエンドポイント、Controller/Service/Repositoryの構成、工夫した点などを記載してください..."
                  value={codeOrNotes}
                  onChange={(e) => setCodeOrNotes(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  テスト実行結果・動作確認エビデンス（JUnit / curl 出力など）
                </label>
                <Textarea
                  rows={3}
                  placeholder="mvn test の結果や curl でのAPIレスポンス結果を貼り付けてください..."
                  value={testEvidence}
                  onChange={(e) => setTestEvidence(e.target.value)}
                />
              </div>

              {delivMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  {delivMessage}
                </div>
              )}
              {delivError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                  {delivError}
                </div>
              )}

              <Button
                type="submit"
                disabled={delivSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
              >
                <Send className="w-4 h-4" />
                {delivSubmitting ? "提出中..." : "成果物を提出してレビューを依頼する"}
              </Button>
            </form>

            {deliverables.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-700">
                  提出履歴（{deliverables.length}件）
                </div>
                {deliverables.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg border bg-slate-50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-500">
                        {new Date(sub.submittedAt).toLocaleString("ja-JP")}
                      </span>
                      <Badge
                        variant={
                          sub.reviewStatus === "approved"
                            ? "success"
                            : sub.reviewStatus === "needs_revision"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {sub.reviewStatus === "approved"
                          ? "レビュー合格"
                          : sub.reviewStatus === "needs_revision"
                          ? "修正依頼"
                          : "レビュー待ち"}
                      </Badge>
                    </div>
                    {sub.repositoryUrl && (
                      <div className="text-blue-600 underline break-all">
                        {sub.repositoryUrl}
                      </div>
                    )}
                    <div className="text-slate-700 whitespace-pre-wrap">
                      {sub.codeOrNotes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
