import { useCarrinho } from '../../../Contextos/CarrinhoContext';

import { MinusIcon } from '../../Icones/Minus';
import { PlusIcon } from '../../Icones/Plus';

import styles from './styles.module.scss';

export function CarrinhoItem({ item }) {
  const { DiminuirQuantidadeItem, AumentarQuantidadeItem, ExcluirItem } = useCarrinho();

  return (
    <div className={styles.carrinho__item}>
      <div className={styles.item__infos}>
        <div className={styles.item__image}>
          <img src={item.Imagens[0].Imagem_URL} />
        </div>
        <div>
          <h4>{item.Produto.Nome + " - " + item.Cor.Nome + " - " + item.Tamanho.Tamanho}</h4>
          <div className={styles.quantidade}>
            Quantidade:
            <span>
              <button onClick={() => DiminuirQuantidadeItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}>
                <MinusIcon />
              </button>

              {item.Quantidade}

              <button onClick={() => AumentarQuantidadeItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}>
                <PlusIcon />
              </button>
            </span>
          </div>
          <span><button onClick={() => ExcluirItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}>Excluir</button></span>
        </div>
      </div>
      <div className={styles.item__preco}>
        R$ {(item.Produto.Preco * item.Quantidade).toFixed(2).replace(".", ",")}
      </div>
    </div>
  )
}