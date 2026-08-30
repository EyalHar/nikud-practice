import styles from "./WordBreakdownRow.module.css";

export default function WordBreakdownRow({ index, expectedWord, enteredWord, score }) {
  return (
    <div className={styles.row}>
      <span className={styles.index}>{index + 1}</span>
      <span className={styles.words}>
        <span>{expectedWord}</span>
        {score < 100 && <span className={styles.entered}>שהוזן: {enteredWord}</span>}
      </span>
      <span className={`${styles.score} ${score === 100 ? styles.good : styles.bad}`}>{score}%</span>
    </div>
  );
}
