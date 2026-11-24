import { describe, it, expect } from "vitest";
import {
  getJapaneseHolidayName,
  isFirstBusinessDayOfWeekJst,
} from "@/lib/jp-holidays";

function jstMorning(ymd: string): Date {
  // YYYY-MM-DD 09:00:00 JST = UTC 00:00:00
  return new Date(`${ymd}T09:00:00+09:00`);
}

describe("日本の祝日判定・毎週初回営業日（09:00 JST 祝日スライド）UT", () => {
  it("通常週は月曜のみ配信し、火〜金はスキップする", () => {
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-11-30")).shouldRun).toBe(true); // 月
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-12-01")).shouldRun).toBe(false); // 火
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-12-04")).shouldRun).toBe(false); // 金
  });

  it("月曜が祝日（2026-11-23 勤労感謝の日）の場合は月曜スキップ→火曜配信→水曜スキップになる", () => {
    expect(getJapaneseHolidayName(2026, 11, 23)).toBe("勤労感謝の日");
    const mon = isFirstBusinessDayOfWeekJst(jstMorning("2026-11-23"));
    const tue = isFirstBusinessDayOfWeekJst(jstMorning("2026-11-24"));
    const wed = isFirstBusinessDayOfWeekJst(jstMorning("2026-11-25"));
    expect(mon.shouldRun).toBe(false);
    expect(mon.reason).toContain("勤労感謝の日");
    expect(tue.shouldRun).toBe(true);
    expect(wed.shouldRun).toBe(false);
  });

  it("GW連休（2026-05-04月〜05-06水 振替休日）は木曜（05-07）に自動スライドする", () => {
    expect(getJapaneseHolidayName(2026, 5, 3)).toBe("憲法記念日");
    expect(getJapaneseHolidayName(2026, 5, 4)).toBe("みどりの日");
    expect(getJapaneseHolidayName(2026, 5, 5)).toBe("こどもの日");
    expect(getJapaneseHolidayName(2026, 5, 6)).toBe("振替休日");

    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-05-04")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-05-05")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-05-06")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-05-07")).shouldRun).toBe(true);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-05-08")).shouldRun).toBe(false);
  });

  it("シルバーウィーク国民の休日（2026-09-21敬老〜09-22国民の休日〜09-23秋分）は木曜（09-24）に配信する", () => {
    expect(getJapaneseHolidayName(2026, 9, 21)).toBe("敬老の日");
    expect(getJapaneseHolidayName(2026, 9, 22)).toBe("国民の休日");
    expect(getJapaneseHolidayName(2026, 9, 23)).toBe("秋分の日");

    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-09-21")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-09-22")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-09-23")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-09-24")).shouldRun).toBe(true);
  });

  it("土日は常にスキップする", () => {
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-11-28")).shouldRun).toBe(false);
    expect(isFirstBusinessDayOfWeekJst(jstMorning("2026-11-29")).shouldRun).toBe(false);
  });
});
