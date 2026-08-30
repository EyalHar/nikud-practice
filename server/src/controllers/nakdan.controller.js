import { analyzeText } from "../services/nakdanClient.js";

export async function postAnalyze(req, res, next) {
  try {
    const { text } = req.body ?? {};
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "לא נשלח טקסט לניקוד" } });
    }
    if (text.length > 20000) {
      return res.status(400).json({ error: { code: "TEXT_TOO_LONG", message: "הטקסט ארוך מדי" } });
    }
    const answerKeyWords = await analyzeText(text);
    res.json({ answerKeyWords });
  } catch (err) {
    next(err);
  }
}
