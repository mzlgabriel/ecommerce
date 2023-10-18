
import { Link } from 'react-router-dom';
import { StarIcon } from '../Icones/Star';

import styles from './styles.module.scss';

export function Produto({ imagem, nome, preco, slug }) {
  return (
    <Link to={"/produto/" + slug}>
      <div className={styles.produto}>
        <div className={styles.produto__imagem}>
          <img src={imagem} alt='Imagem do Produto' />
        </div>
        <div className={styles.produto__descricao}>
          <div>
            {nome}
          </div>
        </div>
        <div className={styles.produto__estrela}>
          <StarIcon color="#DFDFDF" />
          <StarIcon color="#DFDFDF" />
          <StarIcon color="#DFDFDF" />
          <StarIcon color="#DFDFDF" />
          <StarIcon color="#DFDFDF" />
        </div>
        <div className={styles.produto__preco}>
          <h3>R$ {Number(preco).toFixed(2).replace('.', ',')}</h3>
          <p>ou 6x de R$14,99 sem juros</p>
        </div>
      </div>
    </Link>
  )
}