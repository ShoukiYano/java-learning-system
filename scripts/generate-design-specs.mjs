/**
 * Pure Node.js OpenXML (.xlsx) Generator for DevSkillStudio 1-Year Curriculum
 * Generates two comprehensive, multi-sheet Detailed Design Documents (詳細設計書):
 *   1. public/docs/product-management-design-spec.xlsx  (Spring Boot + SQL 個人開発：商品管理システム)
 *   2. public/docs/team-project-design-spec.xlsx        (チーム開発 3人1組：1人3ページ＋ログイン機能 総合業務Webシステム)
 *
 * Zero external dependencies — uses built-in Node.js `zlib` + `fs` + `path`.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "docs");

// ---------------------------------------------------------------------------
// 1. Minimal Standard ZIP Archive Builder (IEEE 802.3 CRC32 + Deflate)
// ---------------------------------------------------------------------------
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const rawBuf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
    const compressed = zlib.deflateRawSync(rawBuf, { level: 6 });
    const crc = crc32(rawBuf);

    // Local File Header (30 bytes + filename)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4);         // version needed
    localHeader.writeUInt16LE(0x0800, 6);     // UTF-8 flag
    localHeader.writeUInt16LE(8, 8);          // compression: deflate
    localHeader.writeUInt16LE(0, 10);         // mod time
    localHeader.writeUInt16LE(0x5821, 12);    // mod date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(rawBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);         // extra length

    localParts.push(localHeader, nameBuf, compressed);

    // Central Directory Header (46 bytes + filename)
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);       // version made by
    centralHeader.writeUInt16LE(20, 6);       // version needed
    centralHeader.writeUInt16LE(0x0800, 8);   // UTF-8 flag
    centralHeader.writeUInt16LE(8, 10);       // compression: deflate
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x5821, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(rawBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);       // extra len
    centralHeader.writeUInt16LE(0, 32);       // comment len
    centralHeader.writeUInt16LE(0, 34);       // disk start
    centralHeader.writeUInt16LE(0, 36);       // internal attrs
    centralHeader.writeUInt32LE(0, 38);       // external attrs
    centralHeader.writeUInt32LE(offset, 42);  // local header offset

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuf, eocd]);
}

// ---------------------------------------------------------------------------
// 2. OpenXML SpreadsheetML Builder (Styles + SharedStrings + Multi-Sheet)
// ---------------------------------------------------------------------------
function xmlEsc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function colLetter(colIdx) {
  let n = colIdx + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * Style indices in xl/styles.xml:
 *   0: Normal cell (thin gray border, wrapText, top-left aligned)
 *   1: Sheet Banner Title (14pt bold white on deep navy #1E3A8A)
 *   2: Table Header (10pt bold white on slate blue #2563EB, centered)
 *   3: Section Subheader (11pt bold navy #1E3A8A on soft blue #DBEAFE)
 *   4: Zebra Row (normal with subtle #F8FAFC fill)
 *   5: Code / Monospace cell (Consolas 9.5pt on #F1F5F9)
 *   6: Highlight / Badge cell (10pt bold emerald #065F46 on #D1FAE5)
 */
function buildStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="6">
    <font><sz val="10"/><color rgb="FF0F172A"/><name val="Yu Gothic UI"/></font>
    <font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Yu Gothic UI"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Yu Gothic UI"/></font>
    <font><b/><sz val="11"/><color rgb="FF1E3A8A"/><name val="Yu Gothic UI"/></font>
    <font><sz val="9.5"/><color rgb="FF0F172A"/><name val="Consolas"/></font>
    <font><b/><sz val="10"/><color rgb="FF065F46"/><name val="Yu Gothic UI"/></font>
  </fonts>
  <fills count="7">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2563EB"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDBEAFE"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD1FAE5"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="7">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="top" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="top" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="4" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="top" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="5" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
  </cellXfs>
</styleSheet>`;
}

function buildWorkbookBuffer(sheets) {
  const sharedStrings = [];
  const ssMap = new Map();

  function addString(str) {
    const key = String(str ?? "");
    if (ssMap.has(key)) return ssMap.get(key);
    const idx = sharedStrings.length;
    sharedStrings.push(key);
    ssMap.set(key, idx);
    return idx;
  }

  const sheetXmlList = sheets.map((sheet) => {
    const colsXml = (sheet.widths || [])
      .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
      .join("");

    const rowsXml = sheet.rows
      .map((row, rIdx) => {
        const rowNum = rIdx + 1;
        const heightAttr = row.height ? ` ht="${row.height}" customHeight="1"` : "";
        const cellsXml = row.cells
          .map((cellVal, cIdx) => {
            const ref = `${colLetter(cIdx)}${rowNum}`;
            let value = cellVal;
            let style = row.style ?? 0;
            if (cellVal && typeof cellVal === "object" && !Array.isArray(cellVal)) {
              value = cellVal.v ?? "";
              style = cellVal.s ?? style;
            }
            if (typeof value === "number" && Number.isFinite(value)) {
              return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
            }
            const ssIdx = addString(value);
            return `<c r="${ref}" t="s" s="${style}"><v>${ssIdx}</v></c>`;
          })
          .join("");
        return `<row r="${rowNum}"${heightAttr}>${cellsXml}</row>`;
      })
      .join("\n");

    const freezeRow = sheet.freezeRow ?? 0;
    const sheetViewsXml =
      freezeRow > 0
        ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${freezeRow}" topLeftCell="A${freezeRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
        : `<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${sheetViewsXml}
  <sheetFormatPr defaultRowHeight="20"/>
  ${colsXml ? `<cols>${colsXml}</cols>` : ""}
  <sheetData>
${rowsXml}
  </sheetData>
