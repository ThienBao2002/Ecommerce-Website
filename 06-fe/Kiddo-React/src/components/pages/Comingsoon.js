import React, { Component, Fragment } from 'react';
import {Helmet} from "react-helmet";
import Content from '../sections/coming-soon/Content';

const pagelocation = "Coming Soon";

class Comingsoon extends Component {
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
                <Content/>
            </Fragment>
        );
    }
}

export default Comingsoon;