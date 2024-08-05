import React, { useEffect, useState, Fragment } from "react";
import Banner from './Banner';
//import Brandbanner from './Brandbanner';
import Counter from './Counter';
import Featuredproducts from './Featuredproducts';
import VoucherSwiper from "./VoucherSwiper";

import {
  getPromotions as onGetPromotions,
  getProducts as onGetProducts,
  getVouchers as onGetVouchers,
  getCustomerById as onGetCustomerById,
} from "../../../slices/thunks";
import imgBoyProduct from "../../../assets/img/other/imgtext_2_img.png"
import imgGirlProduct from "../../../assets/img/other/girl-fashion.png"

//redux
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
//import { createSelector } from "reselect";

const Content = () => {
  const dispatch = useDispatch();
  const promotions = useSelector((state) => state.Ecommerce.promotions);
  const products = useSelector((state) => state.Ecommerce.products);
  const vouchers = useSelector((state) => state.Ecommerce.vouchers);
  const token = useSelector((state) => state.Session.decodedToken);
  const customer = useSelector((state) => state.Ecommerce.customers);
  const [fetchedPromotions, setFetchedPromotions] = useState(false);

  useEffect(() => {
    if (!fetchedPromotions && (!promotions || !promotions.length)) {
      dispatch(onGetPromotions());
      setFetchedPromotions(true); // Cập nhật trạng thái đã fetch    
    }
    // eslint-disable-next-line
  }, [fetchedPromotions, promotions]);
  
  
  
  useEffect(() => {
    
    if (!products || !products.length) {
      dispatch(onGetProducts());
    }
    if (!vouchers || !vouchers.length) {
      dispatch(onGetVouchers());
    }
    // eslint-disable-next-line
  }, [products,vouchers]); // Phụ thuộc vào dispatch và products
  const [boyProducts, setBoyProducts] = useState();
  useEffect(() => {
    if (products && products.length) {
      const filteredBoyProducts = products.filter(product => product.name.toLowerCase().includes('bé trai'));
      setBoyProducts(filteredBoyProducts);
    }
    
  }, [products]); // Phụ thuộc vào products
  const [girlProducts, setGirlProducts] = useState();
  useEffect(() => {
    if (products && products.length) {
      const filteredGirlProducts = products.filter(product => product.name.toLowerCase().includes('bé gái'));
      setGirlProducts(filteredGirlProducts);
    }

  }, [products]); // Phụ thuộc vào products

  useEffect(() => {
    if (token === null)
      return;
    if (customer || !customer.length || token !== null) {
      dispatch(onGetCustomerById(token.userId));
    }
    console.log("customer", customer);
    // eslint-disable-next-line
  }, [dispatch, token]);



  return (
    <Fragment>
      <ToastContainer closeButton={false} limit={1} />

      <Banner />
      <Counter />
      {console.log(vouchers)}
      <VoucherSwiper
        nameTitleVoucher={"Voucher"}
        vouchersFilter={vouchers
          .filter(voucher => {
            const vipRankName = customer?.vipStatus?.level?.rankName;
            return voucher.voucherType === vipRankName || voucher.voucherType === 'allUsers';
          })
          .slice(0, 10)}
        isHomePage={true}
      />




      {promotions.filter(item => item.products.length > 0).map((item, index) => (
        <Featuredproducts
          key={index}
          imageFeaturedProduct={item.banner[0].url}
          featuredProductList={item.products}
          title={item.name}
          idPromotion={item._id}
        />
      ))}
      {boyProducts && (
        <Featuredproducts
          
          imageFeaturedProduct={imgBoyProduct}
          featuredProductList={boyProducts}
          title={"Thời trang bé trai"}
          idPromotion={null}
        />)}
        {girlProducts && (

        
        <Featuredproducts
          
          imageFeaturedProduct={imgGirlProduct}
          featuredProductList={girlProducts}
          title={"Thời trang bé gái"}
          idPromotion={null}
        />)}
      

      {/*<Video />
        <Brandbanner />
        <Testimonials />
        <Brands />
        <Instagram />
        <Newsletter />*/}
    </Fragment>
  );
}

export default Content;
