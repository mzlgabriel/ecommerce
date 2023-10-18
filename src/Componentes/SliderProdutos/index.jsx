import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import { Produto } from '../Produto';

import 'swiper/css';
import { useProduto } from '../../Contextos/ProdutoContext';
import { Loader } from '../Loader';
import { Loader2 } from '../Loader2';

export function SliderProdutos() {

  const { produtos } = useProduto();

  if(!produtos) {
    return <Loader2 />
  }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      autoplay={{
        delay: 2500,
      }}
      loop={true}
      breakpoints={{
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 50,
        }
      }}
      modules={[Autoplay]}
      className="mySwiper"
    >
      {produtos.map((produto) => {
        let corDefault = produto.cores[0].Cor_ID;
        let imagemDefault = produto.imagens.find((imagem) => imagem.Cor_ID === corDefault).Imagem_URL;

        return (
          <SwiperSlide key={produto.Produto_ID}>
            <Produto id={produto.Produto_ID} slug={produto.Slug} imagem={imagemDefault} nome={produto.Nome} preco={produto.Preco} />
          </SwiperSlide>
        );
      })
      }
    </Swiper>
  )
}