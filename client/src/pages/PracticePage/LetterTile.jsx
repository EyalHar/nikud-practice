import styles from "./LetterTile.module.css";

export default function LetterTile({ base, marks, isSelected, status, expectedGlyph, onClick }) {
  const glyph = base + marks.join("");
  const statusClass = status === "correct" ? styles.correct : status === "incorrect" ? styles.incorrect : "";

  return (
    <span className={styles.tile}>
      <button
        type="button"
        className={`${styles.glyph} ${isSelected ? styles.selected : ""} ${statusClass}`}
        onClick={onClick}
        aria-pressed={isSelected}
        aria-label={`אות ${base}`}
      >
        {glyph}
      </button>
      {status === "incorrect" && expectedGlyph && <span className={styles.expectedHint}>{expectedGlyph}</span>}
    </span>
  );
}
