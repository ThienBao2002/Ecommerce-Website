import React, { Component, Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footertwo';
import Content from '../sections/home-v2/Content';

const pagelocation = "Homepage";

class Hometwo extends Component {
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

export default Hometwo;