import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { Modal } from 'react-responsive-modal';
import { useAuth } from '../../Contextos/AuthContext';

import styles from './styles.module.scss';
import 'react-responsive-modal/styles.css';
import { Navigate, useLocation } from 'react-router-dom';

export function Login() {
  const { login, registro, autenticado } = useAuth();
  const [open, setOpen] = useState(false);

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
  } = useForm({
    mode: "onBlur",
  });

  const registerWithMask = useHookFormMask(register2);

  const EnviaLogin = async (data) => {
    await login(data.email, data.senha);
  }

  const EnviaRegistro = async (data) => {
    data.cpf = data.cpf.replace(/\D/g, '');
    await registro(data.nome, data.cpf, data.email_registro, data.senha_registro);
  }

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  let email_registro = watch2('email_registro');
  let location = useLocation();

  return autenticado ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <>
      <div className={styles.login}>
        <div className={styles.login__flex}>
          <form key={1} className={styles.login__form} onSubmit={handleSubmit(EnviaLogin)}>
            <h2>Já possui uma conta?</h2>

            <div className={styles.login__input_grupo}>
              <label>Seu e-mail</label>
              <input type="email" placeholder="Digite seu e-mail aqui..." {...register('email', { required: 'O e-mail é obrigatorio.' })} />
            </div>

            <div className={styles.login__input_grupo}>
              <label>Sua senha</label>
              <input type="password" placeholder="Digite sua senha aqui..." {...register('senha', { required: 'A senha é obrigatoria.' })} />
            </div>

            <div className={styles.login__checkbox}>
              <input type="checkbox" /> Lembrar meus dados
            </div>

            <div className={styles.login__botao}>
              <button type='submit'>Entrar</button>
            </div>

            <div className={styles.login__recuperacao_senha}>
              <p>Esqueci minha senha</p>
            </div>
          </form>

          <div className={styles.linha}></div>

          <div className={styles.login__registrar}>
            <h2>Ainda não possui uma conta?</h2>
            <p>Está esperando o que?  Faça sua conta e tenha diversos beneficios</p>
            <ul>
              <li>- Descontos exclusivos</li>
              <li>- Fique por dentro de todas as novidades</li>
              <li>- Praticidade e agilidade em compras futuras</li>
            </ul>
            <div className={styles.login__input_grupo}>
              <label>Seu e-mail</label>
              <input type="email" placeholder="Digite seu e-mail aqui..." {...register2('email_registro', { required: 'O email é obrigatorio.' })} />
            </div>
            <div className={styles.login__botao}>
              <button onClick={email_registro ? onOpenModal : null}>Continuar</button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <form key={2} className={styles.formModal} onSubmit={handleSubmit2(EnviaRegistro)}>
          <div className={styles.registrar}>
            <div className={styles.login__input_grupo}>
              <label>Digite seu nome completo <span className={styles.obrigatorio}>*</span></label>
              <input type="text" placeholder="seu nome aqui..." {...register2('nome', { required: 'O nome é obrigatorio.' })} />
            </div>
            <div className={styles.login__input_grupo}>
              <label>Digite seu CPF <span className={styles.obrigatorio}>*</span></label>
              <input placeholder="seu cpf aqui..." {...registerWithMask('cpf', ['999.999.999-99'], { required: 'O cpf é obrigatorio.' })} />
            </div>
            <div className={styles.login__input_grupo}>
              <label>Digite sua senha <span className={styles.obrigatorio}>*</span></label>
              <input type="password" placeholder="sua senha aqui..." {...register2('senha_registro', { required: 'A senha é obrigatoria.' })} />
            </div>
            <div className={styles.login__botao}>
              <button type='submit'>Registrar</button>
            </div>
          </div>
          <div className={styles.termos}>
            <input type="checkbox" name="" id="" {...register2('checkbox', { required: true })} />
            <p>Li e estou de acordo com as <span>políticas da empresa</span> e <span>políticas de privacidade</span>. <span className={styles.obrigatorio}>*</span> </p>
          </div>
        </form>
      </Modal>
    </>
  )
}