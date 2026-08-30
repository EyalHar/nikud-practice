import styles from "./Spinner.module.css";

export default function Spinner({ label }) {
  return (
    <span role="status" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span className={styles.spinner} aria-hidden="true" />
      {label && <span>{label}</span>}
    </span>
  );
}
