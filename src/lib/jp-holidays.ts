/**
 * ファイル概要：
 * 日本の国民の祝日・振替休日・国民の休日判定および
 * 「週の初回営業日（月曜が祝日なら火曜、連休なら次の平日）」判定ユーティリティ
 */

export interface JstDateParts {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  dayOfWeek: number; // 0=日, 1=月, ..., 6=土
  ymd: string; // YYYY-MM-DD
}

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** 任意の Date を JST（UTC+9）基準の年月日・曜日に変換する */
export function getJstDateParts(date: Date = new Date()): JstDateParts {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  const year = jst.getUTCFullYear();
  const month = jst.getUTCMonth() + 1;
  const day = jst.getUTCDate();
  const dayOfWeek = jst.getUTCDay();
  return {
    year,
    month,
    day,
    dayOfWeek,
    ymd: formatYmd(year, month, day),
  };
}

/** 指定年月の第N月曜日の日付（day）を返す */
function nthMonday(year: number, month: number, nth: number): number {
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const firstMonday = 1 + ((1 - firstDow + 7) % 7);
  return firstMonday + (nth - 1) * 7;
}

/** 春分の日（1980〜2099年対応の略算式） */
function vernalEquinoxDay(year: number): number {
  return Math.floor(
    20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  );
}

/** 秋分の日（1980〜2099年対応の略算式） */
function autumnalEquinoxDay(year: number): number {
  return Math.floor(
    23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  );
}

function addDaysUtc(year: number, month: number, day: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1, day + delta));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    dayOfWeek: d.getUTCDay(),
    ymd: formatYmd(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()),
  };
}

/**
 * 指定年の日本の祝日一覧（YYYY-MM-DD -> 祝日名）を返す
 * 国民の祝日・振替休日・国民の休日（祝日に挟まれた平日）を網羅
 */
export function getJapaneseHolidays(year: number): Map<string, string> {
  const base = new Map<string, string>();
  const add = (m: number, d: number, name: string) => {
    base.set(formatYmd(year, m, d), name);
  };

  // 固定祝日
  add(1, 1, "元日");
  add(2, 11, "建国記念の日");
  add(2, 23, "天皇誕生日");
  add(4, 29, "昭和の日");
  add(5, 3, "憲法記念日");
  add(5, 4, "みどりの日");
  add(5, 5, "こどもの日");
  add(8, 11, "山の日");
  add(11, 3, "文化の日");
  add(11, 23, "勤労感謝の日");

  // ハッピーマンデー
  add(1, nthMonday(year, 1, 2), "成人の日");
  add(7, nthMonday(year, 7, 3), "海の日");
  add(9, nthMonday(year, 9, 3), "敬老の日");
  add(10, nthMonday(year, 10, 2), "スポーツの日");

  // 春分・秋分
  add(3, vernalEquinoxDay(year), "春分の日");
  add(9, autumnalEquinoxDay(year), "秋分の日");

  const result = new Map(base);

  // 国民の休日：前日と翌日がともに国民の祝日である平日（例：2026-09-22）
  for (let m = 1; m <= 12; m++) {
    const daysInMonth = new Date(Date.UTC(year, m, 0)).getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = formatYmd(year, m, d);
      if (result.has(ymd)) continue;
      const dow = new Date(Date.UTC(year, m - 1, d)).getUTCDay();
      if (dow === 0 || dow === 6) continue;
      const prev = addDaysUtc(year, m, d, -1);
      const next = addDaysUtc(year, m, d, 1);
      if (base.has(prev.ymd) && base.has(next.ymd)) {
        result.set(ymd, "国民の休日");
      }
    }
  }

  // 振替休日：国民の祝日が日曜に当たる場合、その日後において最も近い国民の祝日でない日
  for (const [ymd] of base) {
    const [y, m, d] = ymd.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    if (dow === 0) {
      let offset = 1;
      while (true) {
        const cand = addDaysUtc(y, m, d, offset);
        if (!result.has(cand.ymd)) {
          if (cand.year === year) {
            result.set(cand.ymd, "振替休日");
          }
          break;
        }
        offset++;
      }
    }
  }

  return result;
}

export function getJapaneseHolidayName(
  year: number,
  month: number,
  day: number
): string | null {
  return getJapaneseHolidays(year).get(formatYmd(year, month, day)) ?? null;
}

/**
 * 指定日時（JST）が「今週（月〜金）の最初の営業日（非祝日）」かを判定する
 * - 通常週：月曜日のみ true
 * - 月曜が祝日：月曜 false → 火曜 true → 水〜金 false
 * - 月・火が連休（GW・SW等）：水曜（または最初の平日）のみ true
 */
export function isFirstBusinessDayOfWeekJst(date: Date = new Date()): {
  shouldRun: boolean;
  jstDate: string;
  reason: string;
} {
  const { year, month, day, dayOfWeek, ymd } = getJstDateParts(date);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      shouldRun: false,
      jstDate: ymd,
      reason: "土日のため配信スキップ",
    };
  }

  const todayHoliday = getJapaneseHolidayName(year, month, day);
  if (todayHoliday) {
    return {
      shouldRun: false,
      jstDate: ymd,
      reason: `祝日（${todayHoliday}）のため翌営業日へスライド`,
    };
  }

  // 今週の月曜（dayOfWeek=1）から昨日（dayOfWeek-1）までの間に営業日が1日でもあれば今日はスキップ
  const daysSinceMonday = dayOfWeek - 1;
  for (let back = daysSinceMonday; back >= 1; back--) {
    const earlier = addDaysUtc(year, month, day, -back);
    const holidayName = getJapaneseHolidayName(
      earlier.year,
      earlier.month,
      earlier.day
    );
    if (!holidayName) {
      return {
        shouldRun: false,
        jstDate: ymd,
        reason: `今週の初回営業日（${earlier.ymd}）に配信済みのためスキップ`,
      };
    }
  }

  return {
    shouldRun: true,
    jstDate: ymd,
    reason:
      daysSinceMonday === 0
        ? "毎週月曜 09:00 JST の定期配信を実行"
        : "祝日スライド後の今週初回営業日 09:00 JST の定期配信を実行",
  };
}
