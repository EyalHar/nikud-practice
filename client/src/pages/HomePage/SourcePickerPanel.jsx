import { useEffect, useState } from "react";
import { getSefariaChapter } from "../../api/client.js";
import { stripToBareLetters } from "../../utils/niqqud.js";
import { tokenizeToWords } from "../../utils/wordTokenizer.js";
import { useSefariaSources } from "../../hooks/useSefariaSources.js";
import Button from "../../components/shared/Button.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import ErrorBanner from "../../components/shared/ErrorBanner.jsx";
import TextPreview from "./TextPreview.jsx";
import styles from "./HomePage.module.css";

export default function SourcePickerPanel({ onReady }) {
  const { sources, loading: sourcesLoading, error: sourcesError } = useSefariaSources();
  const [bookType, setBookType] = useState("tehillim");
  const [torahBookKey, setTorahBookKey] = useState("");
  const [chapter, setChapter] = useState(1);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    if (sources?.torah?.length && !torahBookKey) {
      setTorahBookKey(sources.torah[0].key);
    }
  }, [sources, torahBookKey]);

  useEffect(() => {
    setPreview(null);
    setChapter(1);
  }, [bookType, torahBookKey]);

  const selectedBook =
    bookType === "tehillim" ? sources?.tehillim : sources?.torah?.find((b) => b.key === torahBookKey);

  async function loadPreview() {
    if (!selectedBook) return;
    setPreviewLoading(true);
    setPreviewError("");
    setPreview(null);
    try {
      const data = await getSefariaChapter(selectedBook.key, chapter);
      setPreview(data);
    } catch (err) {
      setPreviewError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  }

  function handleStart() {
    if (!preview) return;
    const words = tokenizeToWords(preview.text).map((word) => ({
      bare: stripToBareLetters(word),
      niqqud: word,
    }));
    onReady(words, preview.heRef, true);
  }

  if (sourcesLoading) return <Spinner label="טוען רשימת מקורות..." />;
  if (sourcesError) return <ErrorBanner message={sourcesError} />;

  return (
    <div className={styles.panel}>
      <div className={styles.bookTypeRow}>
        <button
          type="button"
          className={bookType === "tehillim" ? styles.bookTypeActive : styles.bookType}
          onClick={() => setBookType("tehillim")}
        >
          תהלים
        </button>
        <button
          type="button"
          className={bookType === "torah" ? styles.bookTypeActive : styles.bookType}
          onClick={() => setBookType("torah")}
        >
          תורה
        </button>
      </div>

      <div className={styles.selectRow}>
        {bookType === "torah" && (
          <select className={styles.select} value={torahBookKey} onChange={(e) => setTorahBookKey(e.target.value)}>
            {sources.torah.map((book) => (
              <option key={book.key} value={book.key}>
                {book.label}
              </option>
            ))}
          </select>
        )}
        <select className={styles.select} value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>
          {Array.from({ length: selectedBook?.chapters ?? 0 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              פרק {num}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={loadPreview} disabled={previewLoading}>
          {previewLoading ? <Spinner label="טוען..." /> : "טען תצוגה מקדימה"}
        </Button>
      </div>

      {previewError && <ErrorBanner message={previewError} />}
      {preview && <TextPreview heRef={preview.heRef} text={preview.text} />}

      <div className={styles.actions}>
        <Button onClick={handleStart} disabled={!preview}>
          התחל
        </Button>
      </div>
    </div>
  );
}
