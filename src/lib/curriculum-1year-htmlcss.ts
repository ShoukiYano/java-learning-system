import type { SeedChapter, SeedProblem } from "@/lib/seed-data";
import type { HtmlCssStarterSpec } from "@/lib/htmlcss/htmlcss-evaluator";

export const SEED_HTMLCSS_COURSE_ID = "11111111-1111-4111-8111-111111111113";

function hcStarter(spec: HtmlCssStarterSpec): string {
  return JSON.stringify(spec);
}

function hcSolution(html: string, css: string): string {
  return JSON.stringify({ html, css });
}

export const HTMLCSS_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222221301",
    course_id: SEED_HTMLCSS_COURSE_ID,
    title: "第1章：HTML基礎（見出し・リスト・リンク・テーブル）",
    description: "コードを書いた瞬間に右側のプレビュー画面が変わるライブ演習でHTMLの基本タグを習得します。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333331301",
    lesson_title: "HTMLドキュメント構造と表組み",
  },
  {
    id: "22222222-2222-4222-8222-222222221302",
    course_id: SEED_HTMLCSS_COURSE_ID,
    title: "第2章：HTMLフォームとCSS装飾・ボックスモデル",
    description: "業務システムに必須の入力フォームと、CSSのクラス・色・余白（padding/margin/border）を学びます。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333331302",
    lesson_title: "フォーム作成とCSSスタイリング基礎",
  },
  {
    id: "22222222-2222-4222-8222-222222221303",
    course_id: SEED_HTMLCSS_COURSE_ID,
    title: "第3章：Flexbox & CSS Gridによるモダンレイアウト",
    description: "ヘッダーナビゲーション、横並び商品カード、グリッドダッシュボードを自在に配置します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333331303",
    lesson_title: "FlexboxとGridレイアウト実践",
  },
  {
    id: "22222222-2222-4222-8222-222222221304",
    course_id: SEED_HTMLCSS_COURSE_ID,
    title: "第4章：レスポンシブ対応＆業務Web画面総合仕上げ",
    description: "ホバー効果・バッジ配置・メディアクエリによるスマホ対応・Spring Boot画面を意識した一覧ページを完成させます。",
    order_index: 4,
    lesson_id: "33333333-3333-4333-8333-333333331304",
    lesson_title: "レスポンシブ設計と総合画面制作",
  },
];

