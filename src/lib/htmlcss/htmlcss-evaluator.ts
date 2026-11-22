/**
 * Pure TypeScript HTML & CSS Live Preview Builder and Auto-Grader
 * Works identically on client (instant Progate-style preview & test feedback)
 * and server (POST /api/problems/submit grading).
 */

export interface HtmlCssStarterSpec {
  html: string;
  css: string;
  /** Optional checks for automated grading */
  checks: HtmlCssCheckSpec[];
}

export interface HtmlCssCheckSpec {
  id: string;
  label: string;
  type:
    | "htmlTag"
    | "htmlTagMinCount"
    | "htmlAttr"
    | "htmlText"
    | "htmlRegex"
    | "cssRule"
    | "cssRegex";
  /** Target tag name (e.g. "h1", "ul", "li", "table", "form") */
  tag?: string;
  /** Minimum count for htmlTagMinCount */
  minCount?: number;
  /** Attribute name for htmlAttr (e.g. "href", "src", "type", "class") */
  attr?: string;
  /** Expected value / substring / regex pattern */
  value?: string;
  /** CSS selector substring (e.g. ".card", "nav", ".btn:hover") */
  selector?: string;
  /** CSS property name (e.g. "display", "background-color", "padding") */
  property?: string;
}

export interface HtmlCssCheckResult {
  id: string;
  label: string;
  passed: boolean;
  message: string;
}

export interface HtmlCssGradeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  checks: HtmlCssCheckResult[];
}

export function parseHtmlCssStarter(starterCode: string): HtmlCssStarterSpec | null {
  try {
    const parsed = JSON.parse(starterCode) as HtmlCssStarterSpec;
    if (parsed && typeof parsed.html === "string" && typeof parsed.css === "string") {
      return {
        html: parsed.html,
        css: parsed.css,
        checks: Array.isArray(parsed.checks) ? parsed.checks : [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function parseHtmlCssSubmission(submissionCode: string): { html: string; css: string } {
  try {
    const parsed = JSON.parse(submissionCode);
    if (parsed && typeof parsed === "object") {
      return {
        html: typeof parsed.html === "string" ? parsed.html : "",
        css: typeof parsed.css === "string" ? parsed.css : "",
      };
    }
  } catch {
    // Fallback if plain HTML was passed
  }
  return { html: submissionCode, css: "" };
}

/**
 * Builds a complete, safe standalone HTML document for <iframe srcDoc={...} sandbox="" />
 * Scripts are stripped so preview cannot execute arbitrary JS.
 */
export function buildLivePreviewHtml(html: string, css: string): string {
  const safeHtml = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const safeCss = css
    .replace(/<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Meiryo", sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
    }
    ${safeCss}
  </style>
</head>
<body>
${safeHtml}
</body>
</html>`;
}

/** Remove HTML comments & normalize whitespace for robust matching */
function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Extract CSS rule blocks matching a selector substring (supports @media nesting) */
function findCssPropertyInSelector(css: string, selectorSub: string, property: string, expectedVal?: string): boolean {
  const cleaned = stripCssComments(css);
  // Match leaf blocks: selector { declarations }
  const blockRegex = /([^{}@]+)\{([^{}]+)\}/g;
  const selNeedle = selectorSub.trim().toLowerCase().replace(/\s+/g, " ");
  const propNeedle = property.trim().toLowerCase();
  const valNeedle = expectedVal ? expectedVal.trim().toLowerCase() : null;

  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(cleaned)) !== null) {
    const rawSelector = match[1].trim().toLowerCase().replace(/\s+/g, " ");
    const declarations = match[2];

    const selectors = rawSelector.split(",").map((s) => s.trim());
    const selectorMatched =
      selectors.some((s) => s === selNeedle || s.includes(selNeedle)) || rawSelector.includes(selNeedle);

    if (!selectorMatched) continue;

    const declList = declarations.split(";").map((d) => d.trim()).filter(Boolean);
    for (const decl of declList) {
      const colonIdx = decl.indexOf(":");
      if (colonIdx === -1) continue;
      const pName = decl.slice(0, colonIdx).trim().toLowerCase();
      const pVal = decl.slice(colonIdx + 1).trim().toLowerCase().replace(/\s+/g, " ");
      if (pName === propNeedle) {
        if (!valNeedle) return true;
        if (pVal.includes(valNeedle)) return true;
      }
    }
  }
  return false;
}

export function evaluateHtmlCssSubmission(
  starterCodeJson: string,
  userSubmissionJson: string
): HtmlCssGradeResult {
  const spec = parseHtmlCssStarter(starterCodeJson);
  if (!spec || spec.checks.length === 0) {
    return { passed: false, passedCount: 0, totalCount: 0, checks: [] };
  }

  const { html, css } = parseHtmlCssSubmission(userSubmissionJson);
  const cleanHtml = stripHtmlComments(html);
  const cleanCss = stripCssComments(css);

  const checks: HtmlCssCheckResult[] = spec.checks.map((chk) => {
    let passed = false;

    switch (chk.type) {
      case "htmlTag": {
        const tag = (chk.tag || "").trim();
        const re = new RegExp(`<${tag}(?:\\s[^>]*)?>`, "i");
        passed = re.test(cleanHtml);
        break;
      }
      case "htmlTagMinCount": {
        const tag = (chk.tag || "").trim();
        const min = chk.minCount ?? 1;
        const re = new RegExp(`<${tag}(?:\\s[^>]*)?>`, "gi");
        const matches = cleanHtml.match(re) ?? [];
        passed = matches.length >= min;
        break;
      }
      case "htmlAttr": {
        const tag = (chk.tag || "[a-z0-9-]+").trim();
        const attr = (chk.attr || "").trim();
        const val = chk.value;
        const tagRe = new RegExp(`<${tag}\\s+([^>]+)>`, "gi");
        let m: RegExpExecArray | null;
        while ((m = tagRe.exec(cleanHtml)) !== null) {
          const attrs = m[1];
          const attrRe = new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
          const am = attrRe.exec(attrs);
          if (am) {
            const actualVal = (am[1] ?? am[2] ?? am[3] ?? "").trim();
            if (!val || actualVal.toLowerCase().includes(val.toLowerCase())) {
              passed = true;
              break;
            }
          }
        }
        break;
      }
      case "htmlText": {
        const textOnly = cleanHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
        passed = Boolean(chk.value && textOnly.includes(chk.value));
        break;
      }
      case "htmlRegex": {
        if (chk.value) {
          passed = new RegExp(chk.value, "i").test(cleanHtml);
        }
        break;
      }
      case "cssRule": {
        if (chk.selector && chk.property) {
          passed = findCssPropertyInSelector(cleanCss, chk.selector, chk.property, chk.value);
        }
        break;
      }
      case "cssRegex": {
        if (chk.value) {
          passed = new RegExp(chk.value, "i").test(cleanCss);
        }
        break;
      }
    }

    return {
      id: chk.id,
      label: chk.label,
      passed,
      message: passed ? "OK" : `条件未達：${chk.label}`,
    };
  });

  const passedCount = checks.filter((c) => c.passed).length;
  return {
    passed: passedCount === checks.length && checks.length > 0,
    passedCount,
    totalCount: checks.length,
    checks,
  };
}
