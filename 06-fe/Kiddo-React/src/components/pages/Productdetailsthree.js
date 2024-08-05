import React, { Component, Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/product-details-v3/Content';
import Relatedproducts from '../sections/product-details/Relatedproducts';

const pagelocation = "Product Details";

class Productdetailsthree extends Component {
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
                <Breadcrumbs breadcrumb={{ pagename: pagelocation }} />
                <div className="container">
                    <div className="hm-section">
                        <Content detailId={this.props.match.params.id} />
                        <Relatedproducts detailId={this.props.match.params.id} />
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}

export default Productdetailsthree;