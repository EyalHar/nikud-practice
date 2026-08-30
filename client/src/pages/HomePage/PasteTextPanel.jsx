import { useMemo, useState } from "react";
import { hasNiqqud, stripToBareLetters } from "../../utils/niqqud.js";
import { tokenizeToWords } from "../../utils/wordTokenizer.js";
import { useNakdanAnalyze } from "../../hooks/useNakdanAnalyze.js";
import Button from "../../components/shared/Button.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import ErrorBanner from "../../components/shared/ErrorBanner.jsx";
import styles from "./HomePage.module.css";

export default function PasteTextPanel({ onReady }) {
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState("");
  const { analyze, loading, error } = useNakdanAnalyze();

  const textHasNiqqud = useMemo(() => hasNiqqud(text), [text]);

  async function handleStart() {
    setLocalError("");
    if (!text.trim()) {
      setLocalError("יש להדביק טקסט לפני שמתחילים");
      return;
    }

    if (textHasNiqqud) {
      const words = tokenizeToWords(text).map((word) => ({
        bare: stripToBareLetters(word),
        niqqud: word,
      }));
      if (words.length === 0) {
        setLocalError("לא נמצא טקסט עברי בקטע שהודבק");
        return;
      }
      onReady(words, "טקסט מודבק", true);
      return;
    }

    const words = await analyze(text);
    if (words && words.length > 0) {
      onReady(words, "טקסט מודבק (נוקד אוטומטית)", false);
    } else if (words) {
      setLocalError("לא נמצא טקסט עברי בקטע שהודבק");
    }
  }

  return (
    <div className={styles.panel}>
      <textarea
        className={styles.textarea}
        placeholder="הדביקו כאן קטע בעברית, מנוקד או לא מנוקד..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      {text.trim() && (
        <p className={styles.niqqudHint}>
          {textHasNiqqud ? "✓ הטקסט מנוקד - ישמש כפי שהוא" : "הטקסט אינו מנוקד - ינוקד אוטומטית לפני שנתחיל"}
        </p>
      )}
      {(localError || error) && <ErrorBanner message={localError || error} />}
      <div className={styles.actions}>
        <Button onClick={handleStart} disabled={loading}>
          {loading ? <Spinner label="מנקד את הטקסט..." /> : "התחל"}
        </Button>
      </div>
    </div>
  );
}
