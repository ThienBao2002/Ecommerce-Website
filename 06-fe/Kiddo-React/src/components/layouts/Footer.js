import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <footer className="hm-footer">
                <div className="hm-footer-top py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="hm-footer-logo">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="logo" />
                                </div>
                                <p className="hm-footer-about">
                                    Công ty TNHH Kiddo <br/>
                                    Thành viên của Tập đoàn UTE Group
                                </p>
                            </div>
                            <div className="col-md-3">
                                <ul className="hm-footer-menu">
                                    <li> <Link to="#">Videos</Link> </li>
                                    <li> <Link to="#">Điều khoản &amp; Điều kiện</Link> </li>
                                    <li> <Link to="#">Site Map</Link> </li>
                                    <li> <Link to="#">Chính sách bảo mật</Link> </li>
                                    <li> <Link to="#">Trợ giúp</Link> </li>
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <ul className="hm-footer-menu">
                                    <li> <Link to="#">Về chúng tôi</Link> </li>
                                    <li> <Link to="#">Liên hệ</Link> </li>
                                    <li> <Link to="#">Bài viết</Link> </li>
                                    <li> <Link to="#">Sản phẩm</Link> </li>
                                </ul>
                            </div>
                            <div className="col-md-3">
                                <div className="hm-footer-details">
                                    <Link to="#" className="hm-tel">+123 456 789</Link>
                                    <p> <b className="hm-text-primary">Thời gian làm việc: </b>9:00 am - 11:00 pm </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hm-footer-bottom py-4">
                    <div className="container">
                        <div className="hm-footer-bottom-inner">
                            <p className="hm-copyright">© 2023 <span className="hm-text-primary">Kiddo</span>. Tất cả bản quyền được bảo lưu </p>
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

export default Footer;