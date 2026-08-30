import styles from "./CreditFooter.module.css";

export default function CreditFooter({ showNakdanCredit = true }) {
  return (
    <p className={styles.credit}>
      טקסטים באדיבות{" "}
      <a href="https://www.sefaria.org" target="_blank" rel="noreferrer">
        ספריא (Sefaria)
      </a>
      {showNakdanCredit && (
        <>
          {" · ניקוד אוטומטי באמצעות "}
          <a href="https://nakdan.dicta.org.il" target="_blank" rel="noreferrer">
            נקדן דיקטא (Dicta)
          </a>
        </>
      )}
    </p>
  );
}
