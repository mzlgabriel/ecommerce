import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { MinusIcon } from "../../Componentes/Icones/Minus";
import { PlusIcon } from "../../Componentes/Icones/Plus";
import { ArrowRightIcon } from "../../Componentes/Icones/ArrowRight";
import { IMaskInput } from 'react-imask'
import styles from './styles.module.scss'
import { StarIcon } from "../../Componentes/Icones/Star";
import 'react-loading-skeleton/dist/skeleton.css'

export function ProdutoSkeleton() {
  return (
    <SkeletonTheme baseColor="#ebe5da" highlightColor="#d6cfc1">
      <div className={styles.produto}>

        <div className={styles.produto__imagem}>
          <div className={styles.produto__imagem_principal}>
            <div>
              <div className={styles.produto__imagem_principal}>
                <Skeleton className={styles.skeleton} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.produto__info}>
          <div className={styles.produto__info_nome}>
            <Skeleton />
          </div>

          <div>
            <Skeleton height={30} />
          </div>

          <div className={styles.produto__info_preco}>
            <Skeleton />
          </div>

          <div className={styles.produto__info_opcoes}>
            <div className={styles.produto__info_opcoes_op}>

              <Skeleton height={30} />

            </div>
            <div className={styles.produto__info_opcoes_op}>

              <Skeleton height={30} />
            </div>
            <div className={styles.produto__info_opcoes_op}>

              <Skeleton height={30} />
            </div>

            <div className={styles.produto__info_botao}>
              <Skeleton height={45} />
            </div>
          </div>

          <div className={styles.produto__info__cep}>
            <Skeleton height={190} />
          </div>
        </div>
      </div>

      <div className={styles.recomendacoes}>
        <h2>Veja mais sobre a coleção</h2>

        <Skeleton height={500} />
      </div>
    </SkeletonTheme>
  )
}