export const HTMLCSS_PROBLEMS: SeedProblem[] = [
  // 1-1
  {
    id: "44444444-4444-4444-8444-444444441301",
    lesson_id: "33333333-3333-4333-8333-333333331301",
    chapter_id: "22222222-2222-4222-8222-222222221301",
    language: "htmlcss",
    title: "HTML&CSS 1-1：見出し・段落・リストで自己紹介ページを作ろう",
    description_md: `## 課題：HTMLの基本タグで文章構造を作る

HTMLは **「タグ（\`<...>\`）」** で文章の意味をマークアップする言語です。エディタに書いたコードは右側のプレビュー画面へリアルタイム反映されます。

### 作成する要素
1. \`<h1>\` タグでタイトル（例：\`エンジニア自己紹介\`）を表示する
2. \`<p>\` タグで自己紹介文を1つ以上書く
3. \`<ul>\` の中に \`<li>\` タグを **3つ以上** 使って学習目標リストを作る`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["HTML", "見出し", "リスト"],
    starter_code: hcStarter({
      html: `<!-- ここに h1、p、ul > li(3つ以上) を書いてみましょう -->\n<h1></h1>\n`,
      css: `h1 {\n  color: #1e3a8a;\n}\n`,
      checks: [
        { id: "c1", label: "<h1> タグが存在する", type: "htmlTag", tag: "h1" },
        { id: "c2", label: "<p> タグが存在する", type: "htmlTag", tag: "p" },
        { id: "c3", label: "<ul> タグが存在する", type: "htmlTag", tag: "ul" },
        { id: "c4", label: "<li> タグが3つ以上存在する", type: "htmlTagMinCount", tag: "li", minCount: 3 },
      ],
    }),
    solution_code: hcSolution(
      `<h1>エンジニア自己紹介</h1>\n<p>1年間のカリキュラムでWebアプリ開発を習得します。</p>\n<ul>\n  <li>HTMLとCSSで画面を作る</li>\n  <li>JavaとSQLでサーバー処理を作る</li>\n  <li>チーム開発を完遂する</li>\n</ul>`,
      `h1 {\n  color: #1e3a8a;\n}\n`
    ),
    explanation_md: "`<h1>` はページの大見出し、`<p>` は段落、`<ul>` + `<li>` は箇条書きリストを表します。",
    order_index: 1,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "箇条書きは `<ul>` で囲み、その中に `<li>項目</li>` を3つ並べます。" },
    ],
  },
  // 1-2
  {
    id: "44444444-4444-4444-8444-444444441302",
    lesson_id: "33333333-3333-4333-8333-333333331301",
    chapter_id: "22222222-2222-4222-8222-222222221301",
    language: "htmlcss",
    title: "HTML&CSS 1-2：リンク（aタグ）とクラス属性を使ったナビメニュー",
    description_md: `## 課題：リンクとクラス名を設定する

Webサイトで別ページへ移動するには \`<a href="URL">リンク文字</a>\` を使います。

### 作成する要素
1. \`<nav class="menu">\` を作成する
2. その中に \`<a href="...">\` を **3つ以上** 配置する（例：\`href="#home"\` 等）
3. CSSで \`.menu a\` の文字色（\`color\`）を指定する`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["HTML", "aタグ", "class"],
    starter_code: hcStarter({
      html: `<nav class="menu">\n  <!-- ここにリンクを3つ以上追加してください -->\n  <a href="#home">ホーム</a>\n</nav>\n`,
      css: `.menu a {\n  margin-right: 16px;\n  text-decoration: none;\n  /* color を指定してください */\n}\n`,
      checks: [
        { id: "c1", label: '<nav class="menu"> が存在する', type: "htmlAttr", tag: "nav", attr: "class", value: "menu" },
        { id: "c2", label: "<a> タグが3つ以上存在する", type: "htmlTagMinCount", tag: "a", minCount: 3 },
        { id: "c3", label: "<a> タグに href 属性がある", type: "htmlAttr", tag: "a", attr: "href" },
        { id: "c4", label: "CSSで .menu a に color が指定されている", type: "cssRule", selector: ".menu a", property: "color" },
      ],
    }),
    solution_code: hcSolution(
      `<nav class="menu">\n  <a href="#home">ホーム</a>\n  <a href="#products">商品一覧</a>\n  <a href="#contact">お問い合わせ</a>\n</nav>`,
      `.menu a {\n  margin-right: 16px;\n  text-decoration: none;\n  color: #2563eb;\n  font-weight: bold;\n}`
    ),
    explanation_md: "`class` 属性を付けることで、CSSから `.クラス名` セレクタで特定の要素だけにデザインを当てられます。",
    order_index: 2,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: '`<a href="#products">商品一覧</a>` のように3つ並べ、CSSの `.menu a` 内に `color: #2563eb;` などを追加します。' },
    ],
  },
  // 1-3
  {
    id: "44444444-4444-4444-8444-444444441303",
    lesson_id: "33333333-3333-4333-8333-333333331301",
    chapter_id: "22222222-2222-4222-8222-222222221301",
    language: "htmlcss",
    title: "HTML&CSS 1-3：商品一覧テーブル（table / thead / tbody）を作ろう",
    description_md: `## 課題：業務システムで必須のテーブル構造を作る

後半の「商品管理システム」でも一番よく使うのが \`<table>\` タグです。

### 作成する要素
1. \`<table>\` の中に \`<thead>\` と \`<tbody>\` を作成する
2. 見出しセル \`<th>\` を **3つ以上**（例：商品名・価格・在庫）配置する
3. データセル \`<td>\` を **6つ以上**（2行×3列以上）配置する
4. CSSで \`table\` に \`border-collapse: collapse\` を指定する`,
    difficulty: "easy",
    estimated_minutes: 20,
    tags: ["HTML", "table", "業務画面"],
    starter_code: hcStarter({
      html: `<h2>商品一覧</h2>\n<table>\n  <thead>\n    <tr>\n      <th>商品名</th>\n      <!-- 価格・在庫の th を追加 -->\n    </tr>\n  </thead>\n  <tbody>\n    <!-- 2行分のデータ行 (tr > td) を追加 -->\n  </tbody>\n</table>\n`,
      css: `table {\n  width: 100%;\n  /* border-collapse を指定してください */\n}\nth, td {\n  border: 1px solid #cbd5e1;\n  padding: 8px 12px;\n  text-align: left;\n}\nth {\n  background-color: #f1f5f9;\n}\n`,
      checks: [
        { id: "c1", label: "<table> と <thead> と <tbody> がある", type: "htmlTag", tag: "tbody" },
        { id: "c2", label: "<th> が3つ以上ある", type: "htmlTagMinCount", tag: "th", minCount: 3 },
        { id: "c3", label: "<td> が6つ以上ある", type: "htmlTagMinCount", tag: "td", minCount: 6 },
        { id: "c4", label: "CSSで table に border-collapse: collapse がある", type: "cssRule", selector: "table", property: "border-collapse", value: "collapse" },
      ],
    }),
    solution_code: hcSolution(
      `<h2>商品一覧</h2>\n<table>\n  <thead>\n    <tr>\n      <th>商品名</th>\n      <th>価格</th>\n      <th>在庫</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ノートPC</td>\n      <td>120,000円</td>\n      <td>15</td>\n    </tr>\n    <tr>\n      <td>マウス</td>\n      <td>3,500円</td>\n      <td>42</td>\n    </tr>\n  </tbody>\n</table>`,
      `table {\n  width: 100%;\n  border-collapse: collapse;\n}\nth, td {\n  border: 1px solid #cbd5e1;\n  padding: 8px 12px;\n  text-align: left;\n}\nth {\n  background-color: #f1f5f9;\n}`
    ),
    explanation_md: "`border-collapse: collapse;` を指定すると、セル同士の二重線がすっきり1本線になります。",
    order_index: 3,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "1行は `<tr>...</tr>`、見出しセルは `<th>`、データセルは `<td>` で記述します。" },
    ],
  },
  // 2-1
  {
    id: "44444444-4444-4444-8444-444444441304",
    lesson_id: "33333333-3333-4333-8333-333333331302",
    chapter_id: "22222222-2222-4222-8222-222222221302",
    language: "htmlcss",
    title: "HTML&CSS 2-1：ログイン＆登録フォーム（form / label / input / button）",
    description_md: `## 課題：Spring Bootへ送信できる入力フォームを作る

### 作成する要素
1. \`<form>\` タグを作成する
2. \`<label>\` を **2つ以上** 配置する
3. \`<input type="email">\` と \`<input type="password">\` を配置する
4. \`<button type="submit">\` ボタンを配置する`,
    difficulty: "easy",
    estimated_minutes: 20,
    tags: ["HTML", "form", "input"],
    starter_code: hcStarter({
      html: `<form class="login-form">\n  <h2>ログイン</h2>\n  <!-- メールアドレス・パスワードの label/input と submit button を追加 -->\n</form>\n`,
      css: `.login-form {\n  max-width: 340px;\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\nlabel {\n  display: block;\n  margin-top: 12px;\n  font-size: 14px;\n  font-weight: bold;\n}\ninput {\n  width: 100%;\n  padding: 8px;\n  margin-top: 4px;\n  border: 1px solid #cbd5e1;\n  border-radius: 6px;\n}\nbutton {\n  margin-top: 16px;\n  width: 100%;\n  padding: 10px;\n  background-color: #2563eb;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n}\n`,
      checks: [
        { id: "c1", label: "<form> タグが存在する", type: "htmlTag", tag: "form" },
        { id: "c2", label: "<label> が2つ以上存在する", type: "htmlTagMinCount", tag: "label", minCount: 2 },
        { id: "c3", label: 'type="email" の input がある', type: "htmlAttr", tag: "input", attr: "type", value: "email" },
        { id: "c4", label: 'type="password" の input がある', type: "htmlAttr", tag: "input", attr: "type", value: "password" },
        { id: "c5", label: 'type="submit" の button がある', type: "htmlAttr", tag: "button", attr: "type", value: "submit" },
      ],
    }),
    solution_code: hcSolution(
      `<form class="login-form">\n  <h2>ログイン</h2>\n  <label for="email">メールアドレス</label>\n  <input id="email" type="email" placeholder="user@example.com" />\n  <label for="pw">パスワード</label>\n  <input id="pw" type="password" />\n  <button type="submit">ログイン</button>\n</form>`,
      `.login-form {\n  max-width: 340px;\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\nlabel { display: block; margin-top: 12px; font-size: 14px; font-weight: bold; }\ninput { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 6px; }\nbutton { margin-top: 16px; width: 100%; padding: 10px; background-color: #2563eb; color: #fff; border: none; border-radius: 6px; }`
    ),
    explanation_md: "`type=\"email\"` や `type=\"password\"` を使うと、ブラウザ標準の入力補助や伏せ字表示が自動で有効になります。",
    order_index: 4,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: '`<input type="email" />`、`<input type="password" />`、`<button type="submit">ログイン</button>` を `<form>` 内に入れます。' },
    ],
  },
  // 2-2
  {
    id: "44444444-4444-4444-8444-444444441305",
    lesson_id: "33333333-3333-4333-8333-333333331302",
    chapter_id: "22222222-2222-4222-8222-222222221302",
    language: "htmlcss",
    title: "HTML&CSS 2-2：ボックスモデル（padding / margin / border-radius）を体感しよう",
    description_md: `## 課題：お知らせカードをCSSボックスモデルで整える

\`\`\`mermaid
graph TD
    M["margin（外側の余白）"] --> B["border（枠線）"]
    B --> P["padding（内側の余白）"]
    P --> C["Content（文字や画像）"]
\`\`\`

### CSSで \`.card\` に以下を指定してください
1. \`background-color\`（例：\`#f8fafc\`）
2. \`padding\`（例：\`20px\`）
3. \`margin\`（例：\`16px\`）
4. \`border\`（例：\`1px solid #cbd5e1\`）
5. \`border-radius\`（例：\`12px\`）`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["CSS", "ボックスモデル"],
    starter_code: hcStarter({
      html: `<div class="card">\n  <h3>システムメンテナンスのお知らせ</h3>\n  <p>日曜日の午前2時〜4時はメンテナンスのため停止します。</p>\n</div>\n`,
      css: `.card {\n  /* background-color, padding, margin, border, border-radius を追加 */\n}\n`,
      checks: [
        { id: "c1", label: ".card に background-color を指定", type: "cssRule", selector: ".card", property: "background-color" },
        { id: "c2", label: ".card に padding を指定", type: "cssRule", selector: ".card", property: "padding" },
        { id: "c3", label: ".card に margin を指定", type: "cssRule", selector: ".card", property: "margin" },
        { id: "c4", label: ".card に border を指定", type: "cssRule", selector: ".card", property: "border" },
        { id: "c5", label: ".card に border-radius を指定", type: "cssRule", selector: ".card", property: "border-radius" },
      ],
    }),
    solution_code: hcSolution(
      `<div class="card">\n  <h3>システムメンテナンスのお知らせ</h3>\n  <p>日曜日の午前2時〜4時はメンテナンスのため停止します。</p>\n</div>`,
      `.card {\n  background-color: #f8fafc;\n  padding: 20px;\n  margin: 16px;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n}`
    ),
    explanation_md: "内側の余白が `padding`、外側の余白が `margin` です。この区別がつくとWebデザインの崩れが一気に減ります。",
    order_index: 5,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "CSSタブに切り替え、`.card { ... }` の中に5つのプロパティを追記しましょう。" },
    ],
  },
  // 2-3
  {
    id: "44444444-4444-4444-8444-444444441306",
    lesson_id: "33333333-3333-4333-8333-333333331302",
    chapter_id: "22222222-2222-4222-8222-222222221302",
    language: "htmlcss",
    title: "HTML&CSS 2-3：モダンなボタンデザインと :hover 擬似クラス",
    description_md: `## 課題：マウスを乗せると色が変わるプライマリボタンを作る

### CSSの設定内容
1. \`.btn-primary\` に \`background-color\`・\`color\`・\`padding\`・\`border-radius\` を設定する
2. \`.btn-primary:hover\` にマウスホバー時の \`background-color\` を設定する`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["CSS", "hover", "ボタン"],
    starter_code: hcStarter({
      html: `<button class="btn-primary">新規商品を登録</button>\n`,
      css: `.btn-primary {\n  border: none;\n  cursor: pointer;\n  font-weight: bold;\n  /* ここにスタイルを追加 */\n}\n\n.btn-primary:hover {\n  /* ホバー時の背景色を指定 */\n}\n`,
      checks: [
        { id: "c1", label: ".btn-primary に background-color", type: "cssRule", selector: ".btn-primary", property: "background-color" },
        { id: "c2", label: ".btn-primary に color", type: "cssRule", selector: ".btn-primary", property: "color" },
        { id: "c3", label: ".btn-primary に padding", type: "cssRule", selector: ".btn-primary", property: "padding" },
        { id: "c4", label: ".btn-primary:hover に background-color", type: "cssRule", selector: ".btn-primary:hover", property: "background-color" },
      ],
    }),
    solution_code: hcSolution(
      `<button class="btn-primary">新規商品を登録</button>`,
      `.btn-primary {\n  border: none;\n  cursor: pointer;\n  font-weight: bold;\n  background-color: #2563eb;\n  color: #ffffff;\n  padding: 10px 20px;\n  border-radius: 8px;\n}\n.btn-primary:hover {\n  background-color: #1d4ed8;\n}`
    ),
    explanation_md: "`:hover` 擬似クラスを付けると、操作できるボタンであることがユーザーに直感的に伝わります。",
    order_index: 6,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "ホバー時は通常色（`#2563eb`）より少し濃い青（`#1d4ed8`）などにすると自然です。" },
    ],
  },
  // 3-1
  {
    id: "44444444-4444-4444-8444-444444441307",
    lesson_id: "33333333-3333-4333-8333-333333331303",
    chapter_id: "22222222-2222-4222-8222-222222221303",
    language: "htmlcss",
    title: "HTML&CSS 3-1：Flexboxでアプリのヘッダーナビゲーションを作ろう",
    description_md: `## 課題：左にロゴ、右にメニューを配置する共通ヘッダー

Flexbox（\`display: flex\`）は現代のWebレイアウトの主役です。

### CSSで \`.header\` に以下を設定してください
1. \`display: flex\`
2. \`justify-content: space-between\`（左右に振り分ける）
3. \`align-items: center\`（上下中央揃え）`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["CSS", "Flexbox", "ヘッダー"],
    starter_code: hcStarter({
      html: `<header class="header">\n  <div class="logo">ProductMgr</div>\n  <nav class="nav-links">\n    <a href="#">商品一覧</a>\n    <a href="#">カテゴリ</a>\n    <a href="#">ログアウト</a>\n  </nav>\n</header>\n`,
      css: `.header {\n  background-color: #1e293b;\n  color: #ffffff;\n  padding: 12px 20px;\n  border-radius: 8px;\n  /* Flexboxプロパティを3つ追加 */\n}\n.logo { font-weight: bold; font-size: 18px; }\n.nav-links { display: flex; gap: 16px; }\n.nav-links a { color: #e2e8f0; text-decoration: none; font-size: 14px; }\n`,
      checks: [
        { id: "c1", label: ".header に display: flex", type: "cssRule", selector: ".header", property: "display", value: "flex" },
        { id: "c2", label: ".header に justify-content: space-between", type: "cssRule", selector: ".header", property: "justify-content", value: "space-between" },
        { id: "c3", label: ".header に align-items: center", type: "cssRule", selector: ".header", property: "align-items", value: "center" },
      ],
    }),
    solution_code: hcSolution(
      `<header class="header">\n  <div class="logo">ProductMgr</div>\n  <nav class="nav-links">\n    <a href="#">商品一覧</a>\n    <a href="#">カテゴリ</a>\n    <a href="#">ログアウト</a>\n  </nav>\n</header>`,
      `.header {\n  background-color: #1e293b;\n  color: #ffffff;\n  padding: 12px 20px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.logo { font-weight: bold; font-size: 18px; }\n.nav-links { display: flex; gap: 16px; }\n.nav-links a { color: #e2e8f0; text-decoration: none; font-size: 14px; }`
    ),
    explanation_md: "`display: flex; justify-content: space-between; align-items: center;` はあらゆる業務アプリのヘッダーで使える黄金の3行です。",
    order_index: 7,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`.header` の中に `display: flex;`、`justify-content: space-between;`、`align-items: center;` を追加します。" },
    ],
  },
  // 3-2
  {
    id: "44444444-4444-4444-8444-444444441308",
    lesson_id: "33333333-3333-4333-8333-333333331303",
    chapter_id: "22222222-2222-4222-8222-222222221303",
    language: "htmlcss",
    title: "HTML&CSS 3-2：Flexboxで3枚横並びのKPIカードを作ろう",
    description_md: `## 課題：ダッシュボード上部の統計カードを横並びにする

### 作成・設定内容
1. HTMLの \`.kpi-row\` 内に \`.kpi-card\` を **3つ** 配置する
2. CSSで \`.kpi-row\` に \`display: flex\` と \`gap\` を指定する
3. CSSで \`.kpi-card\` に \`flex: 1\` を指定して均等幅にする`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["CSS", "Flexbox", "ダッシュボード"],
    starter_code: hcStarter({
      html: `<div class="kpi-row">\n  <div class="kpi-card">\n    <div class="label">登録商品数</div>\n    <div class="value">128件</div>\n  </div>\n  <!-- あと2枚 kpi-card を追加してください -->\n</div>\n`,
      css: `.kpi-row {\n  /* display: flex と gap を指定 */\n}\n.kpi-card {\n  /* flex: 1 を指定 */\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n}\n.label { font-size: 12px; color: #64748b; }\n.value { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px; }\n`,
      checks: [
        { id: "c1", label: 'class="kpi-card" が3つ以上ある', type: "htmlRegex", value: "(?:kpi-card[\\s\\S]*?){3}" },
        { id: "c2", label: ".kpi-row に display: flex", type: "cssRule", selector: ".kpi-row", property: "display", value: "flex" },
        { id: "c3", label: ".kpi-row に gap", type: "cssRule", selector: ".kpi-row", property: "gap" },
        { id: "c4", label: ".kpi-card に flex: 1", type: "cssRule", selector: ".kpi-card", property: "flex", value: "1" },
      ],
    }),
    solution_code: hcSolution(
      `<div class="kpi-row">\n  <div class="kpi-card"><div class="label">登録商品数</div><div class="value">128件</div></div>\n  <div class="kpi-card"><div class="label">在庫警告</div><div class="value">4件</div></div>\n  <div class="kpi-card"><div class="label">今月売上</div><div class="value">¥2.4M</div></div>\n</div>`,
      `.kpi-row {\n  display: flex;\n  gap: 12px;\n}\n.kpi-card {\n  flex: 1;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n}\n.label { font-size: 12px; color: #64748b; }\n.value { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px; }`
    ),
    explanation_md: "`gap` を使うとカード間の余白が均等に空き、`flex: 1` で全カードが綺麗に同じ幅へ揃います。",
    order_index: 8,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "HTMLに `.kpi-card` を2つ追加し、CSSの `.kpi-row` に `display: flex; gap: 12px;`、`.kpi-card` に `flex: 1;` を書きます。" },
    ],
  },
  // 3-3
  {
    id: "44444444-4444-4444-8444-444444441309",
    lesson_id: "33333333-3333-4333-8333-333333331303",
    chapter_id: "22222222-2222-4222-8222-222222221303",
    language: "htmlcss",
    title: "HTML&CSS 3-3：CSS Gridで2列の商品カタロググリッドを作ろう",
    description_md: `## 課題：CSS Gridで格子状レイアウトを組む

### CSSで \`.product-grid\` に以下を設定してください
1. \`display: grid\`
2. \`grid-template-columns: repeat(2, 1fr)\`（または \`1fr 1fr\`）
3. \`gap\`（例：\`16px\`）`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["CSS", "Grid"],
    starter_code: hcStarter({
      html: `<div class="product-grid">\n  <div class="item"><h4>ノートPC</h4><p>¥120,000</p></div>\n  <div class="item"><h4>4Kモニター</h4><p>¥42,000</p></div>\n  <div class="item"><h4>キーボード</h4><p>¥12,000</p></div>\n  <div class="item"><h4>Webカメラ</h4><p>¥8,500</p></div>\n</div>\n`,
      css: `.product-grid {\n  /* display: grid, grid-template-columns, gap を指定 */\n}\n.item {\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  padding: 14px;\n  background: #ffffff;\n}\n.item h4 { margin: 0 0 6px; }\n.item p { margin: 0; color: #2563eb; font-weight: bold; }\n`,
      checks: [
        { id: "c1", label: ".product-grid に display: grid", type: "cssRule", selector: ".product-grid", property: "display", value: "grid" },
        { id: "c2", label: ".product-grid に grid-template-columns", type: "cssRule", selector: ".product-grid", property: "grid-template-columns" },
        { id: "c3", label: ".product-grid に gap", type: "cssRule", selector: ".product-grid", property: "gap" },
      ],
    }),
    solution_code: hcSolution(
      `<div class="product-grid">\n  <div class="item"><h4>ノートPC</h4><p>¥120,000</p></div>\n  <div class="item"><h4>4Kモニター</h4><p>¥42,000</p></div>\n  <div class="item"><h4>キーボード</h4><p>¥12,000</p></div>\n  <div class="item"><h4>Webカメラ</h4><p>¥8,500</p></div>\n</div>`,
      `.product-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}\n.item { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; background: #fff; }\n.item h4 { margin: 0 0 6px; }\n.item p { margin: 0; color: #2563eb; font-weight: bold; }`
    ),
    explanation_md: "1次元の並びにはFlexbox、2次元の格子レイアウトにはCSS Gridを使い分けるのがモダンCSSの定石です。",
    order_index: 9,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`grid-template-columns: repeat(2, 1fr);` と書くと2等分の列になります。" },
    ],
  },
  // 4-1
  {
    id: "44444444-4444-4444-8444-444444441310",
    lesson_id: "33333333-3333-4333-8333-333333331304",
    chapter_id: "22222222-2222-4222-8222-222222221304",
    language: "htmlcss",
    title: "HTML&CSS 4-1：position（relative / absolute）で在庫警告バッジを重ねよう",
    description_md: `## 課題：カードの右上にステータスバッジを配置する

親要素に \`position: relative\`、子要素に \`position: absolute\` を指定すると、親を基準に自由な位置へバッジを重ねられます。

### CSS設定
1. \`.product-box\` に \`position: relative\`
2. \`.badge\` に \`position: absolute\`・\`top\`・\`right\``,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["CSS", "position", "バッジ"],
    starter_code: hcStarter({
      html: `<div class="product-box">\n  <span class="badge">残りわずか</span>\n  <h3>USB-C ドッキングステーション</h3>\n  <p>在庫数：3個</p>\n</div>\n`,
      css: `.product-box {\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  padding: 20px;\n  max-width: 320px;\n  /* position: relative を追加 */\n}\n.badge {\n  background: #ef4444;\n  color: #ffffff;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 10px;\n  border-radius: 999px;\n  /* position: absolute, top, right を追加 */\n}\n`,
      checks: [
        { id: "c1", label: ".product-box に position: relative", type: "cssRule", selector: ".product-box", property: "position", value: "relative" },
        { id: "c2", label: ".badge に position: absolute", type: "cssRule", selector: ".badge", property: "position", value: "absolute" },
        { id: "c3", label: ".badge に top を指定", type: "cssRule", selector: ".badge", property: "top" },
        { id: "c4", label: ".badge に right を指定", type: "cssRule", selector: ".badge", property: "right" },
      ],
    }),
    solution_code: hcSolution(
      `<div class="product-box">\n  <span class="badge">残りわずか</span>\n  <h3>USB-C ドッキングステーション</h3>\n  <p>在庫数：3個</p>\n</div>`,
      `.product-box {\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  padding: 20px;\n  max-width: 320px;\n  position: relative;\n}\n.badge {\n  background: #ef4444;\n  color: #fff;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 10px;\n  border-radius: 999px;\n  position: absolute;\n  top: 12px;\n  right: 12px;\n}`
    ),
    explanation_md: "「親に relative、子に absolute」は通知バッジやモーダルの閉じるボタンなどで頻出する定番パターンです。",
    order_index: 10,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`.badge` には `position: absolute; top: 12px; right: 12px;` を設定してみましょう。" },
    ],
  },
  // 4-2
  {
    id: "44444444-4444-4444-8444-444444441311",
    lesson_id: "33333333-3333-4333-8333-333333331304",
    chapter_id: "22222222-2222-4222-8222-222222221304",
    language: "htmlcss",
    title: "HTML&CSS 4-2：メディアクエリ（@media）でスマホ対応レスポンシブ設計",
    description_md: `## 課題：画面幅が狭いときは縦積みに切り替える

右上のプレビュー切替ボタン（PC／スマホ幅）で挙動をリアルタイム確認しましょう！

### CSS設定
1. 通常時は \`.panel-wrap\` を \`display: flex\` で横並びにする
2. \`@media (max-width: 600px)\` の中で \`.panel-wrap\` を \`flex-direction: column\` に変更する`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["CSS", "レスポンシブ", "@media"],
    starter_code: hcStarter({
      html: `<div class="panel-wrap">\n  <aside class="sidebar">サイドメニュー</aside>\n  <main class="content">メインコンテンツエリア</main>\n</div>\n`,
      css: `.panel-wrap {\n  display: flex;\n  gap: 12px;\n}\n.sidebar {\n  width: 180px;\n  background: #eff6ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n.content {\n  flex: 1;\n  background: #f8fafc;\n  padding: 16px;\n  border-radius: 8px;\n}\n\n/* ここに @media (max-width: 600px) を記述してください */\n`,
      checks: [
        { id: "c1", label: "@media ルールが存在する", type: "cssRegex", value: "@media\\s*\\([^)]*max-width" },
        { id: "c2", label: ".panel-wrap に flex-direction: column が指定されている", type: "cssRule", selector: ".panel-wrap", property: "flex-direction", value: "column" },
      ],
    }),
    solution_code: hcSolution(
      `<div class="panel-wrap">\n  <aside class="sidebar">サイドメニュー</aside>\n  <main class="content">メインコンテンツエリア</main>\n</div>`,
      `.panel-wrap { display: flex; gap: 12px; }\n.sidebar { width: 180px; background: #eff6ff; padding: 16px; border-radius: 8px; }\n.content { flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px; }\n@media (max-width: 600px) {\n  .panel-wrap {\n    flex-direction: column;\n  }\n  .sidebar {\n    width: 100%;\n  }\n}`
    ),
    explanation_md: "プレビューの「スマホ幅」ボタンを押すと、横並びだったレイアウトが縦積みに切り替わるのが確認できます。",
    order_index: 11,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`@media (max-width: 600px) { .panel-wrap { flex-direction: column; } }` のように書きます。" },
    ],
  },
  // 4-3
  {
    id: "44444444-4444-4444-8444-444444441312",
    lesson_id: "33333333-3333-4333-8333-333333331304",
    chapter_id: "22222222-2222-4222-8222-222222221304",
    language: "htmlcss",
    title: "HTML&CSS 4-3：【総合演習】商品管理システムのトップ画面モックを完成させよう",
    description_md: `## 総合課題：後半のSpring Boot開発で使う画面の土台を作る

これまで学んだ **ヘッダー（Flexbox）・検索フォーム・商品一覧テーブル・在庫警告バッジ** を1つの画面に統合しましょう！

### 必須要件
1. \`<header class="app-header">\`（CSSで \`display: flex\`）
2. 検索フォーム \`<form>\` 内に \`<input>\` と \`<button>\`
3. 商品一覧 \`<table>\` 内に \`<th>\`（3つ以上）と \`<td>\`（3つ以上）
4. 在庫警告用の \`.badge-warn\` クラス（CSSで \`background-color\` を赤系に指定）`,
    difficulty: "hard",
    estimated_minutes: 30,
    tags: ["HTML", "CSS", "総合演習", "モックアップ"],
    starter_code: hcStarter({
      html: `<header class="app-header">\n  <strong>商品管理システム</strong>\n  <a href="#">+ 新規登録</a>\n</header>\n\n<!-- ここに検索フォーム (form > input + button) と 商品テーブル (table) を作成してください -->\n`,
      css: `.app-header {\n  /* Flexboxで左右配置 */\n  background: #1e3a8a;\n  color: #ffffff;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.app-header a { color: #ffffff; text-decoration: none; font-size: 13px; }\n.badge-warn {\n  /* 赤系の警告バッジスタイルを指定 */\n  color: #ffffff;\n  padding: 2px 8px;\n  border-radius: 999px;\n  font-size: 12px;\n}\n`,
      checks: [
        { id: "c1", label: ".app-header に display: flex", type: "cssRule", selector: ".app-header", property: "display", value: "flex" },
        { id: "c2", label: "検索用の <form> と <input> がある", type: "htmlTag", tag: "form" },
        { id: "c3", label: "<input> がある", type: "htmlTag", tag: "input" },
        { id: "c4", label: "<table> に <th> が3つ以上ある", type: "htmlTagMinCount", tag: "th", minCount: 3 },
        { id: "c5", label: "<table> に <td> が3つ以上ある", type: "htmlTagMinCount", tag: "td", minCount: 3 },
        { id: "c6", label: ".badge-warn に background-color を指定", type: "cssRule", selector: ".badge-warn", property: "background-color" },
      ],
    }),
    solution_code: hcSolution(
      `<header class="app-header">\n  <strong>商品管理システム</strong>\n  <a href="#">+ 新規登録</a>\n</header>\n<form class="search-bar">\n  <input type="text" placeholder="商品名で検索..." />\n  <button type="submit">検索</button>\n</form>\n<table>\n  <thead><tr><th>SKU</th><th>商品名</th><th>在庫</th></tr></thead>\n  <tbody>\n    <tr><td>PRD-001</td><td>ノートPC</td><td>15</td></tr>\n    <tr><td>PRD-002</td><td>USBハブ</td><td><span class="badge-warn">残3</span></td></tr>\n  </tbody>\n</table>`,
      `.app-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e3a8a;\n  color: #fff;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.app-header a { color: #fff; text-decoration: none; font-size: 13px; }\n.search-bar { display: flex; gap: 8px; margin-bottom: 14px; }\n.search-bar input { flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }\n.search-bar button { padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }\n.badge-warn { background-color: #dc2626; color: #fff; padding: 2px 8px; border-radius: 999px; font-size: 12px; }`
    ),
    explanation_md: "素晴らしい！このHTML/CSSの構造はそのまま後半のSpring Boot（Thymeleaf）の商品一覧画面として再利用できます。",
    order_index: 12,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`.app-header` に `display: flex; justify-content: space-between;`、`.badge-warn` に `background-color: #dc2626;` を指定し、HTMLに検索フォームと商品テーブルを記述します。" },
    ],
  },
];
