import { useEffect, useState } from "react";
import { getSources } from "../api/client.js";

export function useSefariaSources() {
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSources()
      .then((data) => {
        if (!cancelled) setSources(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { sources, loading, error };
}
