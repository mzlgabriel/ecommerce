import { toast } from "react-toastify";

export default function useAlerta() {
  async function alertaErro(mensagem) {
    return toast.error(mensagem, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  async function alertaSucesso(mensagem) {
    return toast.success(mensagem, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  return {
    alertaErro,
    alertaSucesso
  };
}
