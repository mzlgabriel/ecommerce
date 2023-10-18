import { useContext, useEffect, useState } from "react";
import { CarrinhoItem } from "./CarrinhoItem";

import { CartIcon } from "../Icones/Cart";

import styles from './styles.module.scss'
import { Link, useLocation } from "react-router-dom";
import { CloseIcon } from "../Icones/Close";
import { useCarrinho } from "../../Contextos/CarrinhoContext";
import { useAuth } from "../../Contextos/AuthContext";
import uuid from "react-uuid";
import { useProduto } from "../../Contextos/ProdutoContext";
import { Loader2 } from "../Loader2";

export function CarrinhoModal() {
  const { carrinhoQuantidade, precoTotalCarrinho, RequisicaoInicial } = useCarrinho();
  const { autenticado, carrinho } = useAuth();
  const { carregando } = useCarrinho();
  const [click, setClick] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const handleClick = () => setClick(!click);

  const { pathname } = useLocation();

  useEffect(() => {
    RequisicaoInicial();
  }, [autenticado]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setClick(false);
  }, [pathname]);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkWindowSize);

    checkWindowSize();

    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, [])

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown_link} onClick={handleClick} >
        <div className={styles.cart}>
          <CartIcon />

          <div>
            {carrinho.length}
          </div>
        </div>
      </div>
      {isMobile ? (
        <div style={click ? { display: 'block' } : { display: 'none' }} className={styles.dropdown_content}>

          <div className={styles.carrinho_top}>
            <button onClick={handleClick}><CloseIcon /></button>
            <h3>Carrinho</h3>
            <p>Confira seu carrinho abaixo.</p>
          </div>

          <div className={styles.carrinho_padding}>
            <div className={styles.carrinho__items}>
              {carrinho.length === 0 ? (
                <div className={styles.carrinho_vazio}>
                  <p>O carrinho está vázio.</p>
                </div>
              ) : (
                carrinho.map((item) => (
                  <CarrinhoItem key={uuid()} item={item} />
                ))
              )}
            </div>

            <div className={styles.carrinho__bottom}>
              <div className={styles.carrinho__bottom_total}>
                <h4>Total</h4>
                <span>R$ {precoTotalCarrinho} </span>
              </div>
              <div className={styles.botao__finalizar}>
                {carrinhoQuantidade === 0 ? (
                  <button disabled>
                    Finalizar pedido
                  </button>
                ) : (
                  <Link to="/finalizar-pedido">
                    <button>
                      Finalizar pedido
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.dropdown_content} ${carregando ? styles.carregando_overflow : null}`}>
          {carregando ? (
            <div className={styles.carregando}>
              <Loader2 />
            </div>
          ) : (
            null
          )}
          <div className={styles.carrinho__items}>
            {carrinhoQuantidade === 0 ? (
              <button disabled>
                Finalizar pedido
              </button>
            ) : (
              <Link to="/finalizar-pedido">
                <button>
                  Finalizar pedido
                </button>
              </Link>
            )}
          </div>

          <div className={styles.carrinho__bottom}>
            <div className={styles.carrinho__bottom_total}>
              <h4>Total</h4>
              <span>R$ {precoTotalCarrinho} </span>
            </div>
            <div className={styles.botao__finalizar}>
              {carrinhoQuantidade === 0 ? (
                <button disabled>
                  Finalizar pedido
                </button>
              ) : (
                <Link to="/finalizar">
                  <button>
                    Finalizar pedido
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}