import { computeRunningAverage } from "../../context/PracticeSessionContext.jsx";
import styles from "./ProgressBar.module.css";

export default function ProgressBar({ currentIndex, total, userAnswers }) {
  const answeredCount = userAnswers.filter(Boolean).length;
  const average = computeRunningAverage(userAnswers);
  const percent = total > 0 ? (Math.min(currentIndex, total) / total) * 100 : 0;

  return (
    <div className={styles.bar}>
      <span>
        מילה {Math.min(currentIndex + 1, total)} מתוך {total}
      </span>
      <span className={styles.track}>
        <span className={styles.fill} style={{ width: `${percent}%` }} />
      </span>
      <span className={styles.average}>{answeredCount > 0 ? `ממוצע: ${average}%` : ""}</span>
    </div>
  );
}
