import express from "express";
import cors from "cors";
import sourcesRoutes from "./routes/sources.routes.js";
import sefariaRoutes from "./routes/sefaria.routes.js";
import nakdanRoutes from "./routes/nakdan.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/sources", sourcesRoutes);
app.use("/api/sefaria", sefariaRoutes);
app.use("/api/nakdan", nakdanRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "הנתיב לא נמצא" } });
});

app.use(errorHandler);

export default app;
