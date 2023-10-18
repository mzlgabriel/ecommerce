import styles from './styles.module.scss'

export function Loader() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.loader}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  )
}