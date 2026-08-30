import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePracticeSession } from "../../context/PracticeSessionContext.jsx";
import Button from "../shared/Button.jsx";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { answerKeyWords, currentIndex, resetSession } = usePracticeSession();
  const [helpOpen, setHelpOpen] = useState(false);

  const practiceInProgress = location.pathname === "/practice" && currentIndex < answerKeyWords.length;

  function goHome() {
    if (practiceInProgress) {
      const confirmed = window.confirm("התרגול באמצע - האם לחזור לבית ולאבד את ההתקדמות?");
      if (!confirmed) return;
    }
    resetSession();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={goHome}>
        <span className={styles.logo}>נ</span>
        <span>תרגול ניקוד</span>
      </button>
      <button type="button" className={styles.helpLink} onClick={() => setHelpOpen(true)}>
        עזרה
      </button>

      {helpOpen && (
        <div className={styles.modalOverlay} onClick={() => setHelpOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2>איך זה עובד</h2>
            <p>
              בחרו טקסט מנוקד מוכן (תהלים או תורה) או הדביקו קטע משלכם, ולחצו "התחל". בכל שלב תוצג מילה אחת ללא
              ניקוד - בחרו אות ואז לחצו על סימן הניקוד המתאים לה מהפלטה. בלחיצה על "בדוק" תקבלו ציון על המילה לפי
              אחוז התווים שניקדתם נכון, ותוכלו לראות איפה טעיתם. בסוף התרגול יוצג הציון הכולל.
            </p>
            <p>
              אם הטקסט שהודבק לא היה מנוקד כלל, האפליקציה משתמשת בנקדן אוטומטי כדי לקבוע את הניקוד הנכון להשוואה.
            </p>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setHelpOpen(false)}>
                הבנתי
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
