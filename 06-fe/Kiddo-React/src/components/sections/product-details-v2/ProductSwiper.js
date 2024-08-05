import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css';
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Card, CardBody } from 'reactstrap';
import ProductItem from '../home/ProductItem';

const ProductSwiper = ({ nameTitle,products, tog_ShowQuickView }) => {
  const swiperRef = useRef(null);

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <Card>
    <CardBody>
      <h4 className="card-title mb-0">{nameTitle}</h4>
        <Swiper slidesPerView={1}
          spaceBetween={10}
          slidesPerGroup={4}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
        }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          loop={true}
          modules={[Pagination, Autoplay, Navigation]}
          className="mySwiper swiper responsive-swiper rounded gallery-light pb-4"
          onSwiper={(swiper) => {
            console.log("Swiper instance:", swiper);
            swiperRef.current = swiper;
          }}

        >
        <div className="swiper-wrapper">
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <ProductItem
                  item={item}
                  tog_ShowQuickView={tog_ShowQuickView}          
                />
              </div>
            </SwiperSlide>
          ))}
        </div>
        <div className="swiper-pagination swiper-pagination-dark"></div>
      </Swiper>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
    </CardBody>
  </Card>
  );
};

export default ProductSwiper;
