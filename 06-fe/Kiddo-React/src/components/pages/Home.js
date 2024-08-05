import React, { Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/home/Content';

const Home = () => {
    const pagelocation = "Trang chủ"; // Local constant within the component

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
};

export default Home;
