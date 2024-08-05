import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Content extends Component {
    render() {
        return (
            <div className="hm-404-container">
                <div className="hm-circle hm-circle-xs hm-circle-1 hm-bg-primary" />
                <div className="hm-404-inner">
                    <h1 className="hm-bold-8 hm-404-title">4<span className="hm-text-primary">0</span>4.</h1>
                    <h6>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</h6>
                    <Link to="/" className="mt-3 btn btn-shadow btn-border">Go Back Now</Link>
                </div>
            </div>
        );
    }
}

export default Content;