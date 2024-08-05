import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Countdown from 'react-countdown';

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <Completionist />;
    } else {
        // Render a countdown
        return <div className="hm-product-countdown" id="countdown-duration">
            <p><span id="days">{days}</span> days </p>
            <p><span id="hours">{hours}</span> hours </p>
            <p><span id="minutes">{minutes}</span> mins </p>
            <p><span id="seconds">{seconds}</span> secs </p>
        </div>;
    }
};

class Pagecta extends Component {
    render() {
        return (
            <div className="hm-cta hm-cta-style2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="hm-cta-img">
                                <img src={process.env.PUBLIC_URL + "/assets/img/banner/banner-2-3.png"} alt="cta" />
                                <div className="hm-cta-price">
                                    <span className="hm-discounted-price"><span className="hm-text-primary">$</span> 699 </span>
                                    <span className="hm-actual-price has-discount">$799</span>
                                </div>
                            </div>
                        </div>
                        <div className="offset-lg-2 col-lg-5">
                            <div className="hm-cta-content-container">
                                <div className="hm-cta-content">
                                    <h3 className="mb-0">Nothing is more important than your family opening soon kiddo</h3>
                                    <Countdown
                                        date={Date.now() + 31622400000}
                                        renderer={renderer}
                                    />
                                    <Link to="/shop" className="btn btn-border btn-shadow btn-border-dark">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Pagecta;