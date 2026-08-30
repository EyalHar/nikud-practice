import { fetchChapterText } from "../services/sefariaClient.js";

export async function getChapterText(req, res, next) {
  try {
    const { book, chapter } = req.params;
    const chapterNum = Number(chapter);
    if (!book || !Number.isInteger(chapterNum) || chapterNum < 1) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "ספר או מספר פרק לא תקינים" } });
    }
    const result = await fetchChapterText(book, chapterNum);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
