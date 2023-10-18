import { SliderProdutos } from '../../Componentes/SliderProdutos';
import styles from './styles.module.scss';

export function Home() {

  return (
    <>
      <main>
        <div className={styles.colecoes__destaque}>
          <div className={styles.colecoes__container}>
            <div className={`${styles.item__a} ${styles.colecoes__container_item}`}>
              Coleção 1
            </div>
            <div className={`${styles.item__b} ${styles.colecoes__container_item}`}>
              Coleção 2
            </div>
            <div className={`${styles.item__c} ${styles.colecoes__container_item}`}>
              Coleção 3
            </div>
          </div>
        </div>

        <div className={styles.produtos__destaque}>
          <div className={styles.produtos__destaque_container}>
            <SliderProdutos />
          </div>
        </div>
      </main>
    </>
  )
}