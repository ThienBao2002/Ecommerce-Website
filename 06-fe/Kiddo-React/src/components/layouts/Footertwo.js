import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footertwo extends Component {
    render() {
        return (
            <footer className="hm-footer footer-dark">
                <div className="hm-footer-top py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="hm-footer-logo">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/logo-white.png"} alt="logo" />
                                </div>
                                <p className="hm-footer-about">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                    the industry's standard dummy text ever since the 1500s,
                                </p>
                            </div>
                            <div className="col-md-3">
                                <ul className="hm-footer-menu">
                                    <li> <Link to="#">Videos</Link> </li>
                                    <li> <Link to="#">Terms &amp; Conditions</Link> </li>
                                    <li> <Link to="#">Site Map</Link> </li>
                                    <li> <Link to="#">Privacy Policy</Link> </li>
                                    <li> <Link to="#">Help</Link> </li>
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <ul className="hm-footer-menu">
                                    <li> <Link to="/about">About Us</Link> </li>
                                    <li> <Link to="/contact">Contact Us</Link> </li>
                                    <li> <Link to="/blog">Blog</Link> </li>
                                    <li> <Link to="/shop">Shop</Link> </li>
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <div className="hm-footer-details">
                                    <Link to="#" className="hm-tel">+123 456 789</Link>
                                    <p> <b className="hm-text-primary">Support: </b>9:00 am - 11:00 pm </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hm-footer-bottom py-4">
                    <div className="container">
                        <div className="hm-footer-bottom-inner">
                            <p className="hm-copyright">Copyright © 2023<span className="hm-text-primary">Website</span>. All rights
                                reserved </p>
                            <ul className="hm-footer-sm">
                                <li> <Link to="#"><i className="fab fa-facebook-f" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-google-plus-g" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-twitter" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-skype" /></Link> </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footertwo;