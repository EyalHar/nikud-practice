import { Router } from "express";
import { getChapterText } from "../controllers/sefaria.controller.js";

const router = Router();

router.get("/text/:book/:chapter", getChapterText);

export default router;
