import { useContext, useEffect, useState } from 'react';
import { useProduto } from '../../Contextos/ProdutoContext';

import { ArrowRightIcon } from '../Icones/ArrowRight'
import { SlidersIcon } from '../Icones/SlidersIcon';

import styles from './styles.module.scss'
import { CloseIcon } from '../Icones/Close';
import { useFiltro } from '../../Contextos/FiltroContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Filtro() {

  const { cores, tamanhos } = useProduto();
  const { setCarregando, carregando } = useFiltro();

  const { ResetarStates, setFiltroPreco, setSearchText, searchText, setSelectedTamanhos, setCorSelecionada, corSelecionada, selectedTamanhos, filtroPreco } = useFiltro();
  const [isMobile, setIsMobile] = useState(false);
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const onSliderChange = (value) => {
    setFiltroPreco(value);
  };

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', checkWindowSize);

    checkWindowSize();

    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCorChange = (cor) => {
    if (cor === corSelecionada) {
      setCarregando(true);
      setCorSelecionada("");

      setTimeout(() => {
        setCarregando(false);
      }, 500);
    } else {
      setCarregando(true);
      setCorSelecionada(cor);

      setTimeout(() => {
        setCarregando(false);
      }, 500)
    }
  };

  const handleTamanhoChange = (tamanho) => {
    if (selectedTamanhos.includes(tamanho)) {
      setSelectedTamanhos(selectedTamanhos.filter((t) => t !== tamanho));
    } else {
      setSelectedTamanhos([...selectedTamanhos, tamanho]);
    }
  };

  return isMobile ? (
    <div>
      <button onClick={handleClick} className={styles.filtro_button} >
        <SlidersIcon />
      </button>

      {click ? (
        <div className={styles.filtro__mobile}>
          <div className={styles.filtro}>
            <div className={styles.filtro__container}>

              <div className={styles.filtro__top}>
                <span>Filtros</span>
                <button onClick={handleClick}>
                  <CloseIcon />
                </button>
              </div>
              <div className={styles.input__group}>
                <input type="text" placeholder="Pesquisar" onChange={handleSearchChange} value={searchText} />
                <button>
                  <ArrowRightIcon />
                </button>
              </div>

              <div className={styles.filtros}>
                <div className={styles.filtro__cores}>
                  COR

                  <div className={styles.cores}>
                    {cores.map(cor => (
                      <div>
                        <button
                          key={cor.Cor_ID}
                          className={styles.cor + ' ' + `${corSelecionada === cor.Nome ? styles.active : ''}`}
                          onClick={() => handleCorChange(cor.Nome)}>
                          <div style={{ backgroundColor: cor.Codigo_HEX }}></div>
                        </button>
                      </div>
                    ))}

                  </div>
                </div>

                <div className={styles.filtro__tamanhos}>
                  TAMANHO

                  <div className={styles.tamanhos}>
                    {tamanhos.map(tamanho => (
                      <div key={tamanho.Tamanho_ID}>
                        <input
                          type="checkbox"
                          id={tamanho.Tamanho_ID}
                          checked={selectedTamanhos.includes(tamanho.Tamanho)}
                          onChange={() => handleTamanhoChange(tamanho.Tamanho)}
                        />
                        {tamanho.Tamanho}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.filtro__precos}>
                  PREÇO

                  <div className={styles.precos}>
                    <>
                      <div>{'até R$' + filtroPreco}</div>
                      <Slider onChange={onSliderChange} max={500} value={filtroPreco} />
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div>
      ) : (
        null
      )}
    </div>
  ) : (
    <div className={styles.filtro}>
      <div className={styles.filtro__container}>
        <div className={styles.input__group}>
          <input type="text" placeholder="Pesquisar" onChange={handleSearchChange} value={searchText} />
          <button>
            <ArrowRightIcon />
          </button>
        </div>

        <div className={styles.filtros}>
          <div className={styles.filtro__cores}>
            COR

            <div className={styles.cores}>
              {cores.map(cor => (
                <div key={cor.Cor_ID}>
                  <button
                    key={cor.Cor_ID}
                    className={styles.cor + ' ' + `${corSelecionada.Nome === cor.Nome ? styles.active : ''}`}
                    onClick={() => handleCorChange(cor)}>
                    <div style={{ backgroundColor: cor.Codigo_HEX }}></div>
                  </button>
                </div>
              ))}

            </div>
          </div>

          <div className={styles.filtro__tamanhos}>
            TAMANHO

            <div className={styles.tamanhos}>
              {tamanhos.map(tamanho => (
                <div key={tamanho.Tamanho_ID}>
                  <input
                    type="checkbox"
                    id={tamanho.Tamanho_ID}
                    checked={selectedTamanhos.includes(tamanho.Tamanho)}
                    onChange={() => handleTamanhoChange(tamanho.Tamanho)}
                  />
                  {tamanho.Tamanho}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filtro__precos}>
            PREÇO

            <div className={styles.precos}>
              <>
                <div>{'até R$' + filtroPreco}</div>
                <Slider onChange={onSliderChange} max={500} value={filtroPreco} />
              </>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}