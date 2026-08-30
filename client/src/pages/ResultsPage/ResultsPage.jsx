import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePracticeSession, computeRunningAverage } from "../../context/PracticeSessionContext.jsx";
import Button from "../../components/shared/Button.jsx";
import CreditFooter from "../../components/shared/CreditFooter.jsx";
import WordBreakdownRow from "./WordBreakdownRow.jsx";
import styles from "./ResultsPage.module.css";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { answerKeyWords, userAnswers, meta, resetSession } = usePracticeSession();

  useEffect(() => {
    if (answerKeyWords.length === 0) {
      navigate("/", { replace: true });
    }
  }, [answerKeyWords.length, navigate]);

  if (answerKeyWords.length === 0) return null;

  const finalScore = computeRunningAverage(userAnswers);

  function handleRestart() {
    resetSession();
    navigate("/");
  }

  return (
    <div className="page">
      <div className={styles.headline}>
        <div className={styles.sourceLabel}>{meta.sourceLabel}</div>
        <div className={styles.scoreValue}>{finalScore}%</div>
        <div>הציון הסופי שלכם</div>
      </div>

      <div className={styles.list}>
        {answerKeyWords.map((word, i) => {
          const answer = userAnswers[i];
          return (
            <WordBreakdownRow
              key={i}
              index={i}
              expectedWord={word.niqqud}
              enteredWord={answer?.enteredWord ?? ""}
              score={answer?.score ?? 0}
            />
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button onClick={handleRestart}>התחלה מחדש</Button>
      </div>

      <CreditFooter showNakdanCredit={!meta.hadNiqqudInSource} />
    </div>
  );
}
