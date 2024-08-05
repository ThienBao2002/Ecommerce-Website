import React, { Component, Fragment } from 'react';
import Banner from './Banner';
import Block from './Block';
import Blogs from './Blogs';
import Brands from './Brands';
import Counter from './Counter';
import Cta from './Cta';
import Pagecta from './Pagecta';
import Products from './Products';
import Testimonials from './Testimonials';

class Content extends Component {
    render() {
        return (
            <Fragment>
                <Banner />
                <Block />
                <Counter />
                <Products />
                <Pagecta />
                <Blogs />
                <Testimonials />
                <Brands />
                <Cta />
            </Fragment>
        );
    }
}

export default Content;