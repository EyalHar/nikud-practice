import styles from "./Button.module.css";

export default function Button({ variant = "primary", className = "", ...props }) {
  const variantClass = styles[variant] ?? styles.primary;
  return <button className={`${styles.button} ${variantClass} ${className}`} {...props} />;
}
