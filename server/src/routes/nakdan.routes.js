import { Router } from "express";
import rateLimit from "express-rate-limit";
import { postAnalyze } from "../controllers/nakdan.controller.js";

const nakdanLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "יותר מדי בקשות ניקוד, נסה שוב בעוד דקה" } },
});

const router = Router();

router.post("/analyze", nakdanLimiter, postAnalyze);

export default router;
