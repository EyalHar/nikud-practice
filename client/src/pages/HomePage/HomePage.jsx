import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePracticeSession } from "../../context/PracticeSessionContext.jsx";
import CreditFooter from "../../components/shared/CreditFooter.jsx";
import PasteTextPanel from "./PasteTextPanel.jsx";
import SourcePickerPanel from "./SourcePickerPanel.jsx";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { startSession } = usePracticeSession();
  const [mode, setMode] = useState("source");

  function handleReady(answerKeyWords, sourceLabel, hadNiqqudInSource) {
    startSession(answerKeyWords, sourceLabel, hadNiqqudInSource);
    navigate("/practice");
  }

  return (
    <div className="page">
      <h1 className={styles.title}>תרגול ניקוד</h1>
      <p className={styles.subtitle}>בחרו טקסט מוכן או הדביקו קטע משלכם, ותרגלו ניקוד מילה אחר מילה</p>

      <div className={styles.modeTabs}>
        <button
          type="button"
          className={mode === "source" ? styles.modeTabActive : styles.modeTab}
          onClick={() => setMode("source")}
        >
          בחירת מקור
        </button>
        <button
          type="button"
          className={mode === "paste" ? styles.modeTabActive : styles.modeTab}
          onClick={() => setMode("paste")}
        >
          הדבקת טקסט
        </button>
      </div>

      <div className={styles.card}>
        {mode === "source" ? <SourcePickerPanel onReady={handleReady} /> : <PasteTextPanel onReady={handleReady} />}
      </div>

      <CreditFooter />
    </div>
  );
}
