import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAlerta from '../Hooks/UseAlerta';
import api from '../Servicos/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { alertaErro, alertaSucesso } = useAlerta();

  let navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setCarregando(true);
      const token = localStorage.getItem('Token');

      if (token) {
        api.defaults.headers.Authorization = token;

        try {
          const { data } = await api.get('/cliente');
          setAutenticado(true);
          setUser(data.Cliente);

          setCarregando(false);
        } catch (error) {
          if (error.response.data.Mensagem === "O token expirou.") {
            api.defaults.headers.Authorization = '';
            localStorage.removeItem('Token');
            setAutenticado(false);
            setUser(null);
            setCarregando(false);
            navigate('/');
          }
          setCarregando(false);
        } finally {
          setCarregando(false);
        }
      } else {
        setCarregando(false);
      }
    };

    fetchData();
  }, []);

  const login = async (email, senha) => {
    try {
      const { data } = await api.post('/auth/login', {
        Email: email,
        Senha: senha,
        Sessao_ID: localStorage.getItem('sessao_id')
      })

      setUser(data.Cliente);
      localStorage.setItem('Token', "Bearer " + data.Token.access_token);
      api.defaults.headers.Authorization = "Bearer " + data.Token.access_token;

      setAutenticado(true);
      navigate('/');
      alertaSucesso('Login efetuado com sucesso!')

    } catch (error) {
      alertaErro(error.response.data.Mensagem)
    }
  };

  const registro = async (nome, cpf, email, senha) => {
    try {
      const { data } = await api.post('/auth/registro', {
        Nome: nome,
        CPF: cpf,
        Email: email,
        Senha: senha,
        Sessao_ID: localStorage.getItem('sessao_id')
      })

      setUser(data.Cliente);
      localStorage.setItem('Token', "Bearer " + data.Token.access_token);
      api.defaults.headers.Authorization = "Bearer " + data.Token.access_token;

      setAutenticado(true);
      navigate('/');
      alertaSucesso('Registro efetuado com sucesso!')

    } catch (error) {
      console.log(error);
      alertaErro(error.response.data.Mensagem)
    }
  }

  const logout = async () => {
    try {

      const { data } = await api.post('/auth/logout');

      api.defaults.headers.Authorization = '';
      localStorage.removeItem('Token');

      navigate('/');
      setAutenticado(false);
      setUser(null);
      setCarrinho([]);
      alertaSucesso(data.Mensagem);
    } catch (error) {
      alertaErro('Ocorreu um erro ao tentar deslogar, tente novamente.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, autenticado, registro, carregando, setCarregando, setCarrinho, carrinho }}>
      {children}
    </AuthContext.Provider>
  );
}