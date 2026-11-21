/**
 * ファイル概要：
 * 管理者・企業担当者向け CRUD 永続化 Route Handler (POST /api/admin/actions)
 *
 * 主な処理：
 * 1. コース・章・単元・問題の作成・編集・並び替え順序の永続化
 * 2. 企業テナント管理（企業登録、企業コード発行、企業担当者アカウント発行・PW再設定）
 * 3. 企業別カリキュラム表示／非表示トグル（company_courses）の保存
 * 4. 受講生への評価・コメント（フィードバック）の追加・編集・削除（企業担当者も自社受講生に対して実行可能）
 * 5. 受講生ごとのコース受講制限・個別ロック/解放設定（student_course_locks）
 * 6. 全体および特定企業向けお知らせ（announcements）の配信
 *
 * 注意事項：
 * - 実行権限チェック：原則システム管理者（admin）のみ。ただしフィードバック管理と受講ロック管理は自社受講生に限り企業担当者（company）も実行可能。
 * - サービスロールキー（SUPABASE_SERVICE_ROLE_KEY）が存在する場合は、Supabase Auth の特権操作（ユーザー作成・パスワード更新）を実行します。
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, getStudentsAnalyticsFromDb, getMilestonesFromDb } from "@/lib/data-service";
import { recordAuditLog } from "@/lib/audit-log";
import { resetLoginAttemptsForEmail } from "@/lib/login-attempts";
import {
  setInMemoryStudentCourseLock,
  addInMemoryCompanyManager,
  updateInMemoryCompanyManagerPassword,
  updateInMemoryCompanyManagerInfo,
  deleteInMemoryCompanyManager,
  updateInMemoryCompanySlackSettings,
  getInMemoryMilestones,
  saveInMemoryMilestone,
  deleteInMemoryMilestone,
} from "@/lib/seed-data";
import { sendSlackTestMessage, sendCompanyDigestMessage } from "@/lib/slack";

/**
 * 処理概要：
 * 管理者・企業向け各種アクションのディスパッチハンドラー
 *
 * @param request 送信されたNextRequest（actionおよびpayloadを含むJSON）
 * @returns 処理結果のNextResponse
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!isSupabaseConfigured()) {
      if (action === "test_slack_notification") {
        const { webhookUrl, companyName, channelName } = payload;
        const result = await sendSlackTestMessage(webhookUrl, companyName, channelName);
        if (!result.ok) {
          return NextResponse.json({ ok: false, error: result.error || "Slack送信に失敗しました。" }, { status: 400 });
        }
        return NextResponse.json({ ok: true, result });
      } else if (action === "send_slack_digest") {
        const { webhookUrl, companyName, companyId, channelName } = payload;
        const students = await getStudentsAnalyticsFromDb(companyId);
        const milestones = getInMemoryMilestones(companyId);
        const result = await sendCompanyDigestMessage(webhookUrl, companyName, students, milestones, channelName);
        if (!result.ok) {
          return NextResponse.json({ ok: false, error: result.error || "Slack送信に失敗しました。" }, { status: 400 });
        }
        return NextResponse.json({ ok: true, result });
      } else if (action === "save_milestone") {
        const saved = saveInMemoryMilestone({
          id: payload.id,
          company_id: payload.companyId,
          title: payload.title,
          target_date: payload.targetDate,
          target_problem_count: payload.targetProblemCount,
          order_index: payload.orderIndex,
        });
        return NextResponse.json({ ok: true, milestone: saved });
      } else if (action === "delete_milestone") {
        deleteInMemoryMilestone(payload.id);
        return NextResponse.json({ ok: true });
      } else if (action === "set_student_course_lock") {
        setInMemoryStudentCourseLock(
          payload.userId,
          payload.courseId,
          payload.status ?? "auto"
        );
      } else if (action === "create_company_manager") {
        const newMgr = addInMemoryCompanyManager({
          company_id: payload.companyId,
          full_name: payload.fullName,
          email: payload.email,
          password: payload.password,
        });
        return NextResponse.json({ ok: true, demo: true, manager: newMgr });
      } else if (action === "reset_company_manager_password") {
        const targetEmailOrId = payload.managerId || payload.email;
        updateInMemoryCompanyManagerPassword(
          targetEmailOrId,
          payload.newPassword
        );
        if (payload.email) {
          resetLoginAttemptsForEmail(payload.email);
        }
        return NextResponse.json({ ok: true, demo: true });
      } else if (action === "update_company_manager") {
        updateInMemoryCompanyManagerInfo(
          payload.managerId,
          payload.fullName,
          payload.email
        );
        return NextResponse.json({ ok: true, demo: true });
      } else if (action === "delete_company_manager") {
        deleteInMemoryCompanyManager(payload.managerId);
        return NextResponse.json({ ok: true, demo: true });
      } else if (action === "update_company") {
        const cleanEmail = payload.contact_email
          ? String(payload.contact_email).trim()
          : null;
        let managerUpdated = false;
        if (
          payload.slack_webhook_url !== undefined ||
          payload.slack_channel_name !== undefined ||
          payload.question_slack_webhook_url !== undefined ||
          payload.question_slack_channel_name !== undefined
        ) {
          updateInMemoryCompanySlackSettings(
            payload.companyId,
            payload.slack_webhook_url,
            payload.slack_channel_name,
            payload.question_slack_webhook_url,
            payload.question_slack_channel_name
          );
        }
        if (cleanEmail && payload.new_manager_password) {
          const pass = String(payload.new_manager_password).trim();
          const updated = updateInMemoryCompanyManagerPassword(cleanEmail, pass);
          if (!updated) {
            addInMemoryCompanyManager({
              company_id: payload.companyId,
              full_name: `${payload.name || "企業"} 研修担当者`,
              email: cleanEmail,
              password: pass,
            });
          }
          resetLoginAttemptsForEmail(cleanEmail);
          managerUpdated = true;
        }
        return NextResponse.json({
          ok: true,
          demo: true,
          managerUpdated,
          message: "ローカルデモモードで企業情報を更新しました。",
        });
      }

      return NextResponse.json({
        ok: true,
        demo: true,
        message: "ローカルデモモードで反映しました（Supabase未設定）。",
      });
    }

    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    // サービスロールキーがある場合は特権クライアントを使用（auth.admin.createUser等にも対応）
    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : userSupabase;

    // 権限の確認（admin または 評価コメント操作を行う company ロール）
    let callerRole = "admin";
    let callerCompanyId: string | null = null;
    let callerName = "担当者";

    if (user) {
      const { data: profile } = await db
        .from("profiles")
        .select("role, company_id, full_name")
        .eq("id", user.id)
        .maybeSingle();

      callerRole =
        profile?.role ??
        (user.user_metadata?.role as string | undefined) ??
        "admin";
      callerCompanyId = profile?.company_id ?? null;
      callerName =
        profile?.full_name ??
        (user.user_metadata?.full_name as string | undefined) ??
        "担当者";

      const isFeedbackAction =
        action === "create_feedback" ||
        action === "update_feedback" ||
        action === "delete_feedback";

      const isLockAction = action === "set_student_course_lock";
      const isSlackDigestAction = action === "send_slack_digest";

      if (
        callerRole !== "admin" &&
        !(callerRole === "company" && (isFeedbackAction || isLockAction || isSlackDigestAction))
      ) {
        return NextResponse.json(
          { error: "この操作を行う権限がありません。" },
          { status: 403 }
        );
      }
    }

    switch (action) {
      // 1. コースの新規作成
      case "create_course": {
        const { title, description, order_index } = payload;
        const { data, error } = await db
          .from("courses")
          .insert({
            title,
            description,
            order_index: order_index ?? 1,
            is_published: true,
          })
          .select("*")
          .single();
        if (error) throw error;
        return NextResponse.json({ ok: true, course: data });
      }

      // 2. コースの公開／非公開切替
      case "toggle_course_publish": {
        const { courseId, is_published } = payload;
        const { error } = await db
          .from("courses")
          .update({ is_published })
          .eq("id", courseId);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // 3. 章と初期単元の新規作成
      case "create_chapter_and_lesson": {
        const { courseId, chapterTitle, lessonTitle, order_index } = payload;
        const { data: chapter, error: chErr } = await db
          .from("chapters")
          .insert({
            course_id: courseId,
            title: chapterTitle,
            description: `${chapterTitle} の演習単元`,
            order_index: order_index ?? 1,
            is_published: true,
          })
          .select("*")
          .single();
        if (chErr) throw chErr;

        const { data: lesson, error: lesErr } = await db
          .from("lessons")
          .insert({
            chapter_id: chapter.id,
            title: lessonTitle,
            content_md: "",
            order_index: 1,
            is_published: true,
          })
          .select("*")
          .single();
        if (lesErr) throw lesErr;

        return NextResponse.json({ ok: true, chapter, lesson });
      }

      // 4. 章のドラッグ＆ドロップ並び替え順序の一括保存
      case "reorder_chapters": {
        const { orderedChapters }: { orderedChapters: { id: string; order_index: number }[] } =
          payload;
        for (const item of orderedChapters) {
          await db
            .from("chapters")
            .update({ order_index: item.order_index })
            .eq("id", item.id);
        }
        return NextResponse.json({ ok: true });
      }

      // 5. 章の公開／非公開切替
      case "toggle_chapter_publish": {
        const { chapterId, is_published } = payload;
        const { error } = await db
          .from("chapters")
          .update({ is_published })
          .eq("id", chapterId);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // 6. 問題（Java / SQL）・テストケース・段階的ヒントの新規作成または更新
      case "save_problem": {
        const {
          problemId,
          chapterId,
          title,
          description_md,
          difficulty,
          estimated_minutes,
          tags,
          starter_code,
          solution_code,
          explanation_md,
          test_cases,
          hints,
        } = payload;

        // 対象章に紐づく lesson_id を取得（なければ自動作成）
        let lessonId: string | null = null;
        const { data: existingLessons } = await db
          .from("lessons")
          .select("id")
          .eq("chapter_id", chapterId)
          .order("order_index", { ascending: true })
          .limit(1);

        if (existingLessons && existingLessons.length > 0) {
          lessonId = existingLessons[0].id;
        } else {
          const { data: newLes, error: lesErr } = await db
            .from("lessons")
            .insert({
              chapter_id: chapterId,
              title: "実践演習",
              content_md: "",
              order_index: 1,
              is_published: true,
            })
            .select("id")
            .single();
          if (lesErr) throw lesErr;
          lessonId = newLes.id;
        }

        let targetProblemId = problemId;

        if (problemId) {
          // 既存問題の更新
          const { error: upErr } = await db
            .from("problems")
            .update({
              lesson_id: lessonId,
              title,
              description_md,
              difficulty,
              estimated_minutes,
              tags,
              starter_code,
              solution_code,
              explanation_md,
              is_published: true,
            })
            .eq("id", problemId);
          if (upErr) throw upErr;
        } else {
          // 新規問題の作成
          const { data: createdProb, error: insErr } = await db
            .from("problems")
            .insert({
              lesson_id: lessonId,
              title,
              description_md,
              difficulty,
              estimated_minutes,
              tags,
              starter_code,
              solution_code,
              explanation_md,
              order_index: 1,
              is_published: true,
            })
            .select("id")
            .single();
          if (insErr) throw insErr;
          targetProblemId = createdProb.id;
        }

        // テストケースの洗い替え保存
        if (Array.isArray(test_cases)) {
          await db
            .from("test_cases")
            .delete()
            .eq("problem_id", targetProblemId);

          const tcRows = test_cases.map(
            (
              tc: {
                name: string;
                input: string;
                expected_output: string;
                is_hidden: boolean;
              },
              idx: number
            ) => ({
              problem_id: targetProblemId,
              name: tc.name,
              input: tc.input,
              expected_output: tc.expected_output,
              is_hidden: Boolean(tc.is_hidden),
              order_index: idx + 1,
            })
          );
          if (tcRows.length > 0) {
            const { error: tcErr } = await db.from("test_cases").insert(tcRows);
            if (tcErr) throw tcErr;
          }
        }

        // ヒント（1〜3）の洗い替え保存
        if (Array.isArray(hints)) {
          await db.from("hints").delete().eq("problem_id", targetProblemId);
          const hintRows = hints
            .filter((h: { content_md: string }) => h.content_md?.trim())
            .map((h: { step_number: number; content_md: string }) => ({
              problem_id: targetProblemId,
              step_number: h.step_number,
              content_md: h.content_md.trim(),
            }));
          if (hintRows.length > 0) {
            const { error: hErr } = await db.from("hints").insert(hintRows);
            if (hErr) throw hErr;
          }
        }

        return NextResponse.json({ ok: true, problemId: targetProblemId });
      }

      // 7. テナント企業の登録・企業コード発行・企業担当者アカウントの自動作成
      case "create_company": {
        const { name, company_code, contact_email, initial_password } = payload;
        const cleanName = String(name || "").trim();
        const cleanCode = String(company_code || "").trim().toUpperCase();
        const cleanEmail = contact_email ? String(contact_email).trim().toLowerCase() : null;
        const cleanPass = String(initial_password || "Password123!").trim();

        const { data: company, error: compErr } = await db
          .from("companies")
          .insert({
            name: cleanName,
            company_code: cleanCode,
            contact_email: cleanEmail,
          })
          .select("*")
          .single();

        if (compErr) {
          const isDup = compErr.code === "23505" || compErr.message?.includes("duplicate");
          return NextResponse.json(
            {
              ok: false,
              error: isDup
                ? `企業コード「${cleanCode}」はすでに登録されています。別の企業コードを指定してください。`
                : `DB登録エラー: ${compErr.message}`,
            },
            { status: isDup ? 409 : 500 }
          );
        }

        // サービスロールキーがある場合、企業担当者ログイン用アカウント（role='company'）も確実に作成・紐付け
        let accountCreated = false;
        let accountError: string | null = null;
        if (cleanEmail) {
          if (
            process.env.SUPABASE_SERVICE_ROLE_KEY &&
            !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ) {
            const adminClient = createAdminClient();
            const { data: createdAuth, error: authErr } =
              await adminClient.auth.admin.createUser({
                email: cleanEmail,
                password: cleanPass,
                email_confirm: true,
                user_metadata: {
                  full_name: `${cleanName} 研修担当者`,
                  role: "company",
                  company_code: cleanCode,
                },
              });

            if (!authErr && createdAuth.user) {
              const { error: profErr } = await adminClient
                .from("profiles")
                .upsert(
                  {
                    id: createdAuth.user.id,
                    email: cleanEmail,
                    full_name: `${cleanName} 研修担当者`,
                    role: "company",
                    company_id: company.id,
                  },
                  { onConflict: "id" }
                );
              if (profErr) {
                accountError = `プロファイル保存エラー: ${profErr.message}`;
              } else {
                accountCreated = true;
              }
            } else if (authErr) {
              // 既存メールアドレスがAuthに存在する場合は profiles または listUsers からID特定して修復・同期
              let existingUid: string | null = null;
              const { data: existProf } = await adminClient
                .from("profiles")
                .select("id")
                .eq("email", cleanEmail)
                .maybeSingle();
              if (existProf?.id) {
                existingUid = existProf.id;
              } else {
                const { data: listed } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
                const matched = listed?.users?.find(
                  (u) => (u.email || "").toLowerCase() === cleanEmail
                );
                if (matched?.id) existingUid = matched.id;
              }
              if (existingUid) {
                const { error: updAuthErr } = await adminClient.auth.admin.updateUserById(existingUid, {
                  password: cleanPass,
                  email_confirm: true,
                  user_metadata: {
                    full_name: `${cleanName} 研修担当者`,
                    role: "company",
                    company_code: cleanCode,
                  },
                });
                const { error: profUpErr } = await adminClient.from("profiles").upsert(
                  {
                    id: existingUid,
                    email: cleanEmail,
                    full_name: `${cleanName} 研修担当者`,
                    role: "company",
                    company_id: company.id,
                  },
                  { onConflict: "id" }
                );
                if (!updAuthErr && !profUpErr) {
                  accountCreated = true;
                } else {
                  accountError = updAuthErr?.message || profUpErr?.message || null;
                }
              } else {
                accountError = authErr.message;
              }
            }
          } else {
            accountError = "SUPABASE_SERVICE_ROLE_KEY が未設定のため担当者アカウントを自動発行できませんでした。";
          }
        }

        await recordAuditLog({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          actorRole: callerRole,
          action: "create_company",
          targetSummary: `テナント企業「${cleanName}」（コード: ${cleanCode}）を新規登録しました`,
          detail: { companyId: company.id, accountCreated },
        });

        return NextResponse.json({
          ok: true,
          company,
          accountCreated,
          accountError,
        });
      }

      // 8. 受講生への評価・コメントの新規登録（管理者・企業担当者共通）
      case "create_feedback": {
        const { student_id, submission_id, rating, comment } = payload;

        // 企業担当者の場合、自社の受講生であるか確認
        if (callerRole === "company" && callerCompanyId) {
          const { data: targetSt } = await db
            .from("profiles")
            .select("company_id")
            .eq("id", student_id)
            .maybeSingle();
          if (targetSt?.company_id && targetSt.company_id !== callerCompanyId) {
            return NextResponse.json(
              { error: "他社の受講生には評価・コメントを登録できません。" },
              { status: 403 }
            );
          }
        }

        let authorId = user?.id;
        if (!authorId) {
          const { data: anyAdmin } = await db
            .from("profiles")
            .select("id")
            .in("role", ["admin", "company"])
            .limit(1)
            .maybeSingle();
          authorId = anyAdmin?.id;
        }

        if (!authorId) {
          throw new Error("作成者プロファイルが見つかりません。");
        }

        const { data: fb, error: fbErr } = await db
          .from("feedbacks")
          .insert({
            student_id,
            admin_id: authorId,
            submission_id: submission_id ?? null,
            rating: Number(rating),
            comment: String(comment).trim(),
          })
          .select("*, admin:profiles!feedbacks_admin_id_fkey(id, full_name)")
          .single();

        if (fbErr) throw fbErr;
        return NextResponse.json({
          ok: true,
          feedback: fb,
          authorName: fb?.admin?.full_name ?? callerName,
        });
      }

      // 8-2. 既存の評価・コメントの編集（管理者・企業担当者共通）
      case "update_feedback": {
        const { feedback_id, rating, comment } = payload;

        // デモ用ID（eval-...）の場合はDBクエリをスキップして成功を返す
        if (String(feedback_id).startsWith("eval-")) {
          return NextResponse.json({ ok: true });
        }

        const { data: updatedFb, error: upFbErr } = await db
          .from("feedbacks")
          .update({
            rating: Number(rating),
            comment: String(comment).trim(),
          })
          .eq("id", feedback_id)
          .select("*, admin:profiles!feedbacks_admin_id_fkey(id, full_name)")
          .single();

        if (upFbErr) throw upFbErr;
        return NextResponse.json({ ok: true, feedback: updatedFb });
      }

      // 8-3. 評価・コメントの削除（管理者・企業担当者共通）
      case "delete_feedback": {
        const { feedback_id } = payload;
        if (String(feedback_id).startsWith("eval-")) {
          return NextResponse.json({ ok: true });
        }
        const { error: delFbErr } = await db
          .from("feedbacks")
          .delete()
          .eq("id", feedback_id);
        if (delFbErr) throw delFbErr;
        return NextResponse.json({ ok: true });
      }

      // 9. お知らせ（全体／テナント企業別）の配信登録
      case "create_announcement": {
        const { title, content_md, company_id } = payload;
        const { data: ann, error: annErr } = await db
          .from("announcements")
          .insert({
            title: String(title).trim(),
            content_md: String(content_md).trim(),
            company_id: company_id || null,
            created_by: user?.id ?? null,
          })
          .select("*")
          .single();

        if (annErr) throw annErr;
        return NextResponse.json({ ok: true, announcement: ann });
      }

      // 10. テナント企業ごとのコース表示／非表示トグル切替
      case "toggle_company_course_visibility": {
        const { companyId, courseId, is_visible } = payload;
        const { error: ccErr } = await db.from("company_courses").upsert(
          {
            company_id: companyId,
            course_id: courseId,
            is_visible: Boolean(is_visible),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "company_id,course_id" }
        );
        if (ccErr) throw ccErr;
        return NextResponse.json({ ok: true });
      }

      // 11. テナント企業情報の編集・更新（企業名・企業コード・担当者メール・担当者招待/PW更新）
      case "update_company": {
        const {
          companyId,
          name,
          company_code,
          contact_email,
          new_manager_password,
        } = payload;
        const cleanCode = String(company_code).trim().toUpperCase();
        const cleanEmail = contact_email ? String(contact_email).trim() : null;

        if (
          payload.slack_webhook_url !== undefined ||
          payload.slack_channel_name !== undefined ||
          payload.question_slack_webhook_url !== undefined ||
          payload.question_slack_channel_name !== undefined
        ) {
          updateInMemoryCompanySlackSettings(
            companyId,
            payload.slack_webhook_url,
            payload.slack_channel_name,
            payload.question_slack_webhook_url,
            payload.question_slack_channel_name
          );
        }

        const compUpdateData: Record<string, unknown> = {
          name: String(name).trim(),
          company_code: cleanCode,
          contact_email: cleanEmail,
        };
        if (payload.slack_webhook_url !== undefined) {
          compUpdateData.slack_webhook_url = payload.slack_webhook_url;
        }
        if (payload.slack_channel_name !== undefined) {
          compUpdateData.slack_channel_name = payload.slack_channel_name;
        }
        if (payload.question_slack_webhook_url !== undefined) {
          compUpdateData.question_slack_webhook_url = payload.question_slack_webhook_url;
        }
        if (payload.question_slack_channel_name !== undefined) {
          compUpdateData.question_slack_channel_name = payload.question_slack_channel_name;
        }

        const { data: updatedCompany, error: upErr } = await db
          .from("companies")
          .update(compUpdateData)
          .eq("id", companyId)
          .select("*")
          .maybeSingle();

        if (upErr) {
          return NextResponse.json(
            {
              error: `DB保存エラー: ${upErr.message}（カラム追加直後の場合はSupabaseで NOTIFY pgrst, 'reload schema'; を実行してください）`,
            },
            { status: 500 }
          );
        }
        if (!updatedCompany) {
          return NextResponse.json(
            {
              error:
                "企業レコードの更新が反映されませんでした（RLS権限またはSUPABASE_SERVICE_ROLE_KEY設定を確認してください）。",
            },
            { status: 403 }
          );
        }

        // もし新しいパスワードが指定されており、サービスロールキーがある場合は企業担当者アカウントを作成またはPW更新
        let managerUpdated = false;
        if (cleanEmail && new_manager_password) {
          const pass = String(new_manager_password).trim();
          updateInMemoryCompanyManagerPassword(cleanEmail, pass);
          resetLoginAttemptsForEmail(cleanEmail);
          managerUpdated = true;
        }

        if (
          cleanEmail &&
          new_manager_password &&
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          const { data: existingProf } = await adminClient
            .from("profiles")
            .select("id")
            .eq("email", cleanEmail)
            .maybeSingle();

          if (existingProf?.id) {
            const { error: pwErr } =
              await adminClient.auth.admin.updateUserById(existingProf.id, {
                password: String(new_manager_password),
                user_metadata: {
                  full_name: `${name} 研修担当者`,
                  role: "company",
                  company_code: cleanCode,
                },
              });
            await adminClient
              .from("profiles")
              .update({ role: "company", company_id: companyId })
              .eq("id", existingProf.id);
            if (!pwErr) managerUpdated = true;
          } else {
            const { data: createdAuth, error: createErr } =
              await adminClient.auth.admin.createUser({
                email: cleanEmail,
                password: String(new_manager_password),
                email_confirm: true,
                user_metadata: {
                  full_name: `${name} 研修担当者`,
                  role: "company",
                  company_code: cleanCode,
                },
              });
            if (!createErr && createdAuth.user) {
              await adminClient
                .from("profiles")
                .update({ role: "company", company_id: companyId })
                .eq("id", createdAuth.user.id);
              managerUpdated = true;
            }
          }
        }

        await recordAuditLog({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          actorRole: callerRole,
          action: "update_company",
          targetSummary: `企業「${name}」の設定を更新しました（コード: ${cleanCode}）`,
          detail: { companyId, companyCode: cleanCode },
        });
        return NextResponse.json({
          ok: true,
          company: updatedCompany,
          managerUpdated,
        });
      }

      // 12. テナント企業の削除
      case "delete_company": {
        const { companyId } = payload;
        const { error: delErr } = await db
          .from("companies")
          .delete()
          .eq("id", companyId);
        if (delErr) throw delErr;
        return NextResponse.json({ ok: true });
      }

      // 13. 受講生ごとの教材コース受講制限・個別ロック/解放設定
      case "set_student_course_lock": {
        const { userId, courseId, status, note } = payload;
        // status は "auto" | "unlocked" | "locked"
        const validStatus =
          status === "unlocked" || status === "locked" ? status : "auto";

        // 企業担当者の場合は自社受講生か確認
        if (callerRole === "company") {
          const { data: studentProfile } = await db
            .from("profiles")
            .select("company_id")
            .eq("id", userId)
            .maybeSingle();

          if (
            !studentProfile ||
            studentProfile.company_id !== callerCompanyId
          ) {
            return NextResponse.json(
              { error: "自社所属以外の受講生の設定を変更することはできません。" },
              { status: 403 }
            );
          }
        }

        // インメモリにも保存
        setInMemoryStudentCourseLock(userId, courseId, validStatus);

        try {
          const { error: lockErr } = await db
            .from("student_course_locks")
            .upsert(
              {
                user_id: userId,
                course_id: courseId,
                status: validStatus,
                note: note ?? null,
                updated_by: user?.id ?? null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,course_id" }
            );
          if (lockErr) {
            console.warn("student_course_locks upsert warning:", lockErr.message);
          }
        } catch (dbErr) {
          console.warn("student_course_locks table might not exist yet:", dbErr);
        }

        return NextResponse.json({
          ok: true,
          userId,
          courseId,
          status: validStatus,
        });
      }

      // 14. 企業担当者（マネージャー）アカウントの新規作成
      case "create_company_manager": {
        const { companyId, fullName, email, password } = payload;
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanName = String(fullName || "企業担当者").trim();
        const cleanPass = String(password).trim();

        if (!cleanEmail || !cleanPass) {
          return NextResponse.json(
            { error: "メールアドレスとパスワードを入力してください。" },
            { status: 400 }
          );
        }

        // 企業の企業コードを取得
        const { data: comp } = await db
          .from("companies")
          .select("company_code")
          .eq("id", companyId)
          .maybeSingle();

        const compCode = comp?.company_code ?? "CORP";

        // インメモリストアに同期登録
        const localMgr = addInMemoryCompanyManager({
          company_id: companyId,
          full_name: cleanName,
          email: cleanEmail,
          password: cleanPass,
        });

        if (
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          const { data: authUser, error: authErr } =
            await adminClient.auth.admin.createUser({
              email: cleanEmail,
              password: cleanPass,
              email_confirm: true,
              user_metadata: {
                full_name: cleanName,
                role: "company",
                company_code: compCode,
              },
            });

          if (authErr) {
            // すでにAuthに存在する場合は profiles または auth.admin.listUsers からIDを特定して修復・紐付け
            let existingUid: string | null = null;
            const { data: existUser } = await adminClient
              .from("profiles")
              .select("id")
              .eq("email", cleanEmail)
              .maybeSingle();
            if (existUser?.id) {
              existingUid = existUser.id;
            } else {
              const { data: listed } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
              const matched = listed?.users?.find(
                (u) => (u.email || "").toLowerCase() === cleanEmail
              );
              if (matched?.id) existingUid = matched.id;
            }

            if (existingUid) {
              const { error: updErr } = await adminClient.auth.admin.updateUserById(existingUid, {
                password: cleanPass,
                email_confirm: true,
                user_metadata: {
                  full_name: cleanName,
                  role: "company",
                  company_code: compCode,
                },
              });
              if (updErr) throw updErr;
              const { error: profErr } = await adminClient.from("profiles").upsert(
                {
                  id: existingUid,
                  email: cleanEmail,
                  full_name: cleanName,
                  role: "company",
                  company_id: companyId,
                },
                { onConflict: "id" }
              );
              if (profErr) throw profErr;
              localMgr.id = existingUid;
            } else {
              throw authErr;
            }
          } else if (authUser?.user) {
            await adminClient.from("profiles").upsert(
              {
                id: authUser.user.id,
                email: cleanEmail,
                full_name: cleanName,
                role: "company",
                company_id: companyId,
              },
              { onConflict: "id" }
            );
          }
        }

        return NextResponse.json({ ok: true, manager: localMgr });
      }

      // 15. 企業担当者（マネージャー）のパスワード再設定
      case "reset_company_manager_password": {
        const { managerId, email, newPassword } = payload;
        const cleanPass = String(newPassword).trim();
        if (!cleanPass || cleanPass.length < 6) {
          return NextResponse.json(
            { error: "パスワードは6文字以上で入力してください。" },
            { status: 400 }
          );
        }

        updateInMemoryCompanyManagerPassword(managerId || email, cleanPass);
        if (email) {
          resetLoginAttemptsForEmail(email);
        }

        if (
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          let targetUid = managerId;
          if (!targetUid && email) {
            const { data: p } = await adminClient
              .from("profiles")
              .select("id")
              .eq("email", email)
              .maybeSingle();
            targetUid = p?.id;
          }

          if (targetUid) {
            const { error: pwErr } =
              await adminClient.auth.admin.updateUserById(targetUid, {
                password: cleanPass,
              });
            if (pwErr) throw pwErr;
          }
        }

        await recordAuditLog({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          actorRole: callerRole,
          action: "reset_manager_password",
          targetSummary: `企業担当者(${email || managerId})のパスワードを再設定しました`,
          detail: { managerId, email },
        });
        return NextResponse.json({ ok: true });
      }

      // 16. 企業担当者（マネージャー）の氏名・メールアドレス更新
      case "update_company_manager": {
        const { managerId, fullName, email } = payload;
        const cleanName = String(fullName || "").trim();
        const cleanEmail = String(email || "").trim().toLowerCase();

        updateInMemoryCompanyManagerInfo(managerId, cleanName, cleanEmail);

        if (
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          await adminClient.auth.admin.updateUserById(managerId, {
            email: cleanEmail,
            user_metadata: { full_name: cleanName },
          });
          await adminClient
            .from("profiles")
            .update({ email: cleanEmail, full_name: cleanName })
            .eq("id", managerId);
        }

        return NextResponse.json({ ok: true });
      }

      // 17. 企業担当者（マネージャー）アカウントの削除
      case "delete_company_manager": {
        const { managerId } = payload;
        deleteInMemoryCompanyManager(managerId);

        if (
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          try {
            await adminClient.auth.admin.deleteUser(managerId);
          } catch {
            // ignore
          }
          await adminClient.from("profiles").delete().eq("id", managerId);
        }

        return NextResponse.json({ ok: true });
      }

      // 18. Slackテスト通知送信
      case "test_slack_notification": {
        const { webhookUrl, companyName, channelName } = payload;
        const result = await sendSlackTestMessage(webhookUrl, companyName, channelName);
        if (!result.ok) {
          return NextResponse.json({ ok: false, error: result.error || "Slack送信に失敗しました。" }, { status: 400 });
        }
        return NextResponse.json({ ok: true, result });
      }

      // 19. 研修進捗ダイジェストSlack送信
      case "send_slack_digest": {
        const { webhookUrl, companyName, companyId, channelName } = payload;
        const students = await getStudentsAnalyticsFromDb(companyId);
        const milestones = await getMilestonesFromDb(companyId);
        const result = await sendCompanyDigestMessage(webhookUrl, companyName, students, milestones, channelName);
        if (!result.ok) {
          return NextResponse.json({ ok: false, error: result.error || "Slack送信に失敗しました。" }, { status: 400 });
        }
        return NextResponse.json({ ok: true, result });
      }

      // 20. 研修スケジュール（目標マイルストーン）保存（Supabase永続化）
      case "save_milestone": {
        const savedLocal = saveInMemoryMilestone({
          id: payload.id,
          company_id: payload.companyId,
          title: payload.title,
          target_date: payload.targetDate,
          target_problem_count: payload.targetProblemCount,
          order_index: payload.orderIndex,
        });
        let savedRow = savedLocal;
        try {
          const rowPayload: Record<string, unknown> = {
            company_id: payload.companyId,
            title: String(payload.title || "").trim(),
            target_date: payload.targetDate,
            course_id: payload.courseId || null,
            target_problem_count: Number(payload.targetProblemCount) || 0,
            description: payload.description || null,
            order_index: Number(payload.orderIndex) || 1,
          };
          if (payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id)) {
            rowPayload.id = payload.id;
          }
          const { data: msData, error: msErr } = await db
            .from("training_milestones")
            .upsert(rowPayload, { onConflict: "id" })
            .select("*")
            .single();
          if (!msErr && msData) {
            savedRow = msData;
          }
        } catch {
          // training_milestones テーブル未作成時はインメモリ保存にフォールバック
        }
        await recordAuditLog({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          actorRole: callerRole,
          action: "save_milestone",
          targetSummary: `目標マイルストーン「${payload.title}」(${payload.targetDate})を保存しました`,
          detail: { milestoneId: savedRow.id, companyId: payload.companyId },
        });
        return NextResponse.json({ ok: true, milestone: savedRow });
      }

      // 21. 研修スケジュール（目標マイルストーン）削除（Supabase永続化）
      case "delete_milestone": {
        deleteInMemoryMilestone(payload.id);
        try {
          await db.from("training_milestones").delete().eq("id", payload.id);
        } catch {
          // ignore
        }
        await recordAuditLog({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          actorRole: callerRole,
          action: "delete_milestone",
          targetSummary: `目標マイルストーン(${payload.id})を削除しました`,
          detail: { milestoneId: payload.id },
        });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json(
          { error: `未知のアクション: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "データベース保存中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
