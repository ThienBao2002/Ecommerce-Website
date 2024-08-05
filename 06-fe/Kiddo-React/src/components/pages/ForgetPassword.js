import React, {Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/forget-password/Content';


function ForgetPassword() {
    const pagelocation = 'Đặt lại mật khẩu'; // Đặt tên trang tùy ý
    const navigate = useNavigate()

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
            <Content
                navigate={navigate} />
            <Footer />
        </Fragment>
    );
}

export default ForgetPassword;