</worksheet>`;
  });

  const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${sharedStrings.length}" uniqueCount="${sharedStrings.length}">
${sharedStrings.map((s) => `  <si><t xml:space="preserve">${xmlEsc(s)}</t></si>`).join("\n")}
</sst>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
${sheets.map((s, i) => `    <sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("\n")}
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheets.map((_, i) => `  <Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("\n")}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId${sheets.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
${sheets.map((_, i) => `  <Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("\n")}
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const entries = [
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: rootRelsXml },
    { name: "xl/workbook.xml", data: workbookXml },
    { name: "xl/_rels/workbook.xml.rels", data: workbookRelsXml },
    { name: "xl/styles.xml", data: buildStylesXml() },
    { name: "xl/sharedStrings.xml", data: sharedStringsXml },
    ...sheetXmlList.map((xml, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: xml })),
  ];

  return createZip(entries);
}

// Helper to create table rows with alternating styles
function tableRows(headers, dataRows, codeCols = []) {
  const out = [{ style: 2, height: 24, cells: headers }];
  dataRows.forEach((r, idx) => {
    const baseStyle = idx % 2 === 1 ? 4 : 0;
    const cells = r.map((val, cIdx) =>
      codeCols.includes(cIdx) ? { v: val, s: 5 } : val
    );
    out.push({ style: baseStyle, cells });
  });
  return out;
}

