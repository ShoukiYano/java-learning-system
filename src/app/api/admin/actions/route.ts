// =============================================================================
// 管理者専用 CRUD 永続化 Route Handler (POST /api/admin/actions)
// - コース作成・公開/非公開切替
// - 章・単元の作成、公開/非公開切替、ドラッグ&ドロップ並び替え順序のDB保存
// - 問題（Java / SQL）・テストケース（公開/非公開）・段階的ヒント（1〜3）の保存
// - テナント（企業）登録・企業コード発行・企業担当者アカウント招待（auth.admin.createUser）
// - 受講生へのフィードバック・5段階評価の登録
// - お知らせ（全体／テナント企業別）の配信登録
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/data-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!isSupabaseConfigured()) {
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

      if (callerRole !== "admin" && !(callerRole === "company" && isFeedbackAction)) {
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
        const cleanCode = String(company_code).trim().toUpperCase();

        const { data: company, error: compErr } = await db
          .from("companies")
          .insert({
            name: String(name).trim(),
            company_code: cleanCode,
            contact_email: contact_email ? String(contact_email).trim() : null,
          })
          .select("*")
          .single();

        if (compErr) throw compErr;

        // サービスロールキーがある場合、企業担当者ログイン用アカウント（role='company'）も同時に作成
        let accountCreated = false;
        if (
          contact_email &&
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ) {
          const adminClient = createAdminClient();
          const { data: createdAuth, error: authErr } =
            await adminClient.auth.admin.createUser({
              email: String(contact_email).trim(),
              password: initial_password || "Password123!",
              email_confirm: true,
              user_metadata: {
                full_name: `${name} 研修担当者`,
                role: "company",
                company_code: cleanCode,
              },
            });

          if (!authErr && createdAuth.user) {
            accountCreated = true;
            await adminClient
              .from("profiles")
              .update({
                role: "company",
                company_id: company.id,
              })
              .eq("id", createdAuth.user.id);
          }
        }

        return NextResponse.json({
          ok: true,
          company,
          accountCreated,
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

        const { data: updatedCompany, error: upErr } = await db
          .from("companies")
          .update({
            name: String(name).trim(),
            company_code: cleanCode,
            contact_email: cleanEmail,
          })
          .eq("id", companyId)
          .select("*")
          .single();

        if (upErr) throw upErr;

        // もし新しいパスワードが指定されており、サービスロールキーがある場合は企業担当者アカウントを作成またはPW更新
        let managerUpdated = false;
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
