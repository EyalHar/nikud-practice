const DICTA_BASE_URL = process.env.DICTA_BASE_URL || "https://nakdan-u1-0.loadbalancer.dicta.org.il/api";
const FETCH_TIMEOUT_MS = 15000;

const NIQQUD_PATTERN = /[֑-ׇ]/g;

function stripNiqqud(text) {
  return text.replace(NIQQUD_PATTERN, "");
}

export async function analyzeText(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(DICTA_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        task: "nakdan",
        genre: "modern",
        data: text,
        addmorph: true,
        keepqq: false,
        keepmetagim: true,
        patachma: false,
        nodageshdefmem: false,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    throw Object.assign(new Error("שירות הניקוד האוטומטי (נקדן דיקטא) אינו זמין כרגע"), { status: 502, cause: err });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw Object.assign(new Error("שירות הניקוד האוטומטי החזיר שגיאה"), { status: 502 });
  }

  const items = await response.json();
  if (!Array.isArray(items)) {
    throw Object.assign(new Error("תגובה לא תקינה משירות הניקוד האוטומטי"), { status: 502 });
  }

  const answerKeyWords = items
    .filter((item) => !item.sep && item.word && item.word.trim())
    .map((item) => {
      const topOption = item.options?.[0]?.[0];
      return {
        bare: stripNiqqud(item.word),
        niqqud: topOption || item.word,
      };
    });

  return answerKeyWords;
}
