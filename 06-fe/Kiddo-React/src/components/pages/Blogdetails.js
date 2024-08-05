import React, { Component, Fragment } from 'react';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Breadcrumbs from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/blog-details/Content';

const pagelocation = "Blog Details";

class Blogdetails extends Component {
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
                <Content detailId={this.props.match.params.id}/>
                <Footer/>
            </Fragment>
        );
    }
}

export default Blogdetails;