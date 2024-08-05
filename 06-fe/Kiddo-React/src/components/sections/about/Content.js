import React, { Component, Fragment } from 'react';
import Abouttext from './Abouttext';
import Brands from './Brands';
import Counter from './Counter';
import Testimonials from './Testimonials';

class Content extends Component {
    render() {
        return (
            <Fragment>
                <Abouttext />
                <Counter />
                <Testimonials />
                <Brands />
            </Fragment>
        );
    }
}

export default Content;