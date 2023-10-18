import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Home } from "./Paginas/Home";
import { Login } from "./Paginas/Login";
import { useAuth } from "./Contextos/AuthContext";
import { ProdutoPage } from "./Paginas/Produto";
import { Colecao } from "./Paginas/Colecao";
import { MinhaConta } from "./Paginas/MinhaConta";
import { FinalizarPedido } from "./Paginas/FinalizarPedido";

export function Router() {

  const { autenticado } = useAuth();

  const VerificaLogin = ({ autenticado, children }) => {
    if (autenticado) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  const RotaProtegida = ({ autenticado, children }) => {
    if (!autenticado) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/produto/:slug" element={<ProdutoPage />} />
      <Route path="/produto" element={<Navigate to="/" />} />

      <Route path="/colecao/:slug" element={<Colecao />} />
      <Route path="/colecao" element={<Navigate to="/" />} />

      <Route path="/minha-conta" element={<MinhaConta />} />
      <Route path="/finalizar-pedido" element={<FinalizarPedido />} />

      <Route path="/login" element={
        <VerificaLogin autenticado={autenticado}>
          <Login />
        </VerificaLogin>
      } />

    </Routes>
  )
}