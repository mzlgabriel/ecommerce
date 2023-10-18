import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAlerta from '../Hooks/UseAlerta';
import api from '../Servicos/api';

const FiltroContext = createContext();

export function useFiltro() {
  return useContext(FiltroContext);
}

export function FiltroProvider({ children }) {
  const { alertaErro, alertaSucesso } = useAlerta();
  
  let navigate = useNavigate();

  const [carregando, setCarregando] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedCor, setSelectedCor] = useState("");
  const [selectedTamanhos, setSelectedTamanhos] = useState([]);
  const [filtroPreco, setFiltroPreco] = useState(500);
  const [corSelecionada, setCorSelecionada] = useState('');

  const ResetarStates = () => {
    setTextoPesquisa('');
    setCorSelecionada('');
    setTamanhosSelecionado([]);
    setPrecoMinimo('');
    setPrecoMaximo('');
  };

  return (
    <FiltroContext.Provider value={{ 
      carregando, setCarregando,
      searchText, setSearchText,
      selectedCor, setSelectedCor,
      selectedTamanhos, setSelectedTamanhos,
      filtroPreco, setFiltroPreco,
      corSelecionada, setCorSelecionada
     }}>
      {children}
    </FiltroContext.Provider>
  );
}