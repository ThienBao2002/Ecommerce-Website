import React, { Component, Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/cart-v3/Content';

const pagelocation = "Giỏ hàng";

class Cart extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet> 
                <Header/>
                <Content/>
                <Footer/>
            </Fragment>
        );
    }
}

export default Cart;