import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/shop-grid-left/Content';
import Breadcrumbs from '../layouts/Breadcrumbs';
import {
    getProducts as onGetProducts,
    getPromotions as onGetPromotions,
    getPromotionById as onGetPromotionById
} from "../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
const pagelocation = "Sản phẩm";

const Shopgridleft = () => {
    const dispatch = useDispatch();
    const { id: promotionId } = useParams();
    const { categoryNameSlug } = useParams();
    const { brandNameSlug } = useParams();
    const products = useSelector((state) => state.Ecommerce.products);
    const promotions = useSelector((state) => state.Ecommerce.promotions);
    const promotionDetails = useSelector((state) => state.Ecommerce.promotionDetails);

    useEffect(() => {
        if (products && !products.length) {
            dispatch(onGetProducts());
        }
        if (promotions && !promotions.length) {
            dispatch(onGetPromotions());
        }
        if (promotionId) {
            dispatch(onGetPromotionById(promotionId));
        }
        // eslint-disable-next-line
    }, [promotions, products, promotionId]);


    const isPromotionPage = Boolean(promotionId && promotionDetails);
    const isCategoryPage = Boolean(categoryNameSlug);
    const isBrandPage = Boolean(brandNameSlug);

    return (
        <Fragment>
            <Helmet>
                <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
                <meta name="description" content="#" />
            </Helmet>
            <Header />
            <Breadcrumbs
                breadcrumb={isPromotionPage ? { pagename: promotionDetails.name } : { pagename: 'Sản phẩm' }}
                banner={isPromotionPage ? promotionDetails.banner : undefined}
            />
            <Content
                promotionId={isPromotionPage ? promotionId : undefined}
                categoryNameSlug={isCategoryPage? categoryNameSlug:undefined}
                brandNameSlug={isBrandPage? brandNameSlug:undefined}
            />
            <Footer />
        </Fragment>
    );
}

export default Shopgridleft;