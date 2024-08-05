import React, {Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/register/Content';

function Register() {
    const pagelocation = 'Đăng ký'; // Đặt tên trang tùy ý

    return (
        <Fragment>
            <Helmet>
                <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
                <meta
                    name="description"
                    content="#"
                />
            </Helmet> 
            <Header />
            <Content />
            <Footer />
        </Fragment>
    );
}

export default Register;