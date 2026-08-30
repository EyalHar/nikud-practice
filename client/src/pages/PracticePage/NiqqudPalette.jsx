import { NIQQUD_SECTIONS } from "../../constants/niqqudMarks.js";
import styles from "./NiqqudPalette.module.css";

export default function NiqqudPalette({ selectedBase, activeMarks, onApply }) {
  const noLetterSelected = !selectedBase;

  return (
    <div className={styles.palette}>
      {noLetterSelected && <p className={styles.hint}>בחרו אות במילה כדי להוסיף לה ניקוד</p>}
      {NIQQUD_SECTIONS.map((section) => (
        <div key={section.id} className={styles.section}>
          <div className={styles.sectionLabel}>{section.label}</div>
          <div className={styles.buttonRow}>
            {section.marks.map((mark) => {
              const restricted = mark.restrictToLetter && selectedBase !== mark.restrictToLetter;
              const isActive = activeMarks.has(mark.char);
              return (
                <button
                  key={mark.id}
                  type="button"
                  className={`${styles.markButton} ${isActive ? styles.active : ""}`}
                  disabled={noLetterSelected || restricted}
                  onClick={() => onApply(mark)}
                  title={mark.hint || mark.label}
                >
                  <span className={styles.markGlyph}>{"א" + mark.char}</span>
                  <span className={styles.markLabel}>{mark.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