// ===========================================================================
// 3. Workbook 1: Spring Boot + SQL 個人開発「商品管理システム」詳細設計書
// ===========================================================================
function createProductManagementDesignSpec() {
  const sheets = [
    // Sheet 1: 表紙・改版履歴
    {
      name: "1_表紙・システム概要",
      widths: [24, 52, 24, 24],
      freezeRow: 2,
      rows: [
        { style: 1, height: 32, cells: ["商品管理システム 詳細設計書（Spring Boot + PostgreSQL 個人開発）", "", "", ""] },
        { style: 3, height: 22, cells: ["文書管理情報", "", "", ""] },
        ...tableRows(
          ["項目", "内容", "補足", "備考"],
          [
            ["システム名", "商品管理システム（Product Manager）", "個人開発（2か月カリキュラム）", "DevSkillStudio 公式設計書"],
            ["バージョン", "1.0.0", "初版作成", "GitHub URLにて提出"],
            ["開発環境（IDE）", "Eclipse（Pleiades All in One / Spring Tools 4）", "Java 21 LTS", "UTF-8統一"],
            ["フレームワーク", "Spring Boot 3.3.x（Spring Web / Spring Data JPA / Thymeleaf / Validation / Spring Security）", "ビルドツール：Maven（pom.xml）", "MVCアーキテクチャ"],
            ["データベース", "PostgreSQL 16.x（pgAdmin 4 または psql）", "DB名: product_mgmt_db", "UTF-8 / ポート5432"],
            ["バージョン管理", "Git + GitHub（各Stepごとに feature/stepX-... ブランチを作成）", "main直接Push禁止・Pull Request URL提出", "差分レビュー（Files changed）で講師確認"],
          ]
        ),
        { style: 0, cells: ["", "", "", ""] },
        { style: 3, height: 22, cells: ["設計書の読み方（はじめて開発する方へ）", "", "", ""] },
        ...tableRows(
          ["シート番号", "シート名", "いつ見るか", "このシートで分かること"],
          [
            ["Sheet 2", "2_機能要件・開発ステップ", "着手前・毎週の進捗確認時", "作る機能一覧と6ステップの開発順序"],
            ["Sheet 3", "3_画面一覧・項目定義", "HTML（Thymeleaf）作成時", "全6画面のURL・入力項目・ボタン動作"],
            ["Sheet 4", "4_テーブル定義・DDL", "PostgreSQL構築・Entity作成時", "テーブル構造・制約・コピペできるCREATE TABLE文"],
            ["Sheet 5", "5_クラス・URL設計", "Controller/Service/Repository作成時", "クラス名・メソッド名・URLルーティング一覧"],
            ["Sheet 6", "6_バリデーション・エラー", "Formクラス・入力チェック実装時", "全項目の入力チェックルールとエラーメッセージ"],
            ["Sheet 7", "7_単体・結合テスト仕様", "実装完了後・GitHub提出前", "動作確認チェックリスト（全項目OKにして提出）"],
          ]
        ),
      ],
    },

    // Sheet 2: 機能要件・開発ステップ
    {
      name: "2_機能要件・開発ステップ",
      widths: [12, 24, 48, 16, 20],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["機能要件一覧 ＆ 6ステップ開発ロードマップ", "", "", "", ""] },
        ...tableRows(
          ["機能ID", "機能名", "詳細要件（実装すべき動作）", "優先度", "対応ステップ"],
          [
            ["FN-001", "ログイン認証機能", "メールアドレスとパスワードで認証する（BCrypt暗号化）。未ログイン時は自動で /login へリダイレクトする。", "必須", "Step 6"],
            ["FN-002", "ログアウト機能", "ヘッダーの「ログアウト」ボタンでセッションを破棄し、/login?logout へ遷移する。", "必須", "Step 6"],
            ["FN-003", "商品一覧表示機能", "論理削除されていない商品（is_deleted = false）をカテゴリ名付きで一覧表示する。在庫数が10未満の場合は赤バッジで警告表示。", "必須", "Step 4"],
            ["FN-004", "商品検索・絞り込み機能", "商品名（部分一致・大文字小文字無視）およびカテゴリIDで絞り込み検索できる。検索条件はフォームに保持される。", "必須", "Step 4"],
            ["FN-005", "商品詳細表示機能", "一覧の商品名クリックで詳細画面へ遷移し、SKU・価格・在庫・説明・作成日時・更新日時を表示する。", "必須", "Step 4"],
            ["FN-006", "商品新規登録機能", "入力バリデーション通過後、products テーブルへINSERTし、一覧画面へリダイレクト（PRGパターン）＋完了メッセージ表示。", "必須", "Step 5"],
            ["FN-007", "商品情報編集機能", "既存商品をフォームに初期表示し、バリデーション通過後にUPDATE。SKU重複（自レコード以外）をエラーとする。", "必須", "Step 5"],
            ["FN-008", "商品論理削除機能", "確認ダイアログ後に is_deleted = true へ更新する（物理削除しない）。一覧から非表示になること。", "必須", "Step 5"],
            ["FN-009", "カテゴリマスタ連携", "categories テーブルからプルダウン選択肢を動的取得して検索・登録・編集画面に表示する。", "必須", "Step 3-4"],
            ["FN-010", "共通エラー画面", "存在しない商品IDアクセス時（404）や予期せぬエラー時（500）に分かりやすいエラー画面を表示する。", "推奨", "Step 6"],
          ]
        ),
      ],
    },

    // Sheet 3: 画面一覧・項目定義
    {
      name: "3_画面一覧・項目定義",
      widths: [12, 20, 24, 24, 42, 18],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["画面一覧 ＆ 画面項目定義書", "", "", "", "", ""] },
        ...tableRows(
          ["画面ID", "画面名", "URLパス", "Thymeleafテンプレート", "主要表示項目・操作ボタン", "遷移先"],
          [
            ["SCR-01", "ログイン画面", "GET /login", "templates/login.html", "メールアドレス入力欄、パスワード入力欄、ログインボタン、エラーメッセージ表示領域", "成功→/products"],
            ["SCR-02", "商品一覧画面", "GET /products", "templates/products/list.html", "検索フォーム（商品名・カテゴリ選択・検索/クリア）、新規登録ボタン、商品テーブル（SKU/商品名/カテゴリ/単価/在庫/操作）、フラッシュメッセージ", "詳細/登録/編集/削除"],
            ["SCR-03", "商品詳細画面", "GET /products/{id}", "templates/products/detail.html", "商品ID、SKU、商品名、カテゴリ名、単価（円フォーマット）、在庫数、商品説明、登録日時、更新日時、編集ボタン、削除ボタン、一覧へ戻る", "/products, 編集"],
            ["SCR-04", "商品新規登録画面", "GET /products/new", "templates/products/form.html", "SKU、商品名、カテゴリプルダウン、単価、在庫数、商品説明、登録ボタン、キャンセルボタン（エラー時は入力値を保持）", "POST /products → /products"],
            ["SCR-05", "商品編集画面", "GET /products/{id}/edit", "templates/products/form.html", "SCR-04と共通フォーム（id有無でタイトル・送信先を切替）。既存データを初期表示。", "POST /products/{id} → /products"],
            ["SCR-06", "エラー画面", "自動遷移", "templates/error.html", "HTTPステータスコード、エラーメッセージ、一覧画面へ戻るリンク", "/products"],
          ],
          [2, 3]
        ),
      ],
    },

    // Sheet 4: テーブル定義・DDL
    {
      name: "4_テーブル定義・DDL",
      widths: [18, 20, 18, 12, 16, 44],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["データベース テーブル定義書（PostgreSQL 16）", "", "", "", "", ""] },
        { style: 3, height: 22, cells: ["1. users テーブル（ログインユーザー管理）", "", "", "", "", ""] },
        ...tableRows(
          ["カラム名", "論理名", "データ型", "NULL", "制約・デフォルト", "備考"],
          [
            ["id", "ユーザーID", "BIGSERIAL", "NO", "PRIMARY KEY", "自動採番"],
            ["email", "メールアドレス", "VARCHAR(255)", "NO", "UNIQUE", "ログインIDとして使用"],
            ["password_hash", "パスワードハッシュ", "VARCHAR(255)", "NO", "-", "BCryptエンコード済み文字列"],
            ["full_name", "氏名", "VARCHAR(100)", "NO", "-", "ヘッダー表示名"],
            ["role", "権限", "VARCHAR(20)", "NO", "DEFAULT 'ROLE_USER'", "ROLE_ADMIN / ROLE_USER"],
            ["created_at", "作成日時", "TIMESTAMP", "NO", "DEFAULT CURRENT_TIMESTAMP", ""],
          ],
          [0, 2, 4]
        ),
        { style: 0, cells: ["", "", "", "", "", ""] },
        { style: 3, height: 22, cells: ["2. categories テーブル（商品カテゴリマスタ）", "", "", "", "", ""] },
        ...tableRows(
          ["カラム名", "論理名", "データ型", "NULL", "制約・デフォルト", "備考"],
          [
            ["id", "カテゴリID", "BIGSERIAL", "NO", "PRIMARY KEY", "自動採番"],
            ["name", "カテゴリ名", "VARCHAR(100)", "NO", "UNIQUE", "例：PC・周辺機器 / 書籍 / オフィス用品"],
            ["sort_order", "表示順", "INTEGER", "NO", "DEFAULT 0", "昇順でプルダウン表示"],
          ],
          [0, 2, 4]
        ),
        { style: 0, cells: ["", "", "", "", "", ""] },
        { style: 3, height: 22, cells: ["3. products テーブル（商品マスタ）", "", "", "", "", ""] },
        ...tableRows(
          ["カラム名", "論理名", "データ型", "NULL", "制約・デフォルト", "備考"],
          [
            ["id", "商品ID", "BIGSERIAL", "NO", "PRIMARY KEY", "自動採番"],
            ["sku", "商品コード(SKU)", "VARCHAR(32)", "NO", "UNIQUE", "英数字ハイフン 例: PRD-0001"],
            ["name", "商品名", "VARCHAR(150)", "NO", "-", "検索対象"],
            ["category_id", "カテゴリID", "BIGINT", "NO", "FK -> categories(id)", "外部キー制約"],
            ["price", "単価（税抜円）", "INTEGER", "NO", "CHECK (price >= 0)", "0円以上"],
            ["stock", "在庫数", "INTEGER", "NO", "CHECK (stock >= 0)", "10未満で一覧に警告バッジ"],
            ["description", "商品説明", "TEXT", "YES", "-", "最大1000文字"],
            ["is_deleted", "論理削除フラグ", "BOOLEAN", "NO", "DEFAULT FALSE", "削除時はTRUEへ更新"],
            ["created_at", "登録日時", "TIMESTAMP", "NO", "DEFAULT CURRENT_TIMESTAMP", ""],
            ["updated_at", "更新日時", "TIMESTAMP", "NO", "DEFAULT CURRENT_TIMESTAMP", "更新時に現在時刻をセット"],
          ],
          [0, 2, 4]
        ),
        { style: 0, cells: ["", "", "", "", "", ""] },
        { style: 3, height: 22, cells: ["そのまま実行できるDDL（schema.sql）", "", "", "", "", ""] },
        {
          style: 5,
          height: 180,
          cells: [
            "CREATE TABLE users (\n  id BIGSERIAL PRIMARY KEY,\n  email VARCHAR(255) NOT NULL UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  full_name VARCHAR(100) NOT NULL,\n  role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE categories (\n  id BIGSERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL UNIQUE,\n  sort_order INTEGER NOT NULL DEFAULT 0\n);\n\nCREATE TABLE products (\n  id BIGSERIAL PRIMARY KEY,\n  sku VARCHAR(32) NOT NULL UNIQUE,\n  name VARCHAR(150) NOT NULL,\n  category_id BIGINT NOT NULL REFERENCES categories(id),\n  price INTEGER NOT NULL CHECK (price >= 0),\n  stock INTEGER NOT NULL CHECK (stock >= 0),\n  description TEXT,\n  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);",
            "",
            "",
            "",
            "",
            "",
          ],
        },
      ],
    },

    // Sheet 5: クラス・URL設計
    {
      name: "5_クラス・URL設計",
      widths: [16, 26, 26, 28, 40],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["URLルーティング ＆ Spring Boot クラス設計", "", "", "", ""] },
        ...tableRows(
          ["HTTPメソッド", "URLパス", "Controllerクラス", "メソッド名", "処理内容・呼び出すService"],
          [
            ["GET", "/login", "AuthController", "showLogin()", "templates/login.html を返却"],
            ["GET", "/products", "ProductController", "list(keyword, categoryId, model)", "ProductService.search() で一覧取得し list.html を返却"],
            ["GET", "/products/{id}", "ProductController", "detail(id, model)", "ProductService.findById(id) で詳細取得。未存在時は404"],
            ["GET", "/products/new", "ProductController", "showCreateForm(model)", "空の ProductForm とカテゴリ一覧をセットして form.html を返却"],
            ["POST", "/products", "ProductController", "create(@Valid ProductForm, br, ra)", "バリデーションエラー時は form.html 再表示。成功時は保存し redirect:/products"],
            ["GET", "/products/{id}/edit", "ProductController", "showEditForm(id, model)", "既存データを ProductForm へ詰めて form.html を返却"],
            ["POST", "/products/{id}", "ProductController", "update(id, @Valid ProductForm, br, ra)", "SKU重複チェック＋更新後 redirect:/products"],
            ["POST", "/products/{id}/delete", "ProductController", "delete(id, ra)", "ProductService.softDelete(id) で論理削除し redirect:/products"],
          ],
          [0, 1, 2, 3]
        ),
        { style: 0, cells: ["", "", "", "", ""] },
        { style: 3, height: 22, cells: ["パッケージ構成（推奨テンプレート）", "", "", "", ""] },
        ...tableRows(
          ["パッケージ名", "配置クラス例", "役割", "ポイント", "備考"],
          [
            ["com.example.product.controller", "ProductController, AuthController", "HTTPリクエスト受付・画面遷移制御", "ビジネスロジックは書かない", "@Controller"],
            ["com.example.product.service", "ProductService, CategoryService", "業務ロジック・トランザクション管理", "@Transactional を付与", "@Service"],
            ["com.example.product.repository", "ProductRepository, CategoryRepository, UserRepository", "DBアクセス（Spring Data JPA）", "JpaRepository を継承", "@Repository"],
            ["com.example.product.entity", "Product, Category, User", "DBテーブルと1対1対応するEntity", "@Entity / @Table を付与", "Lombok利用可"],
            ["com.example.product.form", "ProductForm", "画面入力受け取り＋Bean Validation", "@NotBlank / @Min 等を付与", "Entityと分離する"],
            ["com.example.product.config", "SecurityConfig", "Spring Security 認証・認可設定", "BCryptPasswordEncoder定義", "@Configuration"],
          ],
          [0, 1]
        ),
      ],
    },

    // Sheet 6: バリデーション・エラー
    {
      name: "6_バリデーション・エラー",
      widths: [18, 22, 30, 44, 22],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["入力バリデーション ＆ エラーメッセージ仕様書", "", "", "", ""] },
        ...tableRows(
          ["フィールド名", "項目名", "アノテーション / チェック条件", "エラーメッセージ", "対象画面"],
          [
            ["sku", "商品コード(SKU)", "@NotBlank / @Pattern(regexp=\"^[A-Z0-9-]{3,32}$\")", "SKUは半角英大文字・数字・ハイフン3〜32文字で入力してください", "新規・編集"],
            ["sku（業務チェック）", "SKU重複チェック", "Service層で existsBySkuAndIdNot() 確認", "この商品コード(SKU)はすでに登録されています", "新規・編集"],
            ["name", "商品名", "@NotBlank / @Size(max = 150)", "商品名は必須です（150文字以内で入力してください）", "新規・編集"],
            ["categoryId", "カテゴリ", "@NotNull", "カテゴリを選択してください", "新規・編集"],
            ["price", "単価", "@NotNull / @Min(0) / @Max(10000000)", "単価は0〜10,000,000の整数で入力してください", "新規・編集"],
            ["stock", "在庫数", "@NotNull / @Min(0) / @Max(999999)", "在庫数は0以上の整数で入力してください", "新規・編集"],
            ["description", "商品説明", "@Size(max = 1000)", "商品説明は1000文字以内で入力してください", "新規・編集"],
            ["email / password", "ログイン認証", "Spring Security DaoAuthenticationProvider", "メールアドレスまたはパスワードが正しくありません", "ログイン"],
          ],
          [0, 2]
        ),
      ],
    },

    // Sheet 7: 単体・結合テスト仕様
    {
      name: "7_単体・結合テスト仕様",
      widths: [12, 18, 34, 34, 14, 18],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["単体・結合テスト仕様書（GitHub提出前チェックリスト）", "", "", "", "", ""] },
        ...tableRows(
          ["テストID", "対象機能", "操作手順・入力値", "期待される結果", "判定欄", "備考"],
          [
            ["TC-001", "未ログインアクセス制御", "未ログイン状態で /products に直接アクセスする", "/login 画面へ自動リダイレクトされること", "未実施", "Spring Security"],
            ["TC-002", "ログイン正常系", "登録済みメール・パスワードでログインする", "/products へ遷移しヘッダーに氏名が表示されること", "未実施", "BCrypt確認"],
            ["TC-003", "ログイン異常系", "誤ったパスワードでログインする", "ログイン画面に戻りエラーメッセージが表示されること", "未実施", ""],
            ["TC-004", "商品一覧表示", "初期データ5件投入後、/products を開く", "is_deleted=false の商品のみ表示され、在庫10未満に警告バッジが出ること", "未実施", ""],
            ["TC-005", "商品検索（複合）", "商品名「マウス」＋カテゴリ「PC・周辺機器」で検索", "条件一致する商品のみ表示され、検索条件がフォームに残ること", "未実施", ""],
            ["TC-006", "商品登録正常系", "必須項目すべて正常入力し「登録」を押下", "DBに1件INSERTされ、一覧画面にフラッシュメッセージが出ること", "未実施", "PRGパターン"],
            ["TC-007", "商品登録バリデーション", "商品名空欄・単価 -100 で「登録」を押下", "DB登録されず、各項目の下に赤字でエラーメッセージが表示されること", "未実施", ""],
            ["TC-008", "SKU重複チェック", "既存SKUと同一値で新規登録を実行", "DB登録されず「すでに登録されています」エラーが表示されること", "未実施", ""],
            ["TC-009", "商品編集正常系", "既存商品の単価と在庫を変更し「更新」を押下", "DBの値が更新され updated_at が現在時刻に変わること", "未実施", ""],
            ["TC-010", "商品論理削除", "一覧または詳細の「削除」ボタンを押下しOK", "一覧から消え、PostgreSQL上では is_deleted = true になっていること", "未実施", "物理削除NG"],
            ["TC-011", "404エラー確認", "/products/999999 にアクセスする", "ホワイトページではなく共通エラー画面が表示されること", "未実施", ""],
            ["TC-012", "GitHub提出確認", "README.mdにDB作成手順・起動方法・ログインIDを記載しPush", "別環境から git clone して起動できること", "未実施", "提出必須"],
          ]
        ),
      ],
    },
  ];

  return buildWorkbookBuffer(sheets);
}

