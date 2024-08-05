import React,{ useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick-theme.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import {
  getProducts as onGetProducts,
  getPromotions as onGetPromotions,
} from "../../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";

const Slidewithindicator = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.Ecommerce.products);
  const promotions = useSelector((state) => state.Ecommerce.promotions);
  const [fetchedPromotions, setFetchedPromotions] = useState(false);
  useEffect(() => {
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
    if (!fetchedPromotions && (!promotions || !promotions.length)) {
      dispatch(onGetPromotions());
      setFetchedPromotions(true); // Cập nhật trạng thái đã fetch
    }
    // eslint-disable-next-line
  }, [fetchedPromotions, promotions, products]);

  const items = promotions.map((item, index) => ({
    key: index,  // Khóa bắt đầu từ 0
    src: item.banner[0].url,
    id: item._id,
    
  }));
  return (
    <React.Fragment>
  <div>
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
      autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      className="mySwiper swiper navigation-swiper rounded"
    >
      {items.map((item) => (
        <SwiperSlide key={item.key}>
          <Link to={`/shop-grid-left-promotion/${item.id}`}>
            <img src={item.src} alt={item.altText} style={{ width: '100%', maxHeight: '700px' }} />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</React.Fragment>
  );
};

export default Slidewithindicator;
