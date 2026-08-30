import styles from "./HomePage.module.css";

export default function TextPreview({ heRef, text }) {
  const preview = text.length > 220 ? `${text.slice(0, 220)}…` : text;
  return (
    <div className={styles.preview}>
      <div className={styles.previewRef}>{heRef}</div>
      <p className={styles.previewText}>{preview}</p>
    </div>
  );
}