// ===========================================================================
// 4. Workbook 2: チーム開発（3人1組）総合業務Webシステム 詳細設計書
// ===========================================================================
function createTeamProjectDesignSpec() {
  const sheets = [
    // Sheet 1: 表紙・3名役割分担（1人3ページ＋ログイン）
    {
      name: "1_表紙・チーム役割分担",
      widths: [18, 26, 36, 36],
      freezeRow: 2,
      rows: [
        { style: 1, height: 32, cells: ["チーム開発（3人1組）総合業務Webシステム 詳細設計書", "", "", ""] },
        { style: 3, height: 22, cells: ["システム概要：社内備品・案件・タスク統合管理システム（TeamOps Hub）", "", "", ""] },
        ...tableRows(
          ["項目", "内容", "補足", "備考"],
          [
            ["システム構成", "共通ログイン機能（1画面）＋ メンバー3名 × 各3ページ（計9画面）＝ 全10画面", "1人3ページを責任持って設計〜テストまで完遂", "チーム開発3か月"],
            ["技術スタック", "Eclipse / Java 21 / Spring Boot 3.3 / Maven（pom.xml） / Thymeleaf / Spring Security / PostgreSQL 16 / GitHub", "個人開発と同一スタックをチーム拡張", "Mavenで依存関係を統一"],
            ["Git運用ルール", "main（本番保護）← develop（統合）← feature/担当名-機能名（作業）", "PRレビュー必須（他メンバー1名以上のApprove）", "コンフリクト解消を全員体験"],
            ["提出物", "各ステップごとのGitHub Pull Request URL（https://github.com/.../pull/番号）", "全員のPR・相互レビュー履歴が確認できること", "Files changedで差分レビュー実施"],
          ]
        ),
        { style: 0, cells: ["", "", "", ""] },
        { style: 3, height: 22, cells: ["3名役割分担表（共通基盤＋1人3ページ設計）", "", "", ""] },
        ...tableRows(
          ["担当メンバー", "担当領域", "担当する3ページ（＋共通）", "担当テーブル・責任範囲"],
          [
            ["全員（Step2で協働）", "共通基盤・認証", "SCR-00 ログイン画面（/login）＋ 共通ヘッダー/ナビレイアウト", "users テーブル、SecurityConfig、layout.html"],
            ["メンバーA（リーダー兼務）", "社員・部署管理＆ダッシュボード", "① SCR-A1 ダッシュボード（/dashboard）\n② SCR-A2 社員一覧・検索（/members）\n③ SCR-A3 社員登録・編集（/members/form）", "departments, users（管理CRUD）＋全体進捗管理・PRマージ調整"],
            ["メンバーB", "プロジェクト・タスク管理", "① SCR-B1 案件一覧（/projects）\n② SCR-B2 案件詳細＆タスクボード（/projects/{id}）\n③ SCR-B3 タスク登録・編集（/tasks/form）", "projects, tasks テーブル＋進捗率自動集計"],
            ["メンバーC", "備品貸出・社内申請管理", "① SCR-C1 備品一覧・在庫検索（/equipments）\n② SCR-C2 貸出申請・返却一覧（/loans）\n③ SCR-C3 申請承認・履歴詳細（/loans/{id}）", "equipments, equipment_loans テーブル＋在庫増減トランザクション"],
          ]
        ),
      ],
    },

    // Sheet 2: Gitブランチ・PR運用規約
    {
      name: "2_Gitブランチ・PR運用規約",
      widths: [20, 26, 44, 28],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["チーム開発 Gitブランチ戦略・Pull Request・レビュー規約", "", "", ""] },
        ...tableRows(
          ["ブランチ種別", "命名規則", "役割・運用ルール", "直接Push可否"],
          [
            ["main", "main", "リリース可能・提出用の安定ブランチ。developから動作確認後にマージ。", "禁止（PRのみ）"],
            ["develop", "develop", "チーム統合用ブランチ。各メンバーのfeatureブランチはここへPRを出す。", "禁止（PRのみ）"],
            ["feature", "feature/a-member-list 等", "各機能・各画面の実装用。最新developから作成する。", "担当本人のみOK"],
            ["fix", "fix/loan-stock-bug 等", "結合テストで見つかったバグ修正用。Issue番号を含めると尚良。", "担当本人のみOK"],
          ],
          [0, 1]
        ),
        { style: 0, cells: ["", "", "", ""] },
        { style: 3, height: 22, cells: ["毎日の開発ルーティン（コンフリクトを防ぐ鉄則）", "", "", ""] },
        ...tableRows(
          ["タイミング", "実行コマンド例", "目的", "注意点"],
          [
            ["1. 作業開始前", "git switch develop && git pull origin develop", "他メンバーの最新変更を取り込む", "古いdevelopから分岐しない"],
            ["2. ブランチ作成", "git switch -c feature/b-project-list", "1機能1ブランチで小さく切る", "複数機能を混ぜない"],
            ["3. こまめにCommit", "git commit -m \"feat: 案件一覧の検索機能を追加\"", "意味のある単位で履歴を残す", "ビルド通る状態でCommit"],
            ["4. PR作成前", "git merge origin/develop", "最新developを取り込み手元で競合解消", "コンフリクト放置でPR出さない"],
            ["5. PRレビュー", "GitHub上で他メンバー1名以上がApprove", "コード品質向上・相互理解", "「変更内容・動作確認方法」をPR本文に記載"],
          ],
          [1]
        ),
      ],
    },

    // Sheet 3: 画面一覧・権限マトリクス
    {
      name: "3_画面一覧・権限マトリクス",
      widths: [10, 14, 24, 24, 14, 14, 34],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["全10画面一覧 ＆ ロール別アクセス権限マトリクス", "", "", "", "", "", ""] },
        ...tableRows(
          ["画面ID", "担当", "画面名", "URLパス", "ADMIN", "USER", "主な業務目的"],
          [
            ["SCR-00", "全員", "ログイン画面", "GET /login", "可", "可", "メール＋パスワード認証（Spring Security）"],
            ["SCR-A1", "メンバーA", "ダッシュボード", "GET /dashboard", "可", "可", "自分の担当タスク数・申請中件数・最新お知らせを表示"],
            ["SCR-A2", "メンバーA", "社員一覧・検索", "GET /members", "可", "閲覧のみ", "部署・氏名で社員を検索。ADMINは登録/編集ボタン表示"],
            ["SCR-A3", "メンバーA", "社員登録・編集", "GET /members/new, /{id}/edit", "可", "不可(403)", "社員アカウントの作成・部署変更・ロール設定"],
            ["SCR-B1", "メンバーB", "案件一覧", "GET /projects", "可", "可", "進行中・完了案件の一覧、ステータス絞り込み、進捗率バー表示"],
            ["SCR-B2", "メンバーB", "案件詳細・タスク一覧", "GET /projects/{id}", "可", "可", "案件情報と紐づくタスク一覧・ステータスワンクリック更新"],
            ["SCR-B3", "メンバーB", "タスク登録・編集", "GET /tasks/new, /{id}/edit", "可", "可", "案件・担当者・期限・優先度を設定してタスク登録/更新"],
            ["SCR-C1", "メンバーC", "備品一覧・在庫検索", "GET /equipments", "可", "可", "社内PC/モニター等の備品一覧と貸出可能在庫数の確認"],
            ["SCR-C2", "メンバーC", "貸出申請・返却一覧", "GET /loans", "全件", "自分のみ", "備品の貸出申請フォームおよび貸出中・返却済み一覧"],
            ["SCR-C3", "メンバーC", "貸出申請詳細・承認", "GET /loans/{id}", "承認可", "閲覧のみ", "ADMINが申請を承認（在庫-1）または却下、返却処理（在庫+1）"],
          ],
          [0, 3]
        ),
      ],
    },

    // Sheet 4: 画面項目詳細設計
    {
      name: "4_画面項目詳細設計",
      widths: [10, 22, 40, 40],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["画面項目・アクション詳細設計（全10画面）", "", "", ""] },
        ...tableRows(
          ["画面ID", "画面名", "表示・入力項目", "ボタン・バリデーション・特記事項"],
          [
            ["SCR-00", "ログイン画面", "email（必須）, password（必須）", "「ログイン」→成功時 /dashboard へ遷移。失敗時は赤メッセージ。"],
            ["SCR-A1", "ダッシュボード", "ログイン者氏名・部署、未完了タスク件数カード、貸出中備品件数カード、期限が近いタスク上位5件テーブル", "各カードから担当画面へショートカット遷移。"],
            ["SCR-A2", "社員一覧・検索", "部署プルダウン、氏名キーワード入力、社員テーブル（社員番号/氏名/メール/部署/権限/操作）", "ADMINのみ「新規登録」「編集」「無効化」ボタンを表示。"],
            ["SCR-A3", "社員登録・編集", "社員番号(EMP-001形式)、氏名、メール（重複不可）、部署選択、権限選択、初期パスワード（新規時必須）", "メール重複チェック必須。パスワードはBCrypt保存。"],
            ["SCR-B1", "案件一覧", "ステータス絞り込み（計画中/進行中/完了）、案件名検索、案件テーブル（案件名/責任者/期間/進捗率%）", "進捗率＝完了タスク数 ÷ 全タスク数 × 100（0件時は0%）。"],
            ["SCR-B2", "案件詳細・タスク一覧", "案件ヘッダー情報、タスクテーブル（タスク名/担当者/期限/優先度/ステータス/操作）", "ステータス変更（TODO→IN_PROGRESS→DONE）をPOSTで即時反映。"],
            ["SCR-B3", "タスク登録・編集", "所属案件、タスク名（必須100字以内）、担当者、期限日、優先度（高/中/低）、詳細メモ", "期限日は過去日警告（任意）または必須チェック。"],
            ["SCR-C1", "備品一覧・在庫検索", "カテゴリ選択、備品名検索、備品テーブル（管理番号/備品名/総数/利用可能在庫/申請ボタン）", "利用可能在庫が0の備品は「在庫切れ」表示にし申請ボタンを無効化。"],
            ["SCR-C2", "貸出申請・返却一覧", "備品選択、数量（1以上・在庫以下）、利用目的、返却予定日、申請一覧テーブル（ステータスバッジ付）", "在庫不足時はService層でエラー返却。"],
            ["SCR-C3", "貸出申請詳細・承認", "申請者情報、備品情報、数量、利用目的、ステータス履歴、承認/却下/返却ボタン", "承認時に available_qty を減算、返却時に加算（@Transactional必須）。"],
          ]
        ),
      ],
    },

    // Sheet 5: テーブル定義・DDL
    {
      name: "5_テーブル定義・DDL",
      widths: [18, 20, 20, 12, 22, 34],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["チーム開発 データベース設計書（全6テーブル・PostgreSQL 16）", "", "", "", "", ""] },
        ...tableRows(
          ["テーブル名", "担当", "主キー", "外部キー", "主要カラム", "特記事項"],
          [
            ["departments", "メンバーA", "id (BIGSERIAL)", "-", "name (UNIQUE)", "初期データ：開発部・営業部・総務部"],
            ["users", "全員 / A", "id (BIGSERIAL)", "department_id -> departments(id)", "emp_code, email(UNIQUE), password_hash, full_name, role, is_active", "ログイン認証と社員管理で共用"],
            ["projects", "メンバーB", "id (BIGSERIAL)", "owner_id -> users(id)", "name, description, status, start_date, end_date", "status: PLANNING/ACTIVE/DONE"],
            ["tasks", "メンバーB", "id (BIGSERIAL)", "project_id -> projects(id), assignee_id -> users(id)", "title, description, priority, status, due_date", "priority: HIGH/MEDIUM/LOW"],
            ["equipments", "メンバーC", "id (BIGSERIAL)", "-", "asset_code(UNIQUE), name, category, total_qty, available_qty", "available_qty <= total_qty"],
            ["equipment_loans", "メンバーC", "id (BIGSERIAL)", "equipment_id -> equipments(id), user_id -> users(id)", "quantity, purpose, status, due_date, approved_by, returned_at", "status: PENDING/APPROVED/REJECTED/RETURNED"],
          ],
          [0, 2, 3, 4]
        ),
        { style: 0, cells: ["", "", "", "", "", ""] },
        { style: 3, height: 22, cells: ["チーム共通 schema.sql（全員同一DDLを最初に投入）", "", "", "", "", ""] },
        {
          style: 5,
          height: 240,
          cells: [
            "CREATE TABLE departments (\n  id BIGSERIAL PRIMARY KEY,\n  name VARCHAR(80) NOT NULL UNIQUE\n);\n\nCREATE TABLE users (\n  id BIGSERIAL PRIMARY KEY,\n  emp_code VARCHAR(20) NOT NULL UNIQUE,\n  email VARCHAR(255) NOT NULL UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  full_name VARCHAR(100) NOT NULL,\n  department_id BIGINT NOT NULL REFERENCES departments(id),\n  role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',\n  is_active BOOLEAN NOT NULL DEFAULT TRUE,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE projects (\n  id BIGSERIAL PRIMARY KEY,\n  name VARCHAR(150) NOT NULL,\n  description TEXT,\n  owner_id BIGINT NOT NULL REFERENCES users(id),\n  status VARCHAR(20) NOT NULL DEFAULT 'PLANNING',\n  start_date DATE,\n  end_date DATE,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE tasks (\n  id BIGSERIAL PRIMARY KEY,\n  project_id BIGINT NOT NULL REFERENCES projects(id),\n  assignee_id BIGINT REFERENCES users(id),\n  title VARCHAR(150) NOT NULL,\n  description TEXT,\n  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',\n  status VARCHAR(20) NOT NULL DEFAULT 'TODO',\n  due_date DATE,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE equipments (\n  id BIGSERIAL PRIMARY KEY,\n  asset_code VARCHAR(32) NOT NULL UNIQUE,\n  name VARCHAR(120) NOT NULL,\n  category VARCHAR(60) NOT NULL,\n  total_qty INTEGER NOT NULL CHECK (total_qty >= 0),\n  available_qty INTEGER NOT NULL CHECK (available_qty >= 0 AND available_qty <= total_qty)\n);\n\nCREATE TABLE equipment_loans (\n  id BIGSERIAL PRIMARY KEY,\n  equipment_id BIGINT NOT NULL REFERENCES equipments(id),\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  quantity INTEGER NOT NULL CHECK (quantity > 0),\n  purpose VARCHAR(255) NOT NULL,\n  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',\n  due_date DATE NOT NULL,\n  approved_by BIGINT REFERENCES users(id),\n  returned_at TIMESTAMP,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);",
            "",
            "",
            "",
            "",
            "",
          ],
        },
      ],
    },

    // Sheet 6: Controller・Service設計
    {
      name: "6_クラス・API担当設計",
      widths: [14, 24, 24, 24, 38],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["担当別 Controller / Service / Repository 境界設計（競合回避）", "", "", "", ""] },
        ...tableRows(
          ["担当", "Controller", "Service", "Repository", "競合しないためのファイル分割ルール"],
          [
            ["共通", "AuthController", "CustomUserDetailsService", "UserRepository", "Step2で全員合意のうえ確定し、以降は原則変更しない"],
            ["メンバーA", "DashboardController\nMemberController", "DashboardService\nMemberService", "DepartmentRepository\nUserRepository(参照)", "templates/dashboard.html, templates/members/*.html のみ編集"],
            ["メンバーB", "ProjectController\nTaskController", "ProjectService\nTaskService", "ProjectRepository\nTaskRepository", "templates/projects/*.html, templates/tasks/*.html のみ編集"],
            ["メンバーC", "EquipmentController\nLoanController", "EquipmentService\nLoanService", "EquipmentRepository\nEquipmentLoanRepository", "templates/equipments/*.html, templates/loans/*.html のみ編集"],
          ],
          [1, 2, 3]
        ),
      ],
    },

    // Sheet 7: 結合・受入テスト仕様書
    {
      name: "7_結合・受入テスト仕様",
      widths: [12, 16, 36, 36, 14, 16],
      freezeRow: 2,
      rows: [
        { style: 1, height: 30, cells: ["チーム結合テスト ＆ 受入テスト仕様書（画面間連携確認）", "", "", "", "", ""] },
        ...tableRows(
          ["テストID", "横断領域", "テストシナリオ", "期待される結果", "判定", "担当確認"],
          [
            ["IT-001", "認証→A", "一般ユーザーでログインし /dashboard を表示", "氏名・部署が表示され、/members/new へ直アクセスすると403になること", "未実施", "A"],
            ["IT-002", "A→B連携", "メンバーAで新規社員を登録 → メンバーBでその社員をタスク担当者に設定", "新規社員がタスク担当者プルダウンに現れ、ダッシュボード件数も+1されること", "未実施", "A & B"],
            ["IT-003", "B内部連携", "案件にタスクを2件登録し、1件をDONEに変更", "案件一覧の進捗率が 0% → 50% に自動更新されること", "未実施", "B"],
            ["IT-004", "C在庫トランザクション", "在庫2の備品に対して数量1の貸出申請→ADMINで承認→返却処理", "承認時に在庫2→1、返却時に1→2へ正確に増減すること", "未実施", "C"],
            ["IT-005", "C在庫超過防止", "在庫1の備品に対して数量2で貸出申請を実行", "バリデーション／業務エラーとなり登録されないこと", "未実施", "C"],
            ["IT-006", "共通ナビゲーション", "全10画面のヘッダーリンクから他メンバー担当画面へ相互遷移", "リンク切れ・404・レイアウト崩れがないこと", "未実施", "全員"],
            ["IT-007", "GitHub運用監査", "GitHubのPull RequestsタブとInsights/Contributorsを確認", "3名全員のPR・相互レビューコメント・Commit履歴が存在すること", "未実施", "全員"],
          ]
        ),
      ],
    },
  ];

  return buildWorkbookBuffer(sheets);
}

// ---------------------------------------------------------------------------
// 5. Execute Generation
// ---------------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });

const file1 = path.join(OUT_DIR, "product-management-design-spec.xlsx");
const buf1 = createProductManagementDesignSpec();
fs.writeFileSync(file1, buf1);
console.log(`Generated: ${file1} (${buf1.length} bytes)`);

const file2 = path.join(OUT_DIR, "team-project-design-spec.xlsx");
const buf2 = createTeamProjectDesignSpec();
fs.writeFileSync(file2, buf2);
console.log(`Generated: ${file2} (${buf2.length} bytes)`);
