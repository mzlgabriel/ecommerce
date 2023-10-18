import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../Contextos/AuthContext"
import { CaretLeftIcon } from "../../Componentes/Icones/CaretLeft";
import styles from './styles.module.scss'
import { useEffect } from "react";
import { useState } from "react";
import { MapPinIcon } from "../../Componentes/Icones/MapPin";
import { Loader } from "../../Componentes/Loader";
import api from "../../Servicos/api";
import useAlerta from "../../Hooks/UseAlerta";
import { Pix2Icon } from "../../Componentes/Icones/Pix2";
import { CreditCardIcon } from "../../Componentes/Icones/CreditCard";
import { BoletoIcon } from "../../Componentes/Icones/Boleto";
import { MinusIcon } from "../../Componentes/Icones/Minus";
import { PlusIcon } from "../../Componentes/Icones/Plus";
import { useCarrinho } from "../../Contextos/CarrinhoContext";
export function FinalizarPedido() {

  const { user, carrinho } = useAuth();
  const { alertaErro } = useAlerta();
  const { DiminuirQuantidadeItem, AumentarQuantidadeItem, ExcluirItem } = useCarrinho();

  const [endereco, setEndereco] = useState(null);
  const [cepConsultado, setCepConsultado] = useState(null);
  const [freteSelecionado, setFreteSelecionado] = useState({ transportadora: null, valor: 0 });
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [carrinhoTotal, setCarrinhoTotal] = useState(0);

  const pagamentos = [
    { id: 1, pagamento: 'Pix', icon: <Pix2Icon />, descricao: 'Aprovação Imediata' },
    { id: 2, pagamento: 'Cartão de Credito/Débito', icon: <CreditCardIcon />, descricao: 'Até 6x sem juros' },
    { id: 3, pagamento: 'Boleto', icon: <BoletoIcon />, descricao: 'Será aprovado em 1 ou 2 dias úteis.' },
  ]

  useEffect(() => {
    setCarregandoCep(true);
    const userEnderecoPadrao = user?.enderecos?.find(endereco => endereco.Padrao);
    setEndereco(userEnderecoPadrao);

    if (userEnderecoPadrao) {
      const CalcularFrete = async (cep) => {
        setCarregandoCep(true);
        try {
          const { data } = await api.get('correios/frete/' + cep);
          setCepConsultado(data.Frete);
          setCarregandoCep(false);
        } catch (error) {
          setCarregandoCep(false);
          alertaErro('Erro ao consultar o CEP, tente novamente mais tarde.');
        }
      }

      if (userEnderecoPadrao.CEP) {
        CalcularFrete(userEnderecoPadrao.CEP);
      }
    }
  }, [user]);

  useEffect(() => {
    let totalCarrinho = carrinho
      .map((item) => item.Produto.Preco * item.Quantidade)
      .reduce((a, b) => a + b, 0);

    setCarrinhoTotal(totalCarrinho);
  }, [carrinho]);

  const CalculaDias = (data) => {
    let dataPrazo = new Date(data);
    let dataAtual = new Date();

    if (!(dataPrazo instanceof Date)) {
      dataPrazo = new Date();
    }

    let diferenca = dataPrazo.getTime() - dataAtual.getTime();
    let dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

    return dias;
  }

  const CalculaCarrinho = () => {
    const total = carrinhoTotal + Number(freteSelecionado.valor);
    
    return total.toFixed(2).replace(".", ",");
  }

  if (carregandoCep) {
    return (
      <Loader />
    )
  }

  return (
    <div className={styles.finalizar_compra__container}>
      <div className={styles.breadcrumb}>
        <Link to="/">
          <CaretLeftIcon /> Voltar para página
        </Link>
      </div>

      <div className={styles.finalizar_compra}>
        <div className={styles.finalizar_compra__content}>
          <div className={styles.finalizar_compra__top}>
            <h2>Finalizar compra</h2>
            <p>Como você quer receber sua compra?</p>
          </div>

          <div className={styles.finalizar_compra__endereco}>
            <h4>Endereço</h4>

            {!endereco ? (
              <div className={styles.finalizar_compra__endereco__container}>
                <div>
                  <h4>Nenhum endereco selecionado.</h4>
                  <p><Link to="/minha-conta">Clique aqui para selecionar um endereço.</Link></p>
                </div>
              </div>
            ) : (
              <div className={styles.finalizar_compra__endereco__container}>
                <div className={styles.endereco}>
                  <MapPinIcon />

                  <div className={styles.endereco__infos}>
                    <h4>{endereco.Rua}, {endereco.Numero}</h4>
                    <span>{endereco.Cidade}, {endereco.Estado} - CEP {endereco.CEP}</span>
                    <span>{user.Nome}</span>
                  </div>
                </div>
                <Link to="/minha-conta">
                  <p>Editar ou escolher outro</p>
                </Link>
              </div>
            )}
          </div>

          {!endereco ? null : (
            <div className={styles.finalizar_compra__frete}>
              <h4>Frete</h4>

              <div className={styles.finalizar_compra__frete__container}>
                <div>
                  {cepConsultado ? (
                    <div className={styles.produto__info__cep_resultado_info}>
                      <div className={styles.produto__info__cep_resultado}>
                        {Object.values(cepConsultado).map((frete) => {
                          let transportadora;

                          switch (frete.coProduto) {
                            case '04162':
                              transportadora = 'SEDEX'
                              break;
                            case '03085':
                              transportadora = 'PAC'
                              break;
                          }

                          return (
                            <div
                              className={`${styles.frete} ${freteSelecionado === cepConsultado.tipo ? styles.active : ''}`}
                              key={cepConsultado.tipo} >
                              <label htmlFor={transportadora}>
                                <div>
                                  <input
                                    type="radio" name={transportadora} id={transportadora}
                                    value={transportadora}
                                    checked={freteSelecionado.transportadora === transportadora}
                                    onChange={e => setFreteSelecionado({ transportadora: transportadora, valor: frete.pcFinal.replace(',', '.') })}
                                  />
                                  {transportadora} - até {CalculaDias(frete.dataMaxima)} {CalculaDias(frete.dataMaxima) > 1 ? "dias úteis" : "dia útil"}
                                </div>
                                <span>R$ {frete.pcFinal}</span>
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <div className={styles.finalizar_compra__pagamento}>
            <h4>Forma de pagamento</h4>

            <div className={styles.finalizar_compra__pagamento__container}>
              {pagamentos.map(pagamento => (
                <div
                  className={`${styles.pagamento} ${pagamentoSelecionado === pagamento.pagamento ? styles.active : ''}`}
                  key={pagamento.id}>
                  <label htmlFor={pagamento.pagamento + pagamento.id}>
                    <input
                      type="radio" name={pagamento.pagamento + pagamento.id} id={pagamento.pagamento + pagamento.id}
                      value={pagamento.pagamento}
                      checked={pagamentoSelecionado === pagamento.pagamento}
                      onChange={e => setPagamentoSelecionado(e.target.value)}
                    />

                    <div className={styles.pagamento__icon}>
                      {pagamento.icon}
                    </div>

                    <div className={styles.pagamento__nome}>
                      <h4>{pagamento.pagamento}</h4>
                      <span>{pagamento.descricao}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pagamento__finalizar}>
            {endereco ? (
              <button onClick={() => finalizarCompra()}>Finalizar compra</button>
            ) : (
              <button disabled>Finalizar compra</button>
            )}
          </div>

        </div>

        <div className={styles.finalizar_compra__carrinho}>
          <div>
            <div className={styles.finalizar_compra__total}>
              <h3>Total do pedido: R$ {carrinhoTotal.toFixed(2).replace(".", ",")}</h3>
              <h3>Total do frete: R$ {Number(freteSelecionado.valor).toFixed(2).replace('.', ',')}</h3>
              <h2>Total: R$ {CalculaCarrinho()}</h2>
            </div>

            <h4>Resumo do pedido</h4>

            <div className={styles.carrinho_items}>
              {carrinho ? (
                console.log(carrinho),
                carrinho.map((item) => (
                  <div className={styles.item} key={item.Produto.Produto_ID + item.Tamanho.Tamanho_ID + item.Cor.Cor_ID}>
                    <div className={styles.item__imagem}>
                      <div>
                        <img src={item.Imagens[0].Imagem_URL} alt="Imagem do Produto" />
                      </div>
                      <h4>{item.Produto.Nome}</h4>
                    </div>

                    <div className={styles.item__infos}>
                      <div className={styles.infos}>
                        <div>Cor: <span>{item.Cor.Nome}</span></div>
                        <div>Tamanho: <span>{item.Tamanho.Tamanho}</span></div>
                        <div>Preço: <span>R$ {(item.Produto.Preco * item.Quantidade).toFixed(2).replace(".", ",")}</span></div>
                        <div className={styles.quantidade}>Quantidade: <span><button onClick={() => DiminuirQuantidadeItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}><MinusIcon /></button> {item.Quantidade} <button onClick={() => AumentarQuantidadeItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}><PlusIcon /></button></span> </div>
                      </div>
                      <div className={styles.acoes}>
                        <button onClick={() => ExcluirItem(item.Produto.Produto_ID, item.Cor.Cor_ID, item.Tamanho.Tamanho_ID)}>
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Carrinho vazio</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}