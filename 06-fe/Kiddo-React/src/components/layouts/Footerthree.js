import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footerthree extends Component {
    render() {
        return (
            <footer className="hm-footer">
                <div className="hm-footer-bottom py-4">
                    <div className="container">
                        <div className="hm-footer-bottom-inner">
                            <p className="hm-copyright">Copyright © 2023 <span className="hm-text-primary">Website</span>. All rights reserved </p>
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

export default Footerthree;