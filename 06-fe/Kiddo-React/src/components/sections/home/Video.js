import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Video extends Component {
    render() {
        return (
            <div className="hm-cta">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="hm-cta-img">
                                <img src={process.env.PUBLIC_URL + "/assets/img/banner/cta.png"} alt="img" />
                                <div className="hm-cta-price">
                                    <span className="hm-discounted-price"><span className="hm-text-primary">$</span> 699 </span>
                                    <span className="hm-actual-price has-discount">$799</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="hm-player hm-cta-player">
                                <a rel={"external"} href={"https://www.youtube.com/watch?v=KH1pcNUTa6U"} className="popup-youtube hm-player-trigger hm-pulse">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <i className="fas fa-play hm-text-primary" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="hm-cta-content-container">
                                <div className="hm-cta-content">
                                    <h3>We put a little magic into all our kids</h3>
                                    <p>Fun and educational programs for children aged 2 to 6</p>
                                    <Link to="/shop-grid-left" className="btn btn-border btn-shadow">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Video;