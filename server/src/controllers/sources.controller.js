import { getSourceCatalog } from "../data/sourceCatalog.js";

export function getSources(req, res) {
  res.json(getSourceCatalog());
}
