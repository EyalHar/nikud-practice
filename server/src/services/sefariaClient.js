import { cacheGet, cacheSet } from "../utils/cache.js";

const SEFARIA_BASE_URL = process.env.SEFARIA_BASE_URL || "https://www.sefaria.org/api";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10000;

const HTML_ENTITY_MAP = {
  "&thinsp;": " ",
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function stripHtml(raw) {
  const withoutTags = raw.replace(/<[^>]+>/g, "");
  return withoutTags.replace(/&[a-z#0-9]+;/gi, (entity) => HTML_ENTITY_MAP[entity] ?? " ");
}

export async function fetchChapterText(bookKey, chapter) {
  const cacheKey = `sefaria:${bookKey}.${chapter}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = `${SEFARIA_BASE_URL}/v3/texts/${encodeURIComponent(bookKey)}.${chapter}?version=hebrew`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    throw Object.assign(new Error("שירות המקורות (ספריא) אינו זמין כרגע"), { status: 502, cause: err });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw Object.assign(new Error(`לא נמצא טקסט עבור ${bookKey} ${chapter}`), { status: response.status === 404 ? 404 : 502 });
  }

  const data = await response.json();
  const version = data.versions?.find((v) => v.language === "he") ?? data.versions?.[0];
  const verses = Array.isArray(version?.text) ? version.text : [];
  if (verses.length === 0) {
    throw Object.assign(new Error(`לא נמצא טקסט עבור ${bookKey} ${chapter}`), { status: 404 });
  }

  const cleanVerses = verses.map((v) => stripHtml(String(v)).replace(/\s+/g, " ").trim()).filter(Boolean);
  const result = {
    ref: data.ref,
    heRef: data.heRef,
    text: cleanVerses.join(" "),
    verseCount: cleanVerses.length,
  };

  cacheSet(cacheKey, result, CACHE_TTL_MS);
  return result;
}
