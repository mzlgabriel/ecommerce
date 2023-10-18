import { createContext, useContext, useEffect, useState } from 'react';

import useAlerta from '../Hooks/UseAlerta';
import api from '../Servicos/api';
import { useAuth } from './AuthContext';

const ProdutoContext = createContext();

export function useProduto() {
  return useContext(ProdutoContext);
}

export function ProdutoProvider({ children }) {
  // const { setCarregando } = useAuth();
  const { alertaErro, alertaSucesso } = useAlerta();

  const [produtos, setProdutos] = useState([]);
  const [colecoes, setColecoes] = useState([]);
  const [cores, setCores] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);
  const [produtosColecao, setProdutosColecao] = useState([]);
  const [carregando, setCarregando] = useState(false);
  useEffect(() => {
    RequisicaoInicial();
  }, []);

  const RequisicaoInicial = async () => {
    setCarregando(true);

    try {
      const produtos = await api.get('/produto');
      setProdutos(produtos.data.Produtos);

      const colecoes = await api.get('/produto/colecao/listar');
      setColecoes(colecoes.data.Colecoes);

      const cores = await api.get('/produto/cor/listar');
      setCores(cores.data.Cores);

      const tamanhos = await api.get('/produto/tamanho/listar');
      setTamanhos(tamanhos.data.Tamanhos);

      setCarregando(false);
    } catch (error) {
      alertaErro('Ocorreu um erro ao tentar carregar os produtos, tente novamente.');
      setCarregando(false);
    }
  }

  const getProdutosColecao = async (colecaoId) => {
      const { data } = await api.get('/produto/colecao/' + colecaoId);

      setProdutosColecao(data.Colecao.produtos);
  }

  return (
    <ProdutoContext.Provider value={{ produtos, colecoes, cores, tamanhos, produtosColecao, getProdutosColecao, carregando }}>
      {children}
    </ProdutoContext.Provider>
  );
}