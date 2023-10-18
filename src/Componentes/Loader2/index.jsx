import styles from './styles.module.scss';

export function Loader2() {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__spinner}></div>
    </div>
  )
}