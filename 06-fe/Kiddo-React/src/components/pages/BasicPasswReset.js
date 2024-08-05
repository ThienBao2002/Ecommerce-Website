import React, {Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/basic-passw-reset/Content';


function BasicPasswReset() {
    const pagelocation = 'Đặt lại mật khẩu'; // Đặt tên trang tùy ý
    const navigate = useNavigate()
    const {id}=useParams();

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
                id={id}
                navigate={navigate} />
            <Footer />
        </Fragment>
    );
}

export default BasicPasswReset;