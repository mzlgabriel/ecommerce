import styles from './styles.module.scss';

import { Filtro } from '../../Componentes/Filtro';
import { Produto } from '../../Componentes/Produto';
import { Loader2 } from '../../Componentes/Loader2';
import { useProduto } from '../../Contextos/ProdutoContext';
import { useAuth } from '../../Contextos/AuthContext';
import { useState } from 'react';
import { useFiltro } from '../../Contextos/FiltroContext';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAlerta from '../../Hooks/UseAlerta';
import { Loader } from '../../Componentes/Loader';

export function Colecao() {

  const { slug } = useParams();
  const { produtos, colecoes } = useProduto();
  // const { setCarregando, carregando } = useAuth();
  const { carregando: carregandoFiltro, searchText, corSelecionada, selectedTamanhos, filtroPreco } = useFiltro();
  const { alertaErro } = useAlerta();
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [colecaoEncontrada, setColecaoEncontrada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const colecaoEncontrada = colecoes.find(colecao => colecao.Slug === slug);

    if (!colecaoEncontrada) {
      alertaErro("Coleção inexistente.");
      navigate("/");
      return;
    }

    setColecaoEncontrada(colecaoEncontrada);

  }, [slug, navigate, alertaErro]);

  useEffect(() => {
    if (colecaoEncontrada) {
      const produtosColecao = produtos.filter(produto => {
        return produto.Colecao_ID === colecaoEncontrada.Colecao_ID;
      });

      const produtosFiltradosInicial = produtosColecao.filter(produto => {
        return (
          (!corSelecionada || produto.cores.some(cor => cor.Nome === corSelecionada.Nome)) &&
          (selectedTamanhos.length === 0 || selectedTamanhos.some(tamanho => produto.tamanhos.some(tamanhoObj => tamanhoObj.Tamanho === tamanho))) &&
          (!searchText || produto.Nome.toLowerCase().includes(searchText.toLowerCase()))
        );
      });

      if (produtosFiltradosInicial.length > 0) {
        setProdutosFiltrados(produtosFiltradosInicial);
      } else {
        setProdutosFiltrados([]);
      }
    }
  }, [produtos, colecaoEncontrada, corSelecionada, selectedTamanhos, searchText]);

  if (!colecaoEncontrada) {
    return null;
  }

  return (
    <main className={styles.main}>
      <Filtro />

      <div className={styles.produtos}>
        {carregandoFiltro ? <Loader2 /> : (
          <div className={styles.produtos__container}>
            <>
              {produtosFiltrados.length == 0 ? (
                <p>Nenhum produto encontrado com esse filtro.</p>
              ) : (
                <>
                  {produtosFiltrados.map((produto) => {
                    const corSelecionadaID = corSelecionada ? corSelecionada.Cor_ID : produto.cores[0].Cor_ID;
                    const imagemCorSelecionada = produto.imagens.find((imagem) => imagem.Cor_ID === corSelecionadaID);
                    const imagemDefault = imagemCorSelecionada ? imagemCorSelecionada.Imagem_URL : null;

                    return (
                      <Produto key={produto.Produto_ID} id={produto.Produto_ID} slug={produto.Slug} imagem={imagemDefault} nome={produto.Nome} preco={produto.Preco} />
                    )
                  })}
                </>
              )}
            </>
          </div>
        )}
      </div>
    </main>
  )
}