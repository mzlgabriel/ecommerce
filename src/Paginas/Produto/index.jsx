import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IMaskInput } from 'react-imask'

import { StarIcon } from '../../Componentes/Icones/Star'
import { MinusIcon } from '../../Componentes/Icones/Minus'
import { ArrowRightIcon } from '../../Componentes/Icones/ArrowRight'
import { PlusIcon } from '../../Componentes/Icones/Plus'

import { SliderProdutos } from '../../Componentes/SliderProdutos'
import { Loader } from '../../Componentes/Loader'

import { useCarrinho } from '../../Contextos/CarrinhoContext'
import useAlerta from '../../Hooks/UseAlerta'

import styles from './styles.module.scss'
import api from '../../Servicos/api'
import { Loader2 } from '../../Componentes/Loader2'
import Skeleton from 'react-loading-skeleton'
import { ProdutoSkeleton } from './Skeleton'

export function ProdutoPage() {
  const { slug } = useParams();
  const { alertaErro } = useAlerta();
  
  const { AdicionaItemAoCarrinho, inputValor, addCarrinhoQuantidade, remCarrinhoQuantidade, inputValorCarrinhoQuantidade } = useCarrinho();
  
  const [cep, setCep] = useState('');
  const [cepConsultado, setCepConsultado] = useState(null);
  const [produto, setProduto] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [corId, setCorId] = useState(null);
  const [tamanhoId, setTamanhoId] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    setCarregando(true);
    GetProduto(slug);
    setTimeout(() => {
      setCarregando(false);
    }, 1500);
  }, [slug])

  const GetProduto = async (slug) => {
    try {
      const { data } = await api.get(`produto/slug/${slug}`);
      setProduto(data.Produto);
    } catch (error) {
      alertaErro('Ocorreu um erro ao tentar carregar o produto, tente novamente.');
    }
  }

  if (carregando) {
    return (
      <ProdutoSkeleton />
    )
  }

  return (
    <>
      <div className={styles.produto}>

        <div className={styles.produto__imagem}>
          <div className={styles.produto__imagem_principal}>
            {corSelecionada ? (
              <div>
                <div className={styles.produto__imagem_principal}>
                  <img src={produto.imagens.find((imagem) => imagem.Cor_ID === corSelecionada).Imagem_URL} />
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.produto__imagem_principal}>
                  <img src={produto.imagens.find((imagem) => imagem.Cor_ID === produto.cores[0].Cor_ID).Imagem_URL} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.produto__info}>
          <div className={styles.produto__info_nome}>
            {produto.Nome}
          </div>

          <div className={styles.produto__info_preco}>
            R$ {Number(produto.Preco).toFixed(2).replace('.', ',')}
          </div>

          <div className={styles.produto__info_opcoes}>
            <div className={styles.produto__info_opcoes_op}>
              <span>SELECIONE A COR</span>

              <div className={styles.opcoes}>
                {produto.cores.map((cor) => (
                  <button
                    key={cor.Cor_ID}
                    value={cor.Nome}
                    className={`${styles.cor} ${corSelecionada === cor.Cor_ID ? styles.active : ''}`}
                    onClick={() => {
                      setCorSelecionada(cor.Cor_ID);
                      setCorId(cor.Cor_ID);
                    }}
                  >
                    <div style={{ backgroundColor: cor.Codigo_HEX }}></div>
                    {cor.Nome}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.produto__info_opcoes_op}>
              <span>SELECIONE O TAMANHO</span>

              <div className={styles.opcoes}>
                {produto.tamanhos.map((tamanho) => (
                  <button
                    key={tamanho.Tamanho}
                    value={tamanho.Tamanho}
                    className={styles + ' ' + `${tamanhoSelecionado === tamanho.Tamanho ? styles.active : ''}`}
                    onClick={() => {
                      setTamanhoSelecionado(tamanho.Tamanho)
                      setTamanhoId(tamanho.Tamanho_ID)
                    }}
                  >
                    {tamanho.Tamanho}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.produto__info_opcoes_op}>
              <span>QUANTIDADE</span>

              <div className={styles.input_group}>
                <button onClick={() => remCarrinhoQuantidade()}>
                  <MinusIcon />
                </button>
                <input type="value" min={1} max={10} onChange={e => inputValorCarrinhoQuantidade(e)} value={inputValor} />
                <button onClick={() => addCarrinhoQuantidade()}>
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div className={styles.produto__info_botao}>
              <button onClick={() => AdicionaItemAoCarrinho(produto.Produto_ID, inputValor, corId, tamanhoId)}>
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recomendacoes}>
        <h2>Veja mais sobre a coleção</h2>

        <SliderProdutos />
      </div>
    </>
  )
}