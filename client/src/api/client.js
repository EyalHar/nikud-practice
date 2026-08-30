async function request(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new Error("לא ניתן להתחבר לשרת. ודא שהשרת פועל ונסה שוב.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error?.message || "אירעה שגיאה בבקשה לשרת");
  }
  return data;
}

export function getSources() {
  return request("/api/sources");
}

export function getSefariaChapter(bookKey, chapter) {
  return request(`/api/sefaria/text/${encodeURIComponent(bookKey)}/${chapter}`);
}

export function postNakdanAnalyze(text) {
  return request("/api/nakdan/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
