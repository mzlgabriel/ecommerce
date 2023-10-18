import { BrowserRouter } from "react-router-dom"
import { Router } from "./Router"
import { Menu } from "./Componentes/Menu"
import { AuthProvider } from './Contextos/AuthContext';
import { ToastContainer } from "react-toastify";
import { ProdutoProvider } from "./Contextos/ProdutoContext";
import { FiltroProvider } from "./Contextos/FiltroContext";

import 'react-toastify/dist/ReactToastify.css';
import { CarrinhoProvider } from "./Contextos/CarrinhoContext";
import { useEffect } from "react";
import uuid from "react-uuid";

function App() {

  useEffect(() => {
    const sessao_id = localStorage.getItem('sessao_id');

    if (!sessao_id) {
      localStorage.setItem('sessao_id', uuid());
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <ProdutoProvider>
            <FiltroProvider>

              <Menu />
              <Router />

              <ToastContainer />
            </FiltroProvider>
          </ProdutoProvider>
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
