/**
 * Pure Node.js OpenXML (.xlsx) Generator for DevSkillStudio 1-Year Curriculum
 * Generates two comprehensive Developer Detailed Design Specifications (v1.1.0):
 *   1. public/docs/product-management-design-spec.xlsx  (Spring Boot + SQL 個人開発：商品管理システム 全12シート)
 *   2. public/docs/team-project-design-spec.xlsx        (チーム開発 3人1組：TeamOps Hub 全13シート)
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

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0x5821, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(rawBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x5821, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(rawBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

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
// 2. OpenXML SpreadsheetML Builder
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

function tableRows(headers, dataRows, codeCols = []) {
  const out = [{ style: 2, height: 24, cells: headers }];
  dataRows.forEach((r, idx) => {
    const baseStyle = idx % 2 === 1 ? 4 : 0;
    const cells = r.map((val, cIdx) => (codeCols.includes(cIdx) ? { v: val, s: 5 } : val));
    out.push({ style: baseStyle, cells });
  });
  return out;
}

function banner(title, cols) {
  return { style: 1, height: 30, cells: [title, ...Array(cols - 1).fill("")] };
}

function subheader(title, cols) {
  return { style: 3, height: 22, cells: [title, ...Array(cols - 1).fill("")] };
}

function blank(cols) {
  return { style: 0, cells: Array(cols).fill("") };
}

// ===========================================================================
// 3. Workbook 1: 商品管理システム 開発者向け詳細設計書 v1.1.0（全12シート）
// ===========================================================================
function createProductManagementDesignSpec() {
  const sheets = [
    // Sheet 1: 00_表紙・読み方
    {
      name: "00_表紙・読み方",
      widths: [22, 48, 34, 24],
      freezeRow: 2,
      rows: [
        banner("商品管理システム 開発者向け詳細設計書 v1.1.0（Spring Boot 3.3 + PostgreSQL 16）", 4),
        subheader("1. 文書管理情報", 4),
        ...tableRows(
          ["項目", "内容", "補足", "備考"],
          [
            ["システム名", "商品管理システム（Product Manager）", "個人開発（2か月・8週カリキュラム）", "DevSkillStudio 公式設計書"],
            ["バージョン", "1.1.0（開発者向け改訂版）", "1.0.0(初版)の曖昧さ解消・実装粒度詳細化", "全12シート構成"],
            ["改訂方針", "①仕様の曖昧さ排除 ②メソッド署名・設定値・制約まで具体化 ③原典差異は判断ログ(D-01〜D-19)に全件記録", "未経験者がそのまま実装・テスト可能", "2026-11-23 改訂"],
            ["提出方式", "ステップ別ブランチ（feature/stepX-...）＋ GitHub Pull Request URL（/pull/番号）提出", "main直接Push禁止・Files changedで差分レビュー", "全6ステップ"],
          ]
        ),
        blank(4),
        subheader("2. 記法の凡例 ＆ シート構成", 4),
        ...tableRows(
          ["シート名", "いつ見るか", "主な内容", "対象Step"],
          [
            ["01_システム概要・環境", "環境構築時（Step 1）", "技術スタック、Maven(pom.xml)、application.properties、層のルール", "Step 1-2"],
            ["02_機能要件", "着手前・進捗確認時", "FN-001〜010、受入基準(AC)、非機能要件", "全Step"],
            ["03_画面設計", "Thymeleaf作成時", "全6画面の要素・name属性・制約・Model属性・共通部品", "Step 4-6"],
            ["04_URL・IF設計", "Controller作成時", "全12エンドポイント、認可、PRG、HTTPステータス方針", "Step 4-6"],
            ["05_クラス設計", "Service/Repo/Entity作成時", "パッケージ構成、メソッド署名、Repository検索条件、Entity/Form", "Step 3-5"],
            ["06_DB設計", "DB構築・Entity作成時", "users/categories/products定義、制約・インデックス方針、初期データ", "Step 3"],
            ["07_処理詳細", "Service実装時", "P-01〜P-07 の処理手順・トランザクション・状態遷移", "Step 4-6"],
            ["08_検証・エラー", "Form・例外処理実装時", "入力チェック、messages.properties、例外→画面対応", "Step 5-6"],
            ["09_セキュリティ", "SecurityConfig実装時", "フォーム認証・BCrypt・CSRF・レビューチェックリスト", "Step 6"],
            ["10_テスト仕様", "実装完了後・提出前", "単体・結合テスト TC-001〜TC-022（全22ケース）", "Step 4-6"],
            ["11_開発手順・設計判断ログ", "毎週の計画・レビュー時", "6ステップDoD、PR運用規約、README必須項目、設計判断ログ D-01〜D-19", "全Step"],
          ]
        ),
      ],
    },

    // Sheet 2: 01_システム概要・環境
    {
      name: "01_システム概要・環境",
      widths: [24, 44, 38],
      freezeRow: 2,
      rows: [
        banner("01 システム概要・開発環境（Maven / Spring Boot 3.3 / PostgreSQL 16）", 3),
        subheader("1. 技術スタック", 3),
        ...tableRows(
          ["項目", "内容", "備考・ルール"],
          [
            ["言語・JDK", "Java 21 (LTS)", "Eclipse Installed JREs と Maven release を 21 に統一"],
            ["フレームワーク", "Spring Boot 3.3.x（Web / Data JPA / Thymeleaf / Validation / Security）", "thymeleaf-extras-springsecurity6 を追加"],
            ["ビルドツール", "Maven（pom.xml / Maven Wrapper 同梱）", "【補足 D-13】実務標準の Maven（pom.xml）に統一"],
            ["データベース", "PostgreSQL 16.x ／ DB名: product_mgmt_db ／ ポート 5432 ／ UTF-8", "pgAdmin 4 または psql で操作"],
            ["ORM", "Spring Data JPA（Hibernate 6）", "ddl-auto=validate（DDLは受講生が作成し起動時に整合検証）"],
            ["認証・暗号化", "Spring Security 6（フォームログイン / BCrypt）", "ログインID項目名は email（D-12）"],
            ["バージョン管理", "Git + GitHub（各Stepごとに feature/stepX-... ブランチ → Pull Request URL提出）", "main直接Push禁止・README.md必須"],
          ]
        ),
        blank(3),
        subheader("2. Maven 依存関係（pom.xml）＆ 推奨 application.properties", 3),
        ...tableRows(
          ["キー / artifactId", "設定値 / 用途", "目的"],
          [
            ["spring-boot-starter-web / thymeleaf / data-jpa / validation / security", "MVC / 画面 / DB / 検証 / 認証", "必須依存関係（compile）"],
            ["thymeleaf-extras-springsecurity6 / org.postgresql:postgresql", "画面ログイン表示 / PostgreSQL JDBCドライバ", "compile / runtime"],
            ["spring.datasource.url", "jdbc:postgresql://localhost:5432/product_mgmt_db", "接続先DB"],
            ["spring.datasource.username / password", "環境変数 DB_USER / DB_PASSWORD（未設定時 postgres）", "パスワードをGitHubにコミットしない"],
            ["spring.jpa.hibernate.ddl-auto", "validate", "テーブルとEntityの食い違いを起動時検知"],
            ["spring.jpa.open-in-view", "false", "【提案 D-17】遅延ロードをService内で完結"],
            ["spring.jpa.properties.hibernate.jdbc.time_zone", "Asia/Tokyo", "日時をJSTで統一"],
            ["server.error.whitelabel.enabled", "false", "自作の共通エラー画面（error.html）を使用"],
            ["spring.servlet.session.timeout", "30m", "セッション有効期限"],
          ],
          [0, 1]
        ),
        blank(3),
        subheader("3. MVC 3層アーキテクチャの責務ルール", 3),
        ...tableRows(
          ["層", "やること", "やってはいけないこと"],
          [
            ["Controller", "HTTP受付、@Valid形式検証、Model詰め替え、画面遷移（PRG）", "Repository直接呼び出し、業務判断、Entity直接バインド"],
            ["Service", "業務ロジック、@Transactional、重複チェック、Entity⇔Form変換", "HttpServletRequest / Model / 画面文言への依存"],
            ["Repository", "Spring Data JPA（検索条件・JOIN FETCH・論理削除条件）", "業務ルールの混入"],
            ["Entity / Form", "Entity＝DB1対1（@Data禁止）／ Form＝画面入力＋Bean Validation", "Entityに画面検証を書く／FormにDB参照を持つ"],
          ]
        ),
      ],
    },

    // Sheet 3: 02_機能要件
    {
      name: "02_機能要件",
      widths: [10, 20, 36, 14, 42, 18],
      freezeRow: 2,
      rows: [
        banner("02 機能要件一覧（FN-001〜FN-010・受入基準 AC つき）", 6),
        ...tableRows(
          ["機能ID", "機能名", "詳細要件", "優先度/Step", "受入基準（AC）", "関連画面/TC"],
          [
            ["FN-001", "ログイン認証機能", "メールとパスワードで認証（BCrypt）。未ログイン時は自動で /login へリダイレクト。", "必須 / Step 6", "登録済メール＋正PW→/products、誤PW→/login?error（同一文言）、未ログイン直アクセス→302 /login", "SCR-01 / TC-001〜003"],
            ["FN-002", "ログアウト機能", "ヘッダーのログアウトボタンでセッション破棄し /login?logout へ遷移。", "必須 / Step 6", "POST /logout（CSRF付）でセッション破棄、ログアウト後ブラウザバックで操作不可", "全画面 / TC-017"],
            ["FN-003", "商品一覧表示機能", "is_deleted=false の商品をカテゴリ名付きで一覧表示。在庫10未満は赤バッジ警告。", "必須 / Step 4", "削除済非表示、stock<10赤バッジ(10は非表示)、並び順id昇順(D-11)、0件時メッセージ", "SCR-02 / TC-004,015"],
            ["FN-004", "商品検索・絞り込み", "商品名（部分一致・大小無視）とカテゴリIDでAND検索。条件をフォームに保持。", "必須 / Step 4", "未指定全件、クリアでリセット、% _ を含む語もLIKEエスケープで文字通り検索(D-14)", "SCR-02 / TC-005,018,021"],
            ["FN-005", "商品詳細表示機能", "一覧の商品名クリックで詳細へ。SKU・価格・在庫・説明・登録/更新日時を表示。", "必須 / Step 4", "単価3桁区切り+円、未存在・削除済IDは404エラー画面", "SCR-03 / TC-011,013"],
            ["FN-006", "商品新規登録機能", "検証通過後に登録し一覧へリダイレクト（PRG）＋完了フラッシュメッセージ。", "必須 / Step 5", "is_deleted=falseで登録、NG時フォーム再表示・入力値保持、SKU重複エラー(削除済含むD-04)", "SCR-04 / TC-006〜008,016,020,022"],
            ["FN-007", "商品情報編集機能", "既存商品を初期表示し、検証通過後にUPDATE。自レコード以外のSKU重複はエラー。", "必須 / Step 5", "自SKUのまま更新OK、他SKU変更はエラー(D-03)、updated_atのみ更新(created_at不変)", "SCR-05 / TC-009,014"],
            ["FN-008", "商品論理削除機能", "confirmダイアログ後に is_deleted=true へ更新（物理削除禁止）。", "必須 / Step 5", "キャンセル時無変化、OK時DB行は残りis_deleted=true、詳細・編集直アクセスは404", "SCR-02,03 / TC-010,013"],
            ["FN-009", "カテゴリマスタ連携", "categories からプルダウン選択肢を動的取得して検索・登録・編集に表示。", "必須 / Step 3-4", "sort_order昇順(同値id昇順)、検索先頭「すべて」、フォーム先頭「選択してください」", "SCR-02,04,05 / TC-020"],
            ["FN-010", "共通エラー画面", "404/403/500で分かりやすい自作エラー画面（error.html）を表示。", "推奨 / Step 6", "ステータス・メッセージ・一覧へ戻るリンク表示、スタックトレース画面非表示、Whitelabel無効", "SCR-06 / TC-011"],
          ]
        ),
      ],
    },

    // Sheet 4: 03_画面設計
    {
      name: "03_画面設計",
      widths: [10, 20, 22, 24, 38, 22],
      freezeRow: 2,
      rows: [
        banner("03 画面設計（全6画面・項目定義・Model属性）", 6),
        subheader("1. 画面一覧", 6),
        ...tableRows(
          ["画面ID", "画面名", "URL", "テンプレート", "主要要素・操作", "認証・遷移先"],
          [
            ["SCR-01", "ログイン", "GET /login", "templates/login.html", "email / password / ログインボタン / error・logoutメッセージ", "不要 / 成功→/products"],
            ["SCR-02", "商品一覧（検索）", "GET /products", "templates/products/list.html", "検索フォーム(keyword, categoryId)、新規登録、商品テーブル(在庫少バッジ・削除POST+confirm)", "必要 / 詳細・登録・編集"],
            ["SCR-03", "商品詳細", "GET /products/{id}", "templates/products/detail.html", "全項目表示(単価3桁区切り円・日時yyyy/MM/dd HH:mm)、編集・削除・一覧へ戻る", "必要 / 一覧・編集"],
            ["SCR-04", "商品新規登録", "GET /products/new", "templates/products/form.html", "SKU(PRD-0001)/商品名/カテゴリ/単価/在庫/説明/登録・キャンセル", "必要 / POST /products"],
            ["SCR-05", "商品編集", "GET /products/{id}/edit", "templates/products/form.html", "SCR-04と共通フォーム（productId有無でタイトル・action切替）", "必要 / POST /products/{id}"],
            ["SCR-06", "エラー画面", "自動遷移 (/error)", "templates/error.html", "HTTPステータスコード、エラーメッセージ、/productsへ戻るリンク", "不要"],
          ],
          [2, 3]
        ),
        blank(6),
        subheader("2. Controller → テンプレート Model属性", 6),
        ...tableRows(
          ["画面", "属性名", "型", "設定元", "用途・注意点", "備考"],
          [
            ["SCR-02", "products / categories / keyword / categoryId", "List<Product> / List<Category> / String / Long", "ProductService / CategoryService", "categoryをJOIN FETCHしN+1回避。検索条件をフォームへ戻す", ""],
            ["SCR-03", "product", "Product", "ProductService.findById()", "未存在・削除済はProductNotFoundException(404)", ""],
            ["SCR-04/05", "productForm / categories / productId", "ProductForm / List<Category> / Long", "Controller / Service", "検証エラー再表示時もcategoriesを必ず再セット", "productId=nullは新規"],
            ["SCR-06", "status / message", "int / String", "GlobalExceptionHandler", "404/403/500ごとの安全メッセージ", "スタックトレース禁止"],
            ["全画面", "message / errorMessage", "String (Flash)", "RedirectAttributes", "PRGリダイレクト後の1回限り完了通知", "layout.htmlで共通表示"],
          ],
          [1, 2]
        ),
      ],
    },

    // Sheet 5: 04_URL・IF設計
    {
      name: "04_URL・IF設計",
      widths: [10, 24, 28, 30, 34],
      freezeRow: 2,
      rows: [
        banner("04 URL・インターフェース設計（全12エンドポイント・PRG・ステータス方針）", 5),
        ...tableRows(
          ["Method", "Path", "Controller#method", "成功時", "失敗・例外時"],
          [
            ["GET", "/", "AuthController#root()", "302 → /products【提案 D-10】", "-"],
            ["GET", "/login", "AuthController#showLogin()", "200 login.html", "-"],
            ["POST", "/login", "Spring Security (email, password, _csrf)", "302 → /products（常に）", "302 → /login?error"],
            ["POST", "/logout", "Spring Security (_csrf)", "302 → /login?logout（セッション破棄）", "CSRF不正時 403"],
            ["GET", "/products", "ProductController#list(keyword, categoryId, model)", "200 products/list.html", "categoryId非数値 → 404"],
            ["GET", "/products/{id}", "ProductController#detail(id, model)", "200 products/detail.html", "未存在・削除済 → 404"],
            ["GET", "/products/new", "ProductController#showCreateForm(model)", "200 products/form.html（空）", "-"],
            ["POST", "/products", "ProductController#create(@Valid ProductForm, br, ra, model)", "302 → /products ＋ flash『商品を登録しました』", "検証NG/SKU重複/カテゴリ不正 → 200 form.html再表示"],
            ["GET", "/products/{id}/edit", "ProductController#showEditForm(id, model)", "200 products/form.html（既存値）", "未存在・削除済 → 404"],
            ["POST", "/products/{id}", "ProductController#update(id, @Valid ProductForm, br, ra, model)", "302 → /products ＋ flash『商品を更新しました』", "検証NG/重複 → 200 form.html ／ 未存在 → 404"],
            ["POST", "/products/{id}/delete", "ProductController#delete(id, ra)", "302 → /products ＋ flash『商品を削除しました』", "未存在・削除済 → 404"],
            ["GET", "/error", "ErrorController / GlobalExceptionHandler", "error.html 表示", "-"],
          ],
          [0, 1, 2]
        ),
      ],
    },

    // Sheet 6: 05_クラス設計
    {
      name: "05_クラス設計",
      widths: [22, 32, 42, 24],
      freezeRow: 2,
      rows: [
        banner("05 クラス・Repository・Entity設計（com.example.product）", 4),
        subheader("1. Service / Controller / Exception 主要メソッド", 4),
        ...tableRows(
          ["クラス", "メソッド署名", "責務・処理内容", "例外"],
          [
            ["ProductController", "list / detail / showCreateForm / create / showEditForm / update / delete / initBinder", "HTTP受付・@Valid検証・initBinder(StringTrimmerEditor(true))・PRG制御", "BusinessExceptionは内部catch→rejectValue"],
            ["ProductService", "search(keyword, categoryId) / findById(id) / findFormById(id) / create(form) / update(id, form) / softDelete(id)", "クラスに@Transactional(readOnly=true)、更新系に@Transactional。LIKEエスケープ・重複チェック・saveAndFlush競合変換", "ProductNotFoundException / BusinessException"],
            ["CategoryService", "findAllOrdered()", "sortOrder昇順（同値id昇順）で全カテゴリ返却", "-"],
            ["CustomUserDetailsService", "loadUserByUsername(email)", "UserRepository.findByEmail→LoginUser返却", "UsernameNotFoundException"],
            ["GlobalExceptionHandler", "handleNotFound / handleTypeMismatch / handleNoResource / handleAny", "404/403/500ごとにerror.html返却。想定外はERRORログ出力", "-"],
            ["ProductConstants", "LOW_STOCK_THRESHOLD = 10", "【提案 D-16】在庫少バッジ閾値定数", "-"],
          ],
          [0, 1]
        ),
        blank(4),
        subheader("2. Repository メソッド（D-03：新規と編集のSKU重複チェックを分離）", 4),
        ...tableRows(
          ["Repository", "メソッド", "検索条件（論理名称）", "注意点"],
          [
            ["ProductRepository", "search(keyword, categoryId)", "deleted=false AND 商品名LIKE(大小無視・ESCAPE) AND (categoryId一致) ORDER BY id ASC（categoryをJOIN FETCH）", "keywordはnullでなく空文字に正規化"],
            ["ProductRepository", "findByIdAndDeletedFalse(id)", "id一致 AND deleted=false（categoryをJOIN FETCH）", "詳細・編集・削除で使用"],
            ["ProductRepository", "existsBySku(sku)", "sku一致（削除済含む）", "新規登録専用（D-03, D-04）"],
            ["ProductRepository", "existsBySkuAndIdNot(sku, id)", "sku一致 AND id≠自ID（削除済含む）", "編集専用（D-03）"],
            ["CategoryRepository", "findAllByOrderBySortOrderAscIdAsc()", "sortOrder昇順→id昇順", "-"],
            ["UserRepository", "findByEmail(email)", "email一致", "ログイン認証用"],
          ],
          [0, 1]
        ),
        blank(4),
        subheader("3. Entity設計注意点（D-05）", 4),
        ...tableRows(
          ["Entity", "フィールド名（抜粋）", "テーブル列対応", "注意事項"],
          [
            ["Product", "id, sku, name, category(ManyToOne LAZY), price, stock, description, deleted, createdAt, updatedAt", "is_deleted → boolean deleted", "【D-05】isDeletedだとLombok/JPAと衝突するためdeletedとする。@Data禁止"],
            ["Category / User", "Category(id, name, sortOrder) / User(id, email, passwordHash, fullName, role, createdAt)", "各テーブルと1対1対応", "@Getter / @Setter を個別付与"],
          ],
          [0, 1, 2]
        ),
      ],
    },

    // Sheet 7: 06_DB設計
    {
      name: "06_DB設計",
      widths: [18, 20, 18, 10, 22, 38],
      freezeRow: 2,
      rows: [
        banner("06 データベース設計（PostgreSQL 16・product_mgmt_db・3テーブル）", 6),
        subheader("1. users テーブル（ログインユーザー管理）", 6),
        ...tableRows(
          ["カラム名", "論理名", "データ型", "NULL", "制約・デフォルト", "備考・Entity対応"],
          [
            ["id", "ユーザーID", "BIGSERIAL", "NO", "PRIMARY KEY", "Long id"],
            ["email", "メールアドレス", "VARCHAR(255)", "NO", "UNIQUE", "ログインID → String email"],
            ["password_hash", "パスワードハッシュ", "VARCHAR(255)", "NO", "-", "BCrypt 60文字 → passwordHash"],
            ["full_name", "氏名", "VARCHAR(100)", "NO", "-", "ヘッダー表示名 → fullName"],
            ["role", "権限", "VARCHAR(20)", "NO", "DEFAULT 'ROLE_USER' / CHECK", "ROLE_ADMIN / ROLE_USER"],
            ["created_at", "作成日時", "TIMESTAMP", "NO", "DEFAULT CURRENT_TIMESTAMP", "LocalDateTime createdAt"],
          ],
          [0, 2, 4]
        ),
        blank(6),
        subheader("2. categories / products テーブル", 6),
        ...tableRows(
          ["テーブル.カラム名", "論理名", "データ型", "NULL", "制約・デフォルト", "備考"],
          [
            ["categories.id", "カテゴリID", "BIGSERIAL", "NO", "PRIMARY KEY", ""],
            ["categories.name", "カテゴリ名", "VARCHAR(100)", "NO", "UNIQUE", "PC・周辺機器 / 書籍 / オフィス用品"],
            ["categories.sort_order", "表示順", "INTEGER", "NO", "DEFAULT 0", "昇順表示"],
            ["products.id", "商品ID", "BIGSERIAL", "NO", "PRIMARY KEY", ""],
            ["products.sku", "商品コード(SKU)", "VARCHAR(32)", "NO", "UNIQUE", "削除済含む一意（D-04）"],
            ["products.name", "商品名", "VARCHAR(150)", "NO", "-", "検索対象"],
            ["products.category_id", "カテゴリID", "BIGINT", "NO", "FK → categories(id)", "インデックス推奨"],
            ["products.price", "単価（税抜円）", "INTEGER", "NO", "CHECK (price >= 0)", "アプリ上限 10,000,000"],
            ["products.stock", "在庫数", "INTEGER", "NO", "CHECK (stock >= 0)", "10未満警告・アプリ上限 999,999"],
            ["products.description", "商品説明", "TEXT", "YES", "-", "最大1000文字"],
            ["products.is_deleted", "論理削除フラグ", "BOOLEAN", "NO", "DEFAULT FALSE", "Entity名: deleted（D-05）"],
            ["products.created_at / updated_at", "登録/更新日時", "TIMESTAMP", "NO", "DEFAULT CURRENT_TIMESTAMP", "JST運用"],
          ],
          [0, 2, 4]
        ),
        blank(6),
        subheader("3. 初期データ仕様（投入方法は受講生が設計：DDLは本定義から作成し ddl-auto=validate で検証）", 6),
        ...tableRows(
          ["種別", "識別子", "名称", "区分/カテゴリ", "値（単価/在庫/権限）", "テスト確認用途"],
          [
            ["ユーザー", "admin@example.com", "管理者 太郎", "ROLE_ADMIN", "開発PW: Passw0rd! (BCrypt保存)", "TC-002 ログイン確認"],
            ["ユーザー", "user@example.com", "一般 花子", "ROLE_USER", "開発PW: Passw0rd! (BCrypt保存)", "一般ユーザー確認"],
            ["商品", "PRD-0001", "ワイヤレスマウス", "PC・周辺機器", "2,980円 / 在庫25", "TC-005 検索『マウス』"],
            ["商品", "PRD-0002", "メカニカルキーボード", "PC・周辺機器", "8,800円 / 在庫8", "TC-004 在庫少バッジ確認"],
            ["商品", "PRD-0003", "Spring Boot 入門書", "書籍", "3,200円 / 在庫40", "TC-018 大文字小文字検索"],
            ["商品", "PRD-0004", "A4コピー用紙 500枚", "オフィス用品", "480円 / 在庫120", "一覧表示確認"],
            ["商品", "PRD-0005", "USB-Cハブ", "PC・周辺機器", "4,500円 / 在庫3", "在庫少バッジ確認"],
          ]
        ),
        blank(6),
        subheader("4. 参考DDL骨格（受講生が PostgreSQL 16 用に schema.sql を構築する際の確認用）", 6),
        {
          style: 5,
          height: 150,
          cells: [
            "CREATE TABLE users (id BIGSERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, full_name VARCHAR(100) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_ADMIN','ROLE_USER')), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE categories (id BIGSERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, sort_order INTEGER NOT NULL DEFAULT 0);\nCREATE TABLE products (id BIGSERIAL PRIMARY KEY, sku VARCHAR(32) NOT NULL UNIQUE, name VARCHAR(150) NOT NULL, category_id BIGINT NOT NULL REFERENCES categories(id), price INTEGER NOT NULL CHECK (price >= 0), stock INTEGER NOT NULL CHECK (stock >= 0), description TEXT, is_deleted BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);\nCREATE INDEX idx_products_category_id ON products(category_id);",
            "", "", "", "", "",
          ],
        },
      ],
    },

    // Sheet 8: 07_処理詳細
    {
      name: "07_処理詳細",
      widths: [14, 18, 24, 60],
      freezeRow: 2,
      rows: [
        banner("07 処理詳細（P-01〜P-07：Service / Controller 実装手順）", 4),
        ...tableRows(
          ["処理ID", "機能", "層", "処理手順"],
          [
            ["P-01", "認証 (FN-001/002)", "Security", "POST /login(email,password) → CustomUserDetailsService → BCrypt照合 → 成功302 /products、失敗302 /login?error。POST /logout → セッション破棄→/login?logout"],
            ["P-02", "一覧・検索 (FN-003/004)", "Service/Repo", "keyword==null→\"\"、trim、\\ % _ をエスケープ → deleted=false・大小無視LIKE・categoryId(任意)・id昇順・category JOIN FETCH → list.html"],
            ["P-03", "詳細 (FN-005)", "Service", "findByIdAndDeletedFalse(id) → 無ければ ProductNotFoundException → GlobalExceptionHandler が HTTP 404 で error.html 返却"],
            ["P-04", "新規登録 (FN-006)", "Controller/Service", "@Valid検証→エラー時categories再セットしform再表示。Service(@Transactional): カテゴリ存在確認→existsBySku→saveAndFlush(競合時DataIntegrityViolation→BusinessException)→PRG 302 /products＋flash"],
            ["P-05", "編集 (FN-007)", "Controller/Service", "findByIdAndDeletedFalse(id)→カテゴリ確認→existsBySkuAndIdNot(sku,id)→値詰め替え(dirty checkingでupdated_at自動更新)→PRG 302 /products＋flash"],
            ["P-06", "論理削除 (FN-008)", "View/Service", "confirmダイアログOK→Service(@Transactional): findByIdAndDeletedFalse(id)→setDeleted(true)（DELETE禁止）→PRG 302 /products＋flash"],
            ["P-07", "エラー処理 (FN-010)", "ExceptionHandler", "ProductNotFound/TypeMismatch/NoResource→404、AccessDenied→403、その他Exception→500(ERRORログ出力・画面にスタックトレース非表示)"],
          ]
        ),
      ],
    },

    // Sheet 9: 08_検証・エラー
    {
      name: "08_検証・エラー",
      widths: [16, 18, 28, 28, 40],
      freezeRow: 2,
      rows: [
        banner("08 入力検証・エラー処理（D-01, D-02 差異修正反映済）", 5),
        ...tableRows(
          ["フィールド", "項目名", "アノテーション / 条件", "メッセージキー", "エラーメッセージ"],
          [
            ["sku", "商品コード(SKU)", "@NotBlank / @Pattern(\"^[A-Z0-9-]{3,32}$\")", "NotBlank/Pattern.productForm.sku", "SKUは半角英大文字・数字・ハイフン3〜32文字で入力してください"],
            ["sku（業務）", "SKU重複", "新規: existsBySku / 編集: existsBySkuAndIdNot", "duplicate.sku", "この商品コード(SKU)はすでに登録されています"],
            ["name", "商品名（必須）", "@NotBlank", "NotBlank.productForm.name", "商品名は必須です（D-02分離）"],
            ["name", "商品名（文字数）", "@Size(max = 150)", "Size.productForm.name", "商品名は150文字以内で入力してください（D-02分離）"],
            ["categoryId", "カテゴリ", "@NotNull ＋ Service存在確認", "NotNull.productForm.categoryId / invalid.category", "カテゴリを選択してください"],
            ["price", "単価", "@NotNull @Min(0) @Max(10000000) / typeMismatch", "Min/Max/typeMismatch.productForm.price", "単価は0〜10,000,000の整数で入力してください"],
            ["stock", "在庫数", "@NotNull @Min(0) @Max(999999) / typeMismatch", "Min/Max/typeMismatch.productForm.stock", "在庫数は0〜999,999の整数で入力してください（D-01修正）"],
            ["description", "商品説明", "@Size(max = 1000)", "Size.productForm.description", "商品説明は1000文字以内で入力してください"],
            ["email/password", "ログイン認証", "DaoAuthenticationProvider", "login.html", "メールアドレスまたはパスワードが正しくありません"],
          ],
          [0, 2, 3]
        ),
      ],
    },

    // Sheet 10: 09_セキュリティ
    {
      name: "09_セキュリティ",
      widths: [20, 42, 42],
      freezeRow: 2,
      rows: [
        banner("09 セキュリティ設計 ＆ レビューチェックリスト（Spring Security 6）", 3),
        ...tableRows(
          ["項目", "設計値・設定内容", "確認観点・テストID"],
          [
            ["URL認可", "permitAll: /login, /error, /css/**, /js/**, /images/**。それ以外はすべて authenticated()", "TC-001 未ログイン直アクセス→302 /login"],
            ["ログイン設定", "loginPage(/login), loginProcessingUrl(/login), usernameParameter(email), defaultSuccessUrl(/products, true)", "TC-002, TC-003 ユーザー列挙防止（同一文言）"],
            ["パスワード", "BCryptPasswordEncoder（平文保存・ログ出力禁止）", "DBのpassword_hashが $2a$/$2b$ 60文字"],
            ["ログアウト", "POST /logout → /login?logout、セッション破棄、JSESSIONID削除", "TC-017 ブラウザバック操作不可"],
            ["CSRF / XSS / SQLi", "CSRF有効（全POSTフォームに_csrf）、Thymeleaf自動エスケープ（th:utext禁止）、パラメータバインドのみ", "TC-019 CSRFトークンなしPOST→403"],
            ["情報漏洩防止", "エラー画面にスタックトレース・SQL非表示。DBパスワードは環境変数化", "TC-011 / application.properties確認"],
          ]
        ),
      ],
    },

    // Sheet 11: 10_テスト仕様
    {
      name: "10_テスト仕様",
      widths: [10, 18, 30, 34, 12, 16],
      freezeRow: 2,
      rows: [
        banner("10 単体・結合テスト仕様書（TC-001〜TC-022 全22ケース）", 6),
        ...tableRows(
          ["TC-ID", "対象機能", "操作手順・入力値", "期待される結果", "判定", "区分・備考"],
          [
            ["TC-001", "未ログイン制御", "未ログインで /products に直アクセス", "/login へ302リダイレクト", "未実施", "原典"],
            ["TC-002", "ログイン正常系", "admin@example.com / Passw0rd! でログイン", "/products遷移・ヘッダー氏名表示", "未実施", "原典"],
            ["TC-003", "ログイン異常系", "誤PW・未存在メールでログイン", "同一エラーメッセージで /login?error", "未実施", "原典"],
            ["TC-004", "商品一覧表示", "初期データ5件で /products を開く", "未削除のみ表示・在庫10未満(PRD-0002,0005)赤バッジ", "未実施", "原典"],
            ["TC-005", "商品複合検索", "商品名『マウス』＋カテゴリ『PC・周辺機器』", "一致商品のみ表示・検索条件保持", "未実施", "原典"],
            ["TC-006", "商品登録正常系", "必須全項目入力し登録→F5再読込", "DB1件登録・302・フラッシュ表示・二重登録なし", "未実施", "原典 PRG"],
            ["TC-007", "登録バリデーション", "商品名空欄・単価-100で登録", "未登録・項目下赤エラー・他入力値保持", "未実施", "原典"],
            ["TC-008", "SKU重複チェック", "既存SKU(PRD-0001)で新規登録", "未登録・SKU欄下に重複エラー", "未実施", "原典"],
            ["TC-009", "商品編集正常系", "単価と在庫を変更して更新", "値更新・updated_at更新・created_at不変", "未実施", "原典"],
            ["TC-010", "商品論理削除", "削除→confirm OK", "一覧非表示・DB行は残りis_deleted=true", "未実施", "原典"],
            ["TC-011", "404エラー確認", "/products/999999 と /nosuchpage へアクセス", "自作404エラー画面・スタックトレース非表示", "未実施", "原典"],
            ["TC-012", "GitHub PR提出確認", "別フォルダへ git clone → README通りに起動", "起動・ログイン・一覧表示が成功", "未実施", "原典 提出必須"],
            ["TC-013", "削除済アクセス", "削除済IDの /products/X、/edit に直アクセス", "いずれも404エラー画面", "未実施", "【提案】"],
            ["TC-014", "編集時SKU重複", "①自SKUのまま更新 ②他商品SKUへ変更", "①成功 ②重複エラー（自レコード除外）", "未実施", "【提案】D-03"],
            ["TC-015", "在庫警告境界", "在庫9と10で一覧表示", "9は警告バッジあり、10はなし", "未実施", "【提案】"],
            ["TC-016", "入力境界値", "SKU小文字/2文字、単価上限超過/abc、在庫100万、説明1001文字", "すべて08のメッセージ表示（上限値は登録可）", "未実施", "【提案】"],
            ["TC-017", "ログアウト", "ログアウト→ブラウザ戻るで /products", "/login?logout遷移・戻っても再ログイン要求", "未実施", "【提案】"],
            ["TC-018", "大小文字検索", "spring / SPRING で検索", "『Spring Boot 入門書』が両方ヒット", "未実施", "【提案】"],
            ["TC-019", "CSRF保護", "CSRFトークンなしで POST /products/{id}/delete", "403エラーで削除されない", "未実施", "【提案】"],
            ["TC-020", "不正カテゴリID", "categoryId=99999 でPOST登録", "未登録・『カテゴリを選択してください』表示", "未実施", "【提案】"],
            ["TC-021", "LIKE特殊文字", "商品名に『%』『_』で検索", "全件ヒットせず文字通り一致のみ（0件）", "未実施", "【提案】D-14"],
            ["TC-022", "削除済SKU再利用", "論理削除済SKUで新規登録", "重複エラー（DB UNIQUE制約と整合）", "未実施", "【提案】D-04"],
          ]
        ),
      ],
    },

    // Sheet 12: 11_開発手順・設計判断ログ
    {
      name: "11_開発手順・設計判断ログ",
      widths: [10, 14, 34, 36, 22],
      freezeRow: 2,
      rows: [
        banner("11 開発手順（6ステップ・PR提出運用）＆ 設計判断ログ（D-01〜D-19）", 5),
        subheader("1. 6ステップ完了条件（DoD）＆ 推奨ブランチ（全Step Pull Request URL提出）", 5),
        ...tableRows(
          ["Step", "推奨ブランチ", "作業内容", "完了条件（DoD）", "提出形式"],
          [
            ["Step 1", "feature/step1-setup", "JDK21/Eclipse/PostgreSQL16構築、mainに初回README作成後ブランチで.gitignore等を追加", "ローカルDB作成・初回PR作成済", "GitHub PR URL (/pull/1)"],
            ["Step 2", "feature/step2-spring-db", "Spring Initializr(Maven)作成、application.properties設定、起動・DB疎通確認", "起動成功・PR作成済", "GitHub PR URL (/pull/2)"],
            ["Step 3", "feature/step3-db-entity", "06_DB設計に基づきDDL作成＆初期データ投入、Entity3・Repo3・CategoryService作成", "ddl-auto=validate起動成功", "GitHub PR URL (/pull/3)"],
            ["Step 4", "feature/step4-product-list", "商品一覧・検索・詳細（Controller/Service/list.html/detail.html）", "TC-004,005,015,018,021合格", "GitHub PR URL (/pull/4)"],
            ["Step 5", "feature/step5-product-crud", "商品新規登録・編集・論理削除・バリデーション・PRG・フラッシュ", "TC-006〜010,013,014,016,020,022合格", "GitHub PR URL (/pull/5)"],
            ["Step 6", "feature/step6-security-final", "Spring Security導入、共通エラー画面、README整備、TC-001〜022全件実施", "全22TC合格・clone起動確認済", "GitHub PR URL (/pull/6)"],
          ],
          [1]
        ),
        blank(5),
        subheader("2. 設計判断・差異ログ（D-01〜D-19）", 5),
        ...tableRows(
          ["No", "区分", "判断内容・理由", "本書での扱い", "影響シート"],
          [
            ["D-01", "差異修正", "在庫数エラー文言と@Max(999999)の不整合", "『在庫数は0〜999,999の整数で入力してください』に統一", "08, 10"],
            ["D-02", "差異修正", "商品名のNotBlankとSizeが同一文言", "NotBlankとSizeでエラーメッセージを分離", "08"],
            ["D-03", "補足", "新規登録にexistsBySkuAndIdNotを使うとid=null比較が偽になる", "新規＝existsBySku、編集＝existsBySkuAndIdNot に分離", "05, 07, 10"],
            ["D-04", "補足", "SKUのUNIQUE制約は論理削除行も対象", "重複チェックは削除済含む（TC-022確認）", "06, 10"],
            ["D-05", "提案", "Entity論理削除フィールド名衝突回避", "テーブル列is_deletedに対しフィールド名はdeleted（@Data禁止）", "05, 06"],
            ["D-06〜08", "提案", "業務エラー・空白入力・エラー画面実装方式", "BusinessException(field,code) / StringTrimmerEditor(true) / GlobalExceptionHandler", "04, 05, 07, 08"],
            ["D-10〜14", "補足/提案", "ルート/・並び順・ログイン項目名・ビルドツール・LIKE特殊文字", "/→/products、id昇順、email、Maven統一、LIKEエスケープ", "01, 02, 04, 05, 09, 10"],
            ["D-16〜18", "提案", "在庫閾値定数・open-in-view・DDL主体性", "LOW_STOCK_THRESHOLD=10、open-in-view=false、DDLは受講生が作成しvalidate検証", "01, 03, 05, 06"],
            ["D-19", "要確認", "一覧ページング要否", "現状ページングなし全件表示（拡張時Pageable導入）", "02"],
          ]
        ),
      ],
    },
  ];

  return buildWorkbookBuffer(sheets);
}

// ===========================================================================
// 4. Workbook 2: TeamOps Hub チーム開発（3人1組）詳細設計書 v1.1.0（全13シート）
// ===========================================================================
function createTeamProjectDesignSpec() {
  const sheets = [
    // Sheet 1: 00_表紙・読み方
    {
      name: "00_表紙・読み方",
      widths: [22, 48, 34, 24],
      freezeRow: 2,
      rows: [
        banner("TeamOps Hub 開発者向け詳細設計書 v1.1.0（チーム開発 3人1組・3か月）", 4),
        subheader("1. 文書管理情報", 4),
        ...tableRows(
          ["項目", "内容", "補足", "備考"],
          [
            ["システム名", "TeamOps Hub（社内備品・案件・タスク統合管理システム）", "共通ログイン1画面＋3名×3画面＝全10画面", "チーム開発3か月（12週）"],
            ["バージョン", "1.1.0（開発者向け改訂版）", "ファイル所有権・IF契約・排他制御・全39テスト・判断ログ統合", "2026-11-23 改訂"],
            ["技術スタック", "Eclipse / Java 21 / Spring Boot 3.3 / Maven（pom.xml） / Thymeleaf / Spring Security 6 / PostgreSQL 16 / GitHub", "DB名: teamops_db（全員ローカル構築）", "UTF-8 / 改行LF統一"],
            ["提出物", "各ステップごとのGitHub Pull Request URL（https://github.com/.../pull/番号）", "3名全員のPR・相互レビュー・Commit履歴必須", "IT-007 監査対象"],
          ]
        ),
        blank(4),
        subheader("2. シート構成（全13シート）", 4),
        ...tableRows(
          ["シート名", "目的", "いつ見るか", "主な読者"],
          [
            ["01_システム概要・環境", "技術スタック・Maven・機能単位パッケージ・起動手順", "環境構築・Step 2", "全員"],
            ["02_チーム分担・所有権・IF", "3名役割分担、ファイル所有権、モジュール間IF契約（スタブ）", "着手前・PR前", "全員（特にA）"],
            ["03_Git・PR運用", "ブランチ戦略、PRテンプレート、レビュー観点、コンフリクト解消", "毎日", "全員"],
            ["04_機能要件", "AUTH-01〜C-05 の入出力・受入基準(AC)", "実装前", "各担当者"],
            ["05_画面設計", "全10画面一覧・権限マトリクス・項目定義・Model属性", "Thymeleaf作成時", "各担当者"],
            ["06_URL・IF設計", "全27エンドポイント・認可・PRG・ステータス", "Controller作成時", "各担当者"],
            ["07_クラス設計", "担当別クラス署名・Entity項目・Repository主要メソッド", "Service/Repo作成時", "各担当者"],
            ["08_DB設計", "全6テーブル定義・制約・インデックス方針・初期データ・不変条件", "Step 2 / Entity作成時", "全員"],
            ["09_処理詳細", "P-A01〜P-C02 の処理手順・N+1回避・進捗率算出", "Service実装時", "各担当者"],
            ["10_状態遷移・排他", "タスク/貸出状態遷移ガード、悲観ロック(FOR UPDATE)、競合シナリオS1〜S5", "B-04, C-02〜05実装時", "B・C（全員確認）"],
            ["11_検証・セキュリティ", "Form検証・messages分割・例外→画面(403再スロー)・URL/データ認可表", "Form・Security実装時", "全員"],
            ["12_テスト仕様・計画・判断ログ", "UT(27件)＋IT-001〜012(12件)＝全39件、12週計画、設計判断ログD-01〜D-22", "実装後・結合・提出前", "全員"],
          ]
        ),
      ],
    },

    // Sheet 2: 01_システム概要・環境
    {
      name: "01_システム概要・環境",
      widths: [24, 44, 38],
      freezeRow: 2,
      rows: [
        banner("01 システム概要・開発環境（Maven / 機能単位パッケージ構成）", 3),
        subheader("1. 機能単位パッケージ構成（コンフリクト最小化：com.example.teamops）", 3),
        ...tableRows(
          ["パッケージ / リソース", "配置クラス / ファイル", "所有担当"],
          [
            ["config / common / auth / user", "SecurityConfig, LoginUser, CustomUserDetailsService, BusinessException, ResourceNotFoundException, GlobalExceptionHandler, AuthController, User, UserRepository", "共通（Step 2で確定・A窓口）"],
            ["member / dashboard", "Department, DepartmentRepository, MemberController/Service/Form, DashboardController/Service/View", "メンバーA"],
            ["project / task", "Project, ProjectController/Service/Summary, Task, TaskController/Service/Form, TaskStatus/Priority", "メンバーB"],
            ["equipment / loan", "Equipment, EquipmentController/Service, EquipmentLoan, LoanController/Service/Form, LoanStatus", "メンバーC"],
            ["messages-*.properties", "messages.properties(共通), messages-member, messages-project, messages-equipment", "担当別に分割（競合回避 D-15）"],
            ["templates / css", "layout.html, login.html, error/403,404,500.html [共通] ／ members/ [A] ／ projects/,tasks/ [B] ／ equipments/,loans/ [C]", "各担当領域のみ編集"],
          ],
          [0, 1]
        ),
        blank(3),
        subheader("2. 推奨 application.properties ＆ 初期ログインユーザー（開発用・BCrypt保存）", 3),
        ...tableRows(
          ["項目 / メール", "設定値 / パスワード・ロール", "目的・用途"],
          [
            ["spring.datasource.url", "jdbc:postgresql://localhost:5432/teamops_db", "全員同名でローカルPostgreSQL作成"],
            ["spring.jpa.hibernate.ddl-auto / open-in-view", "validate / false", "テーブル整合検証＆N+1防止"],
            ["spring.messages.basename", "messages, messages-member, messages-project, messages-equipment", "担当別メッセージファイル読込"],
            ["admin@example.com", "Passw0rd! ／ ROLE_ADMIN ／ EMP-001（開発部）", "承認・社員管理の動作確認"],
            ["user-a@example.com", "Passw0rd! ／ ROLE_USER ／ EMP-002（営業部）", "一般ユーザー・タスク担当確認"],
            ["user-b@example.com", "Passw0rd! ／ ROLE_USER ／ EMP-003（総務部）", "貸出申請者・ダッシュボード確認"],
          ],
          [0, 1]
        ),
      ],
    },

    // Sheet 3: 02_チーム分担・所有権・IF
    {
      name: "02_チーム分担・所有権・IF",
      widths: [18, 28, 36, 36],
      freezeRow: 2,
      rows: [
        banner("02 チーム役割分担・ファイル所有権・モジュール間IF契約", 4),
        subheader("1. 3名役割分担（共通ログイン＋1人3画面＝全10画面）", 4),
        ...tableRows(
          ["担当", "担当領域", "担当する3画面（＋共通）", "担当テーブル・実装ポイント"],
          [
            ["全員（Step 2協働）", "共通基盤・認証", "SCR-00 ログイン（/login）＋ 共通ヘッダー/ナビ（layout.html）", "users(認証), SecurityConfig, 例外ハンドラ"],
            ["メンバーA（リーダー）", "社員・部署管理＆ダッシュボード", "①A1 ダッシュボード ②A2 社員一覧・検索 ③A3 社員登録・編集", "departments, users(CRUD)＋IF契約でB/C集計表示"],
            ["メンバーB", "プロジェクト・タスク管理", "①B1 案件一覧 ②B2 案件詳細・タスク ③B3 タスク登録・編集", "projects, tasks＋進捗率1クエリ集計・遷移ガード"],
            ["メンバーC", "備品貸出・社内申請管理", "①C1 備品一覧 ②C2 貸出申請・返却一覧 ③C3 申請詳細・承認/返却", "equipments, equipment_loans＋悲観ロック排他制御"],
          ]
        ),
        blank(4),
        subheader("2. モジュール間インターフェース契約（Step 2で署名確定＆スタブ作成：D-03）", 4),
        ...tableRows(
          ["提供側", "公開Serviceメソッド署名", "利用側", "仕様（他担当のRepository直呼び禁止）"],
          [
            ["B TaskService", "long countOpenByAssignee(Long userId)", "A ダッシュボード", "担当者=userId かつ status≠DONE の件数"],
            ["B TaskService", "List<TaskSummary> findUpcomingByAssignee(Long userId, int limit)", "A ダッシュボード", "未完了・期限日NOT NULL を 期限昇順・id昇順で上位5件"],
            ["C LoanService", "long countByUserAndStatus(Long userId, LoanStatus status)", "A ダッシュボード", "貸出中(APPROVED)／申請中(PENDING)件数"],
            ["共通 UserRepository", "List<User> findAllByActiveTrueOrderByEmpCodeAsc()", "B 担当者プルダウン / A", "有効ユーザー(is_active=true)のみ社員番号昇順"],
            ["共通 LoginUser", "getId() / getFullName() / getDepartmentName() / getRole()", "全員", "@AuthenticationPrincipal で取得"],
          ],
          [1]
        ),
      ],
    },

    // Sheet 4: 03_Git・PR運用
    {
      name: "03_Git・PR運用",
      widths: [18, 28, 42, 26],
      freezeRow: 2,
      rows: [
        banner("03 Gitブランチ・Pull Request・レビュー・コンフリクト解消規約", 4),
        ...tableRows(
          ["ブランチ種別", "命名規則", "役割・運用ルール", "直接Push"],
          [
            ["main", "main", "提出・リリース用の安定ブランチ。developから全結合テスト後にマージ", "禁止（PRのみ）"],
            ["develop", "develop", "チーム統合ブランチ。各メンバーのfeature/fixブランチのPR先", "禁止（PRのみ）"],
            ["feature", "feature/a-member-list 等", "各機能・各画面の実装用。必ず最新developから作成（400行以内目安）", "担当本人のみ"],
            ["fix", "fix/loan-stock-bug 等", "結合テストで見つかったバグ修正用（GitHub Issue番号紐付け）", "担当本人のみ"],
          ],
          [0, 1]
        ),
        blank(4),
        subheader("毎日の開発ルーティン ＆ コンフリクト解消鉄則", 4),
        ...tableRows(
          ["タイミング", "コマンド例", "目的", "レビュー・提出チェック"],
          [
            ["1. 作業開始前", "git switch develop && git pull origin develop", "最新developを取り込む", "古いdevelopから分岐しない"],
            ["2. ブランチ作成", "git switch -c feature/b-project-list", "1機能1ブランチ", "担当外ファイルを触らない"],
            ["3. PR作成前", "git fetch && git merge origin/develop", "手元で競合解消・起動確認", "コンフリクト放置でPR出さない"],
            ["4. PRレビュー", "GitHub上で他メンバー1名以上がApprove", "設計準拠・権限・排他・テスト結果確認", "PR URL（/pull/番号）を学習画面へ提出"],
          ],
          [1]
        ),
      ],
    },

    // Sheet 5: 04_機能要件
    {
      name: "04_機能要件",
      widths: [10, 20, 28, 46],
      freezeRow: 2,
      rows: [
        banner("04 機能要件一覧（AUTH-01〜C-05・受入基準 AC つき）", 4),
        ...tableRows(
          ["機能ID", "機能名（担当）", "URL / モジュール", "受入基準（AC）"],
          [
            ["AUTH-01/02", "共通認証・ログアウト（共通）", "GET/POST /login, POST /logout", "BCrypt照合・is_active=true確認→/dashboard。誤PW/未存在/無効は同一エラー。POST /logoutでセッション破棄"],
            ["A-01", "ダッシュボード（A）", "GET /dashboard", "本人の未完了タスク数・貸出中・申請中・期限近上位5件をIF契約経由で表示（お知らせは対象外 D-05）"],
            ["A-02", "社員検索（A）", "GET /members", "部署一致＋氏名部分一致(大小無視)AND検索。USERは閲覧のみ（操作ボタン非表示）"],
            ["A-03", "社員登録・編集（A）", "GET/POST /members/new, /{id}/edit", "ADMINのみ(USERは403)。メール/社員番号重複チェック(編集時自分除外)。PW新規必須・編集空欄時不変"],
            ["A-04", "社員無効化・有効化（A）", "POST /members/{id}/deactivate, /activate", "ADMINのみ・自分自身は無効化不可。無効ユーザーはログイン不可・担当者候補から除外（履歴保持）"],
            ["B-01", "案件一覧（B）", "GET /projects", "status/keyword絞り込み。進捗率＝DONE÷全タスク×100(整数切捨・0件は0%)を1クエリ集計(N+1禁止)"],
            ["B-02", "案件詳細（B）", "GET /projects/{id}", "未存在404。タスクを期限昇順(NULL末尾)で表示し、遷移可能な次状態ボタンのみ表示"],
            ["B-03", "タスク登録・編集（B）", "GET/POST /tasks/new, /{id}/edit", "タスク名必須100字以内。担当者プルダウンは有効ユーザーのみ(IT-002)。期限過去日は警告のみ登録可(D-08)"],
            ["B-04", "タスク状態更新（B）", "POST /tasks/{id}/status", "TODO→IN_PROGRESS/DONE、IN_PROGRESS→DONE許可。不正遷移は拒否。更新後進捗率に即時反映(IT-003)"],
            ["C-01", "備品検索（C）", "GET /equipments", "カテゴリ完全一致＋備品名部分一致(大小無視)。available_qty=0は『在庫切れ』・申請ボタン無効"],
            ["C-02", "貸出申請（C）", "GET/POST /loans", "数量1以上かつ在庫以下(超過拒否IT-005)・返却予定日今日以降。PENDING登録（申請時は在庫不変）"],
            ["C-03", "貸出一覧・詳細（C）", "GET /loans, /loans/{id}", "USERは自分の申請のみ(他人の詳細直アクセスは403)、ADMINは全件。状態履歴表示(D-04)"],
            ["C-04", "承認・却下（C）", "POST /loans/{id}/approve, /reject", "ADMINのみ・PENDINGのみ。承認は悲観ロック下で在庫再確認し減算(IT-004, IT-008)"],
            ["C-05", "返却処理（C）", "POST /loans/{id}/return", "ADMINのみ(D-06)・APPROVEDのみ。在庫加算＋returned_at記録。二重返却防止"],
          ],
          [2]
        ),
      ],
    },

    // Sheet 6: 05_画面設計
    {
      name: "05_画面設計",
      widths: [10, 10, 20, 26, 12, 12, 34],
      freezeRow: 2,
      rows: [
        banner("05 画面設計（全10画面一覧・URL統一 D-01・ロール別権限マトリクス）", 7),
        ...tableRows(
          ["画面ID", "担当", "画面名", "URLパス（D-01統一）", "ADMIN", "USER", "主要表示・操作・Model属性"],
          [
            ["SCR-00", "共通", "ログイン画面", "GET /login", "可", "可", "email / password / 共通エラー表示"],
            ["SCR-A1", "A", "ダッシュボード", "GET /dashboard", "可", "可", "view(openTaskCount, activeLoanCount, pendingLoanCount, upcomingTasks)"],
            ["SCR-A2", "A", "社員一覧・検索", "GET /members", "操作可", "閲覧のみ", "members, departments, departmentId, keyword（USERボタン非表示）"],
            ["SCR-A3", "A", "社員登録・編集", "GET /members/new, /{id}/edit", "可", "403", "memberForm(empCode, fullName, email, departmentId, role, password)"],
            ["SCR-B1", "B", "案件一覧", "GET /projects", "可", "可", "projects(ProjectSummary進捗率バー), status, keyword"],
            ["SCR-B2", "B", "案件詳細・タスク", "GET /projects/{id}", "可", "可", "project, tasks, progress（次状態ワンクリック更新）"],
            ["SCR-B3", "B", "タスク登録・編集", "GET /tasks/new?projectId=, /{id}/edit", "可", "可", "taskForm, project, assignees(有効ユーザーのみ)"],
            ["SCR-C1", "C", "備品一覧・検索", "GET /equipments", "可", "可", "equipments, categories（在庫0は在庫切れ表示・申請無効）"],
            ["SCR-C2", "C", "貸出申請・一覧", "GET /loans", "全件", "自分のみ", "loanForm, requestable, loans"],
            ["SCR-C3", "C", "貸出詳細・承認", "GET /loans/{id}", "承認/返却", "自分閲覧", "loan(equipment, user, approverをJOIN FETCH)。他人申請は403"],
          ],
          [0, 3]
        ),
      ],
    },

    // Sheet 7: 06_URL・IF設計
    {
      name: "06_URL・IF設計",
      widths: [10, 26, 12, 28, 36],
      freezeRow: 2,
      rows: [
        banner("06 URL・インターフェース設計（主要エンドポイント・認可・PRG）", 5),
        ...tableRows(
          ["Method", "Path", "認可", "Controller#method", "成功 / 失敗時挙動"],
          [
            ["GET", "/ → /dashboard", "認", "AuthController#root", "302 /dashboard"],
            ["GET/POST", "/login, POST /logout", "不要/認", "AuthController / Spring Security", "成功→/dashboard、失敗→/login?error、ログアウト→/login?logout"],
            ["GET", "/dashboard", "認", "DashboardController#show", "200 dashboard.html"],
            ["GET", "/members", "認", "MemberController#list", "200 members/list.html"],
            ["GET/POST", "/members/new, /members, /members/{id}/edit, /members/{id}", "ADMIN", "MemberController", "成功→302 /members+flash / 検証NG→200 form / USER→403"],
            ["POST", "/members/{id}/deactivate, /activate", "ADMIN", "MemberController", "302 /members+flash（自分自身無効化はerrorMessage）"],
            ["GET", "/projects, /projects/{id}", "認", "ProjectController", "200 list/detail（未存在404）"],
            ["GET/POST", "/tasks/new, /tasks, /tasks/{id}/edit, /tasks/{id}", "認", "TaskController", "成功→302 /projects/{projectId}+flash / NG→200 form"],
            ["POST", "/tasks/{id}/status", "認", "TaskController#changeStatus", "302 /projects/{projectId}+flash（不正遷移はerrorMessage）"],
            ["GET", "/equipments", "認", "EquipmentController#list", "200 equipments/list.html"],
            ["GET/POST", "/loans", "認", "LoanController#list / apply", "申請成功→302 /loans+flash / 在庫超過→200 loans/list再表示"],
            ["GET", "/loans/{id}", "本人/ADMIN", "LoanController#detail", "200 loans/detail（未存在404・他人申請403）"],
            ["POST", "/loans/{id}/approve, /reject, /return", "ADMIN", "LoanController", "302 /loans/{id}+flash（状態/在庫エラー時はerrorMessage）"],
          ],
          [0, 1, 3]
        ),
      ],
    },

    // Sheet 8: 07_クラス設計
    {
      name: "07_クラス設計",
      widths: [14, 24, 34, 42],
      freezeRow: 2,
      rows: [
        banner("07 クラス・Repository設計（担当境界＆N+1/排他ロックメソッド）", 4),
        ...tableRows(
          ["担当", "クラス / Repository", "主要メソッド", "実装ポイント"],
          [
            ["共通", "CustomUserDetailsService / LoginUser", "loadUserByUsername(email)", "is_active=false は enabled=false でログイン拒否。UserRepository.findWithDepartmentByEmail"],
            ["共通", "GlobalExceptionHandler", "handleNotFound(404) / handleAccessDenied(再スロー) / handleAny(500)", "【重要 D-19】AccessDeniedExceptionを再スローしないと403が500に化ける"],
            ["メンバーA", "MemberService / DashboardService", "search, create, update, deactivate, activate / build(userId)", "DashboardServiceはIF契約(TaskService/LoanService)のみ参照（D-03）"],
            ["メンバーB", "ProjectService / TaskService", "search, calcProgress / create, update, changeStatus, countOpenByAssignee, findUpcomingByAssignee", "TaskRepository.countGroupByProject(ids) で進捗率を1クエリ集計"],
            ["メンバーC", "EquipmentService / LoanService", "search, findRequestable / apply, approve, reject, returnLoan, countByUserAndStatus", "EquipmentRepository/EquipmentLoanRepository に悲観ロック findByIdForUpdate を定義"],
            ["全員", "Entity共通ルール", "User(active), Project, Task, Equipment, EquipmentLoan, Department", "@Data禁止・@Enumerated(STRING)必須・関連はLAZY・JOIN FETCHでN+1回避"],
          ],
          [1, 2]
        ),
      ],
    },

    // Sheet 9: 08_DB設計
    {
      name: "08_DB設計",
      widths: [18, 12, 22, 26, 40],
      freezeRow: 2,
      rows: [
        banner("08 データベース設計（PostgreSQL 16・teamops_db・全6テーブル・不変条件）", 5),
        subheader("1. テーブル一覧 ＆ 制約方針", 5),
        ...tableRows(
          ["テーブル名", "担当", "主キー / 外部キー", "主要カラム・CHECK制約", "インデックス推奨【提案】"],
          [
            ["departments", "A", "id BIGSERIAL", "name VARCHAR(80) UNIQUE", "-"],
            ["users", "共通/A", "id / FK department_id", "emp_code UNIQUE, email UNIQUE, password_hash, full_name, role(ADMIN/USER), is_active", "department_id"],
            ["projects", "B", "id / FK owner_id", "name, description, status(PLANNING/ACTIVE/DONE), start_date, end_date(>=start_date)", "status"],
            ["tasks", "B", "id / FK project_id, assignee_id", "title(150), description, priority(HIGH/MEDIUM/LOW), status(TODO/IN_PROGRESS/DONE), due_date", "project_id / (assignee_id, status, due_date)"],
            ["equipments", "C", "id", "asset_code UNIQUE, name, category, total_qty>=0, available_qty(0..total_qty)", "-"],
            ["equipment_loans", "C", "id / FK equipment_id, user_id, approved_by", "quantity>0, purpose, status(PENDING/APPROVED/REJECTED/RETURNED), due_date, returned_at", "(user_id, status) / (equipment_id, status)"],
          ],
          [0, 2, 3]
        ),
        blank(5),
        subheader("2. 初期データ（部署3・備品3・案件2・タスク4・貸出1）＆ データ不変条件", 5),
        ...tableRows(
          ["対象", "管理番号 / 名称", "属性・初期値", "不変条件 / 確認用途", "備考"],
          [
            ["備品", "EQ-0001 社用ノートPC", "PC / 総数2 / 利用可能2", "IT-004（承認2→1、返却1→2）確認用", ""],
            ["備品", "EQ-0002 27インチモニター", "モニター / 総数1 / 利用可能1", "IT-005（数量2申請→在庫超過エラー）確認用", ""],
            ["備品", "EQ-0003 プロジェクター", "周辺機器 / 総数1 / 利用可能0", "在庫切れ表示確認（user-bへ1台APPROVED貸出中と整合）", ""],
            ["案件・タスク", "社内ポータル刷新 / 備品棚卸し", "タスク計4件（完了1・進行中1・未着手2）", "UT-A01・UT-B01（進捗率33%/0%）確認用", ""],
            ["在庫不変条件", "available_qty = total_qty - Σ(APPROVED数量)", "0 <= available_qty <= total_qty", "IT-011：全備品で不一致0件であることをSQL確認", "DB CHECK＋排他ロック"],
          ]
        ),
        blank(5),
        subheader("3. 参考DDL骨格（外部キー依存順：departments→users→projects→tasks / equipments→equipment_loans）", 5),
        {
          style: 5,
          height: 220,
          cells: [
            "CREATE TABLE departments (id BIGSERIAL PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE);\nCREATE TABLE users (id BIGSERIAL PRIMARY KEY, emp_code VARCHAR(20) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, full_name VARCHAR(100) NOT NULL, department_id BIGINT NOT NULL REFERENCES departments(id), role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_ADMIN','ROLE_USER')), is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE projects (id BIGSERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, description TEXT, owner_id BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT 'PLANNING' CHECK (status IN ('PLANNING','ACTIVE','DONE')), start_date DATE, end_date DATE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date));\nCREATE TABLE tasks (id BIGSERIAL PRIMARY KEY, project_id BIGINT NOT NULL REFERENCES projects(id), assignee_id BIGINT REFERENCES users(id), title VARCHAR(150) NOT NULL, description TEXT, priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH','MEDIUM','LOW')), status VARCHAR(20) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO','IN_PROGRESS','DONE')), due_date DATE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);\nCREATE TABLE equipments (id BIGSERIAL PRIMARY KEY, asset_code VARCHAR(32) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, category VARCHAR(60) NOT NULL, total_qty INTEGER NOT NULL CHECK (total_qty >= 0), available_qty INTEGER NOT NULL CHECK (available_qty >= 0 AND available_qty <= total_qty));\nCREATE TABLE equipment_loans (id BIGSERIAL PRIMARY KEY, equipment_id BIGINT NOT NULL REFERENCES equipments(id), user_id BIGINT NOT NULL REFERENCES users(id), quantity INTEGER NOT NULL CHECK (quantity > 0), purpose VARCHAR(255) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','RETURNED')), due_date DATE NOT NULL, approved_by BIGINT REFERENCES users(id), returned_at TIMESTAMP, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);",
            "", "", "", "",
          ],
        },
      ],
    },

    // Sheet 10: 09_処理詳細
    {
      name: "09_処理詳細",
      widths: [14, 18, 22, 62],
      freezeRow: 2,
      rows: [
        banner("09 処理詳細（P-A01〜P-C02：担当別Service実装手順）", 4),
        ...tableRows(
          ["処理ID", "機能", "担当", "実装手順"],
          [
            ["P-A01", "ダッシュボード", "A", "@AuthenticationPrincipalからuserId取得→@Transactional(readOnly=true)でTaskService/LoanServiceのIF契約メソッドを呼びDashboardView構築"],
            ["P-A02", "社員検索", "A", "keyword trim＋LIKEエスケープ→部署一致＆氏名部分一致(大小無視)・部署JOIN FETCH・empCode昇順"],
            ["P-A03/04", "社員登録/編集/無効化", "A", "ADMINのみ。empCode/email重複チェック(編集時自分除外)→BCryptハッシュ化(編集時空欄不変)→PRG。無効化は自分自身禁止"],
            ["P-B01", "案件一覧＆進捗率", "B", "案件一覧(owner JOIN FETCH)→TaskRepository.countGroupByProject(ids)で1クエリ集計→progress=(total==0)?0:done*100/total（整数切捨）"],
            ["P-B03", "タスク登録・編集", "B", "担当者プルダウンはis_active=trueのみ。登録時status=TODO。期限過去日は警告フラッシュのみ登録成功"],
            ["P-C02", "貸出申請", "C", "数量1以上＆利用可能在庫以下(早期チェック)＆返却予定日今日以降→PENDINGで保存（在庫は減らさない）。最終確認は承認時ロック下で実施"],
          ]
        ),
      ],
    },

    // Sheet 11: 10_状態遷移・排他
    {
      name: "10_状態遷移・排他",
      widths: [18, 28, 34, 40],
      freezeRow: 2,
      rows: [
        banner("10 状態遷移ガード ＆ 在庫排他制御（悲観ロック FOR UPDATE）", 4),
        subheader("1. タスク状態遷移（B-04：TaskStatus#canTransitionTo）", 4),
        ...tableRows(
          ["遷移元", "許可される遷移先", "不許可・ガード", "備考"],
          [
            ["TODO", "IN_PROGRESS / DONE", "TODO（同一状態）は拒否", "TODO→DONE許可（D-09）"],
            ["IN_PROGRESS", "DONE", "TODOへの差し戻しは不可", "画面は遷移可能ボタンのみ表示＋サーバ検証"],
            ["DONE", "なし（終端）", "すべて拒否（task.transition.invalid）", "進捗率は表示時再計算"],
          ]
        ),
        blank(4),
        subheader("2. 貸出状態遷移 ＆ 悲観ロック排他手順（C-04 / C-05：デッドロック・二重更新防止）", 4),
        ...tableRows(
          ["操作（実行者）", "許可ステータス", "1トランザクション内のロック＆更新手順", "ロールバック・競合対策（S1〜S5）"],
          [
            ["承認（ADMIN）", "PENDING → APPROVED", "①貸出申請をFOR UPDATE取得 → ②PENDING再確認 → ③備品をFOR UPDATE取得 → ④available_qty>=qty再確認 → ⑤在庫減算・APPROVED・approved_by設定", "S1同時承認・S2在庫1への2件同時承認を完全防御"],
            ["返却（ADMIN D-06）", "APPROVED → RETURNED", "①貸出申請をFOR UPDATE取得 → ②APPROVED再確認 → ③備品をFOR UPDATE取得 → ④在庫加算(<=total_qty)・RETURNED・returned_at設定", "S3ダブルクリック二重返却を完全防御"],
            ["却下（ADMIN）", "PENDING → REJECTED", "①貸出申請をFOR UPDATE取得 → ②PENDING再確認 → ③REJECTED・approved_by設定（備品ロック不要・在庫不変）", "BusinessException(RuntimeException)で自動ロールバック"],
            ["デッドロック防止鉄則", "全更新メソッド共通", "ロック取得順を必ず ①equipment_loans → ②equipments に統一。ControllerでcatchしService内catch禁止", "S4承認と返却の同時実行でもデッドロックしない"],
          ]
        ),
      ],
    },

    // Sheet 12: 11_検証・セキュリティ
    {
      name: "11_検証・セキュリティ",
      widths: [16, 22, 34, 42],
      freezeRow: 2,
      rows: [
        banner("11 入力検証・例外対応 ＆ セキュリティ認可マトリクス", 4),
        subheader("1. Form別主要検証ルール（messages-*.properties 担当分割）", 4),
        ...tableRows(
          ["Form（担当）", "フィールド", "チェック内容", "エラーメッセージ"],
          [
            ["MemberForm (A)", "empCode / email / password", "@Pattern(^EMP-[0-9]{3,}$)・重複 / @Email・重複 / 新規必須8〜64字", "形式・重複・8〜64文字エラー（passwordはtrimしない）"],
            ["TaskForm (B)", "title / assigneeId / priority", "@NotBlank @Size(max=100) / 有効ユーザー / @NotNull", "タスク名必須100字以内・担当者不正・優先度必須"],
            ["LoanForm (C)", "equipmentId / quantity / purpose / dueDate", "@NotNull / @Min(1)＆在庫以下 / @NotBlank @Size(max=255) / @FutureOrPresent", "在庫超過・本日以降エラー・承認時在庫不足・状態不正"],
          ],
          [0, 1]
        ),
        blank(4),
        subheader("2. URL認可マトリクス ＆ データ単位認可（D-19：403の500化防止）", 4),
        ...tableRows(
          ["URL / 対象", "ルール", "未ログイン / USER / ADMIN", "実装注意点"],
          [
            ["/login, /error, /css/**, /js/**, /images/**", "permitAll", "可 / 可 / 可", "静的資源・ログイン画面"],
            ["GET /members/new, /members/*/edit / POST /members/**", "ADMIN のみ", "→/login / 403 / 可", "IT-001 検証対象"],
            ["POST /loans/*/approve, /reject, /return", "ADMIN のみ", "→/login / 403 / 可", "UT-C19 検証対象"],
            ["GET /loans/{id}（データ単位認可）", "本人 または ADMIN", "→/login / 他人403 / 全件200", "【重要 D-19】GlobalExceptionHandlerでAccessDeniedExceptionを再スロー"],
          ],
          [0]
        ),
      ],
    },

    // Sheet 13: 12_テスト仕様・計画・判断ログ
    {
      name: "12_テスト仕様・計画・判断ログ",
      widths: [12, 16, 32, 36, 18],
      freezeRow: 2,
      rows: [
        banner("12 結合・受入テスト仕様（全39件抜粋）＆ 設計判断ログ（D-01〜D-22）", 5),
        subheader("1. 横断結合・受入テスト仕様（IT-001〜IT-012 ＋ 各担当UT-X01〜UT-C19 計39ケース）", 5),
        ...tableRows(
          ["テストID", "領域・担当", "テストシナリオ", "期待される結果", "判定/区分"],
          [
            ["IT-001", "認証→A", "一般ユーザーでログイン→/dashboard表示→/members/new直アクセス", "氏名・部署表示、/members/newは403", "未実施 / 原典"],
            ["IT-002", "A→B連携", "Aで新規社員登録→Bでタスク担当者に設定→新社員ログイン", "プルダウン表示・ダッシュボード未完了タスク+1", "未実施 / 原典"],
            ["IT-003", "B内部連携", "案件にタスク2件登録し1件をDONEへ変更", "案件一覧進捗率が 0% → 50% に自動更新", "未実施 / 原典"],
            ["IT-004", "C在庫取引", "EQ-0001(在庫2)に数量1申請→ADMIN承認→返却", "在庫2→1→2。在庫不変条件SQLが0件", "未実施 / 原典"],
            ["IT-005", "C在庫超過", "EQ-0002(在庫1)に数量2で貸出申請", "業務エラーで登録されない", "未実施 / 原典"],
            ["IT-006", "共通ナビ", "全10画面のヘッダーリンクから相互遷移", "リンク切れ・404・崩れなし", "未実施 / 原典"],
            ["IT-007", "GitHub監査", "Pull Requestsタブ・Insights/Contributors確認", "3名全員のPR・相互レビュー・Commit履歴が存在", "未実施 / 原典"],
            ["IT-008", "C同時承認", "PENDING1件をADMIN2タブで同時に承認", "片方成功・片方状態エラー・在庫減算1回のみ", "未実施 / 【提案】"],
            ["IT-009", "A→B/C無効化", "履歴ありのuser-bを無効化", "ログイン不可・担当者候補除外・過去履歴保持", "未実施 / 【提案】"],
            ["IT-010", "A↔B/C連携", "user-bで貸出申請＆タスク完了後 /dashboard確認", "申請中・未完了件数が即時反映", "未実施 / 【提案】"],
            ["IT-011", "在庫整合性", "IT-004〜008実施後に在庫不変条件SQLを実行", "不一致0件（available_qty = total - APPROVED計）", "未実施 / 【提案】"],
            ["IT-012", "権限総当たり", "未ログイン/USER/ADMINで全エンドポイント検証", "認可マトリクス通り（他人貸出詳細403が500にならない）", "未実施 / 【提案】"],
          ]
        ),
        blank(5),
        subheader("2. 主要設計判断ログ（D-01〜D-22 抜粋）", 5),
        ...tableRows(
          ["No", "区分", "内容", "本書での扱い", "影響シート"],
          [
            ["D-01", "差異修正", "URL表記ゆれ（/members/form vs /new, /edit）", "/members/new, /{id}/edit・/tasks/new, /{id}/edit に統一", "05, 06"],
            ["D-03", "提案", "ダッシュボードの他担当Repo直参照", "IF契約（TaskService / LoanService公開メソッド）経由へ変更", "02, 07"],
            ["D-06/09", "補足", "返却実行者・タスク状態遷移", "返却はADMINのみ。TODO→DONE許可・差し戻し不可", "04, 10, 12"],
            ["D-11/13", "提案/補足", "排他制御・ビルドツール", "悲観ロック(申請→備品順)・Maven（pom.xml）統一", "01, 10"],
            ["D-15/19", "提案", "競合回避・403の500化防止", "機能単位パッケージ＆messages担当分割・AccessDeniedException再スロー", "01, 02, 11"],
            ["D-20/22", "補足", "返却予定日検証・USER社員閲覧", "本日以降(@FutureOrPresent)・USERは一覧閲覧可(ボタン非表示・直URL403)", "05, 11, 12"],
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
