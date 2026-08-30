import { useCallback, useState } from "react";
import { postNakdanAnalyze } from "../api/client.js";

export function useNakdanAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (text) => {
    setLoading(true);
    setError("");
    try {
      const data = await postNakdanAnalyze(text);
      return data.answerKeyWords;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}
