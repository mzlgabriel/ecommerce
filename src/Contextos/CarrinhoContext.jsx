import { createContext, useContext, useEffect, useState } from 'react';

import useAlerta from '../Hooks/UseAlerta';
import api from '../Servicos/api';

import { useAuth } from './AuthContext';

const CarrinhoContext = createContext();

export function useCarrinho() {
  return useContext(CarrinhoContext);
}

export function CarrinhoProvider({ children }) {
  const { alertaErro, alertaSucesso } = useAlerta();
  const { user, autenticado, carrinho, setCarrinho } = useAuth();
  const [carrinhoQuantidade, setCarrinhoQuantidade] = useState(0);
  const [precoTotalCarrinho, setPrecoTotalCarrinho] = useState(0);
  const [inputValor, setInputValor] = useState(1);

  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    RequisicaoInicial();
  }, []);

  useEffect(() => {
    let precoTotal = 0;
    carrinho.forEach((item) => {
      precoTotal += item.Produto.Preco * item.Quantidade;
    });
    setCarrinhoQuantidade(carrinho.length);
    setPrecoTotalCarrinho(precoTotal.toFixed(2).replace('.', ','));
  }, [carrinho]);

  const RequisicaoInicial = async () => {
    setCarregando(true);
    const token = localStorage.getItem('Token');

    if (!token) {
      try {
        const { data } = await api.post('/carrinho/visitante', {
          Sessao_ID: localStorage.getItem('sessao_id')
        });
        setCarrinho(data.Carrinho);

        setCarregando(false);
      } catch (error) {
        setCarregando(false);
      }
    } else {
      try {
        setCarregando(true);
        const { data } = await api.get('/carrinho', {
          headers: {
            Authorization: token
          }
        });
        setCarrinho(data.Carrinho);

        setCarregando(false);
      } catch (error) {
        setCarregando(false);
      }
    }
  }

  const addCarrinhoQuantidade = () => {
    setInputValor(Number(inputValor) + 1);
  }

  const remCarrinhoQuantidade = () => {
    if (carrinhoQuantidade == 1) return;
    setInputValor(Number(inputValor) - 1);
  }

  const inputValorCarrinhoQuantidade = (e) => {
    let novovalor = e.target.value
    setInputValor(novovalor)
  }

  const AdicionaItemAoCarrinho = async (produto_id, quantidade, cor, tamanho) => {
    if(quantidade == 0) return alertaErro('Selecione uma quantidade para o produto.')
    if(!cor) return alertaErro('Selecione uma cor para o produto.')
    if(!tamanho) return alertaErro('Selecione um tamanho para o produto.')

    if (!autenticado || !user) {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/visitante/adicionar', {
          Produto_ID: produto_id,
          Quantidade: quantidade,
          Cor_ID: cor,
          Tamanho_ID: tamanho,
          Sessao_ID: localStorage.getItem('sessao_id')
        });

        await RequisicaoInicial()
        alertaSucesso('Produto adicionado ao carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar adicionar o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    } else {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/adicionar', {
          Produto_ID: produto_id,
          Quantidade: quantidade,
          Cor_ID: cor,
          Tamanho_ID: tamanho
        });

        await RequisicaoInicial()
        alertaSucesso('Produto adicionado ao carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar adicionar o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    }
  }

  const DiminuirQuantidadeItem = async (produto_id, cor, tamanho) => {
    if (!autenticado || !user) {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/visitante/remover', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho,
          Sessao_ID: localStorage.getItem('sessao_id')
        });

        await RequisicaoInicial();
        alertaSucesso('Produto removido do carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar remover o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    } else {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/remover', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho
        });

        await RequisicaoInicial();
        alertaSucesso('Produto removido do carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar remover o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    }
  }

  const AumentarQuantidadeItem = async (produto_id, cor, tamanho) => {
    if (!autenticado || !user) {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/visitante/adicionar', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho,
          Quantidade: 1,
          Sessao_ID: localStorage.getItem('sessao_id')
        });

        await RequisicaoInicial();
        alertaSucesso('Produto adicionado ao carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar adicionar o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    } else {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/adicionar', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho,
          Quantidade: 1
        });

        await RequisicaoInicial();
        alertaSucesso('Produto adicionado ao carrinho com sucesso!');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar adicionar o produto ao carrinho, tente novamente.');
        setCarregando(false);
      }
    }
  }

  const ExcluirItem = async (produto_id, cor, tamanho) => {
    if (!autenticado || !user) {
      try {
        setCarregando(true);

        const { data } = await api.post('carrinho/visitante/excluir', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho,
          Sessao_ID: localStorage.getItem('sessao_id')
        });

        await RequisicaoInicial();
        alertaSucesso('Produto removido do carrinho.');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar excluir o produto do carrinho, tente novamente.');
        setCarregando(false);
      }
    } else {
      try {
        setCarregando(true);
        console.log(produto_id, cor, tamanho);
        const { data } = await api.post('carrinho/excluir', {
          Produto_ID: produto_id,
          Cor_ID: cor,
          Tamanho_ID: tamanho
        });
        console.log('test2');

        await RequisicaoInicial();
        alertaSucesso('Produto removido do carrinho.');
        setCarregando(false);
      } catch (error) {
        alertaErro('Ocorreu um erro ao tentar excluir o produto do carrinho, tente novamente.');
        setCarregando(false);
      }
    }
  }

  return (
    <CarrinhoContext.Provider value={{ ExcluirItem, AdicionaItemAoCarrinho, DiminuirQuantidadeItem, AumentarQuantidadeItem, setCarrinho, carregando, inputValor, precoTotalCarrinho, carrinhoQuantidade, addCarrinhoQuantidade, remCarrinhoQuantidade, inputValorCarrinhoQuantidade, carrinho, RequisicaoInicial, setCarregando }}>
      {children}
    </CarrinhoContext.Provider>
  );
}