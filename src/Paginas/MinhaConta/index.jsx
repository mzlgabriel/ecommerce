import styles from './styles.module.scss';
import { useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { useAuth } from '../../Contextos/AuthContext';
import { Loader } from '../../Componentes/Loader';
import Modal from 'react-responsive-modal';
import { useState } from 'react';
import api from '../../Servicos/api';
import { useEffect } from 'react';
import { Loader2 } from '../../Componentes/Loader2';
import useAlerta from '../../Hooks/UseAlerta';

export function MinhaConta() {

  const { alertaErro, alertaSucesso } = useAlerta();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [end, setEnd] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [cep, setCep] = useState('');
  const [cep2, setCep2] = useState('');
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

  useEffect(() => {
    let novoCep = cep.replace(/\D/g, '');

    if (novoCep.length === 8) {
      const fetchData = async (cep) => {
        try {
          const { data } = await api.get('correios/cep/' + cep);
          console.log(data);
          setValue('rua', data.CEP.logradouro);
          setValue('bairro', data.CEP.bairro)
          setValue('cidade', data.CEP.localidade)
          setValue('estado', data.CEP.uf)
        } catch (error) {
          alertaErro(error.response.data.Mensagem)
        }
      };

      fetchData(novoCep);
    }
  }, [cep])

  useEffect(() => {
    let novoCep = cep2.replace(/\D/g, '');

    if (novoCep.length === 8) {
      const fetchData = async (cep) => {
        try {
          const { data } = await api.get('correios/cep/' + cep);
          console.log(data);
          setValue3('rua', data.CEP.logradouro);
          setValue3('bairro', data.CEP.bairro)
          setValue3('cidade', data.CEP.localidade)
          setValue3('estado', data.CEP.uf)
        } catch (error) {
          alertaErro(error.response.data.Mensagem)
        }
      };

      fetchData(novoCep);
    }
  }, [cep2])

  useEffect(() => {
    const fetchData = async () => {
      setCarregando(true);
      const token = localStorage.getItem('Token');

      if (token) {
        api.defaults.headers.Authorization = token;

        try {
          const { data } = await api.get('/cliente');
          console.log('data', data);
          setUser(data.Cliente);

          setCarregando(false);
        } catch (error) {
          console.log(error);
          setCarregando(false);
        } finally {
          setCarregando(false);
        }
      } else {
        setCarregando(false);
      }
    };

    fetchData();
  }, [end]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    watch: watch2,
    setValue,
    reset
  } = useForm({
    mode: "onChange",
  });

  const {
    register: register3,
    formState: { errors: errors3 },
    handleSubmit: handleSubmit3,
    watch: watch3,
    setValue: setValue3,
    reset: reset3,
  } = useForm({
    mode: "onChange",
  });

  const registerWithMask = useHookFormMask(register);
  const registerWithMask2 = useHookFormMask(register2);
  const registerWithMask3 = useHookFormMask(register3);

  if (!user) {
    return <Loader />
  }

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => { setOpen(false); reset(); }
  const onOpenModal2 = () => setOpen2(true);
  const onCloseModal2 = () => { setOpen2(false); reset3(); };

  const AlterarDados = async (data) => {
    try {
      setCarregando(true);
      const { data: response } = await api.patch('/cliente', {
        Nome: data.nome,
        CPF: data.cpf,
        Data_de_Nascimento: data.nascimento,
        Telefone: data.telefone
      });

      await RecuperarEnderecos();
      setCarregando(false);
      alertaSucesso('Dados alterados com sucesso!')
    } catch (error) {
      setCarregando(false);
      alertaErro("Ocorreu um erro ao alterar os dados.")
    }
  }

  const AtualizaSelecionado = async (e, endereco) => {
    console.log(endereco);
    try {
      const { data } = await api.patch('cliente/endereco/' + endereco.Endereco_ID, {
        Rua: endereco.Rua,
        Numero: endereco.Numero,
        Bairro: endereco.Bairro,
        Cidade: endereco.Cidade,
        Estado: endereco.Estado,
        CEP: endereco.CEP,
        Padrao: true
      })

      setEnd(data);
      alertaSucesso('Endereço padrão atualizado com sucesso!')
    } catch (error) {
      alertaErro("Ocorreu um erro ao atualizar o endereço padrão.")
      setEnd(error)
    }
  }

  const CadastraEndereco = async (data) => {

    data.cep = data.cep.replace(/\D/g, '');

    try {
      const response = await api.post('cliente/endereco', {
        Rua: data.rua,
        Numero: data.numero,
        Bairro: data.bairro,
        Cidade: data.cidade,
        Estado: data.estado,
        CEP: data.cep,
        Padrao: true
      });

      alertaSucesso('Endereço cadastrado com sucesso!')
      onCloseModal();
      reset();
      setEnd(data);
    } catch (error) {
      alertaErro(error.response.data.Mensagem)
    }
  }

  const EditarEndereco = (endereco) => {
    reset3();
    setEnderecoSelecionado(endereco)
    console.log(endereco);
    onOpenModal2()
  }

  const ExcluirEndereco = async () => {
    try {
      setCarregando(true);
      onCloseModal2();
      const { data } = await api.delete('cliente/endereco/' + enderecoSelecionado.Endereco_ID);
      await RecuperarEnderecos()
      alertaSucesso('Endereço excluido com sucesso!')
      setCarregando(false);
    } catch (error) {
      setCarregando(false);
      alertaErro("Ocorreu um erro ao excluir o endereço. Tente novamente mais tarde.")
    }
  }

  const EditarEnderecoBtn = async (data) => {
    try {
      let novoCep = data.cep.replace(/\D/g, '');
      setCarregando(true);
      onCloseModal2();

      const response = await api.patch('cliente/endereco/' + enderecoSelecionado.Endereco_ID, {
        Rua: data.rua,
        Numero: data.numero,
        Bairro: data.bairro,
        Cidade: data.cidade,
        Estado: data.estado,
        CEP: novoCep,
        Padrao: true
      });
      await RecuperarEnderecos()
      setCarregando(false);
    } catch (error) {
      setCarregando(false);
    }
  }

  const handleModal = (e) => {
    e.preventDefault();
  }

  const RecuperarEnderecos = async () => {
    try {
      setCarregando(true);
      const { data } = await api.get('/cliente');

      setUser(data.Cliente);
      setCarregando(false);
    } catch (error) {
      setCarregando(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <div className={styles.minhaconta}>
        <form key={1} className={styles.dados} onSubmit={handleSubmit(AlterarDados)}>
          <h4>Dados</h4>

          <div className={styles.dados__container}>
            <div className={styles.grupo}>
              <div className={styles.input__grupo}>
                <label htmlFor="nome">Nome <span>*</span></label>
                <input type="text" id="nome" defaultValue={user.Nome} {...register('nome', { required: 'O nome é obrigatorio.' })} />
              </div>
              <div className={styles.input__grupo}>
                <label htmlFor="cpf">CPF <span>*</span></label>
                <input type="text" id="cpf" defaultValue={user.CPF} {...registerWithMask('cpf', ['999.999.999-99'], { required: 'O cpf é obrigatorio.' })} />
              </div>
            </div>

            <div className={styles.grupo}>
              <div className={styles.input__grupo}>
                <label htmlFor="data_nascimento">Data de Nascimento</label>
                <input type="text" id="data_nascimento" defaultValue={user.Data_de_Nascimento ? user.Data_de_Nascimento : ""} {...registerWithMask('nascimento', ['99/99/9999'])} />
              </div>
              <div className={styles.input__grupo}>
                <label htmlFor="telefone">Telefone celular</label>
                <input type="text" id="telefone" defaultValue={user.Telefone ? user.Telefone : ""} {...registerWithMask('telefone', ['(99) 99999-9999'])} />
              </div>
            </div>

            <div className={styles.botao}>
              <button type="submit">Salvar alterações</button>
            </div>
          </div>
        </form>

        <div className={styles.minhaconta_enderecos}>
          <h4>Endereços</h4>
          {user && user.enderecos && user.enderecos.length > 0 ? (
            <>
              <div className={styles.enderecos}>
                {carregando ? (
                  <div className={styles.carregando}>
                    <Loader />
                  </div>
                ) : null}
                {user.enderecos
                  .sort((a, b) => (a.Padrao === b.Padrao) ? 0 : a.Padrao ? -1 : 1)
                  .map((endereco) => (
                    <label key={endereco.Endereco_ID} htmlFor={endereco.Endereco_ID}>
                      <div className={`${styles.endereco} ${endereco.Padrao && styles.active}`} key={endereco.Endereco_ID}>
                        <div>
                          <input
                            type="radio"
                            name={endereco.Endereco_ID}
                            id={endereco.Endereco_ID}
                            checked={endereco.Padrao}
                            onChange={e => AtualizaSelecionado(e, endereco)}
                          />
                        </div>
                        <div>
                          <h3>{endereco.Rua} - {endereco.Numero}</h3>
                          <h4>{endereco.Bairro} - {endereco.Cidade}, {endereco.Estado} - {endereco.CEP}</h4>
                          <div className={styles.acoes}>
                            <button onClick={() => EditarEndereco(endereco)}>Editar</button>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}

              </div>
              <div className={styles.botao}>
                <button onClick={onOpenModal}>Cadastrar um novo endereço</button>
              </div>
            </>
          ) : (
            <>
              <p>Nenhum endereço encontrado.</p>
              <div className={styles.botao}>
                <button onClick={onOpenModal}>Cadastrar um novo endereço</button>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <div className={styles.cadastrarendereco}>
          <form key={2} className={styles.dados} onSubmit={handleSubmit2(CadastraEndereco)}>
            <h4>Cadastrar endereço</h4>

            <div className={styles.dados__container}>
              <div className={styles.grupo}>
                <div className={styles.input__grupo}>
                  <label htmlFor="cep">CEP <span>*</span></label>
                  <input type="text" id="cep" {...registerWithMask2('cep', ['99.999-999'], { required: 'O cep é obrigatorio.', onChange: (e) => { setCep(e.target.value) } })} />
                </div>
                <div className={styles.input__grupo}>
                  <label htmlFor="rua">Rua <span>*</span></label>
                  <input type="text" id="rua" {...register2('rua', { required: 'A rua é obrigatoria.' })} />
                </div>
              </div>
              <div className={styles.grupo}>
                <div className={styles.input__grupo}>
                  <label htmlFor="numero">Número <span>*</span></label>
                  <input type="text" id="numero" {...register2('numero', { required: 'O número é obrigatorio.' })} />
                </div>
                <div className={styles.input__grupo}>
                  <label htmlFor="bairro">Bairro <span>*</span></label>
                  <input type="text" id="bairro" {...register2('bairro', { required: 'O bairro é obrigatorio.' })} />
                </div>
              </div>
              <div className={styles.grupo}>
                <div className={styles.input__grupo}>
                  <label htmlFor="cidade">Cidade <span>*</span></label>
                  <input type="text" id="cidade" {...register2('cidade', { required: 'A Cidade é obrigatoria.' })} />
                </div>
                <div className={styles.input__grupo}>
                  <label htmlFor="estado">Estado <span>*</span></label>
                  <input type="text" id="estado" {...register2('estado', { required: 'O estado é obrigatorio.' })} />
                </div>
              </div>

              <div className={styles.botao}>
                <button type="submit">Cadastrar</button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {enderecoSelecionado && (
        <Modal open={open2} onClose={onCloseModal2} center>
          <div className={styles.cadastrarendereco}>
            <form key={3} className={styles.dados} onSubmit={handleSubmit3(EditarEnderecoBtn)}>
              <h4>Editar endereço</h4>
              <div className={styles.dados__container}>
                <div className={styles.grupo}>
                  <div className={styles.input__grupo}>
                    <label htmlFor="cep">CEP <span>*</span></label>
                    <input type="text" id="cep" defaultValue={enderecoSelecionado.CEP} {...registerWithMask3('cep', ['99.999-999'], { required: 'O cep é obrigatorio.', onChange: (e) => { setCep2(e.target.value) } })} />
                  </div>
                  {console.log(enderecoSelecionado)}
                  <div className={styles.input__grupo}>
                    <label htmlFor="rua">Rua <span>*</span></label>
                    <input type="text" id="rua" defaultValue={enderecoSelecionado.Rua} {...register3('rua', { required: 'A rua é obrigatoria.' })} />
                  </div>
                </div>
                <div className={styles.grupo}>
                  <div className={styles.input__grupo}>
                    <label htmlFor="numero">Número <span>*</span></label>
                    <input type="text" id="numero" defaultValue={enderecoSelecionado.Numero} {...register3('numero', { required: 'O número é obrigatorio.' })} />
                  </div>
                  <div className={styles.input__grupo}>
                    <label htmlFor="bairro">Bairro <span>*</span></label>
                    <input type="text" id="bairro" defaultValue={enderecoSelecionado.Bairro} {...register3('bairro', { required: 'O bairro é obrigatorio.' })} />
                  </div>
                </div>
                <div className={styles.grupo}>
                  <div className={styles.input__grupo}>
                    <label htmlFor="cidade">Cidade <span>*</span></label>
                    <input type="text" id="cidade" defaultValue={enderecoSelecionado.Cidade} {...register3('cidade', { required: 'A Cidade é obrigatoria.' })} />
                  </div>
                  <div className={styles.input__grupo}>
                    <label htmlFor="estado">Estado <span>*</span></label>
                    <input type="text" id="estado" defaultValue={enderecoSelecionado.Estado} {...register3('estado', { required: 'O estado é obrigatorio.' })} />
                  </div>
                </div>

                <div className={styles.botao}>
                  <button onClick={() => ExcluirEndereco()}>Excluir</button>
                  <button type='submit'>Editar</button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  )
}