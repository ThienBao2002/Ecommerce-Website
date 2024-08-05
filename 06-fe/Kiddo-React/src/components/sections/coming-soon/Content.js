import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Content extends Component {
    render() {
        return (
            <div className="hm-comingsoon-container">
                <div className="hm-comingsoon-inner">
                    <h1 className="hm-bold-7 hm-comingsoon-title text-uppercase">Comin<span className="hm-text-primary">G</span><br /> Soo<span className="hm-text-primary">n...</span></h1>
                    <h6>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</h6>
                    <Link to="/" className="mt-3 btn btn-shadow btn-border">Go Back Now</Link>
                </div>
            </div>
        );
    }
}

export default Content;