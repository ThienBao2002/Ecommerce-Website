import React from 'react';
import Contacthelper from '../../../helper/Contacthelper';
import ReCAPTCHA from "react-google-recaptcha";

class Content extends Contacthelper {
    render() {
        return (
            <div className="container">
                <div className="hm-section">
                    <iframe id="map" title="map" src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1318.50865955677!2d106.85334057986267!3d10.960886593605556!3m2!1i1024!2i768!4f13.1!5e1!3m2!1svi!2s!4v1700799251865!5m2!1svi!2s" />
                    <div className="row mt-5">
                        <div className="col-xl-8 col-lg-8">
                            <div className="hm-contact-title">
                                <h5>Đóng góp ý kiến</h5> 
                            </div>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className="form-row">
                                    <div className="form-group col-xl-6 col-lg-6">
                                        <label>Họ và tên:</label>
                                        <input type="text" className="form-control" placeholder="Your Full Name" name="name" value={this.state.name} onChange={this.onNameChange.bind(this)} required />
                                    </div>
                                    <div className="form-group col-xl-6 col-lg-6">
                                        <label>Email:</label>
                                        <input type="email" className="form-control" placeholder="Your Email Address" name="email" value={this.state.email} onChange={this.onEmailChange.bind(this)} required />
                                    </div>
                                    <div className="form-group col-xl-6 col-lg-6">
                                        <label>Số điện thoại:</label>
                                        <input type="text" className="form-control" placeholder="Your Phone No." name="phone" value={this.state.phone} onChange={this.onPhoneChange.bind(this)} required />
                                    </div>
                                    <div className="form-group col-xl-6 col-lg-6">
                                        <label>Tiêu đề:</label>
                                        <input type="text" className="form-control" placeholder="Your Subject" name="subject" value={this.state.subject} onChange={this.onSubjectChange.bind(this)} required />
                                    </div>
                                    <div className="form-group col-xl-12 col-lg-12">
                                        <label>Nội dung:</label>
                                        <textarea className="form-control" rows={3} name="message" value={this.state.message} onChange={this.onMessageChange.bind(this)} required />
                                    </div>
                                    <button type="submit" className="btn btn-md btn-primary text-uppercase mb-5">Gửi</button>
                                    <ReCAPTCHA
                                        sitekey="6LcAzqobAAAAAPt22IB9Nj6yWNMLxXuE5XkWu8ER"
                                        onChange={this.reCaptchaLoaded.bind(this)}
                                        size="invisible"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                            <div className="hm-contact-title">
                                <h5>Thông tin liên hệ</h5>
                            </div>
                            <div className="hm-contact-info">
                                <p>Hệ thống Kiddo - Thời trang trẻ em luôn sẵn hàng hỗ trợ quý khách!</p>
                                <ul className="hm-contact-list">
                                    <li><i className="fas fa-map-marker-alt" /> <span>Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Tp. Hồ Chí Minh</span></li>
                                    <li><i className="fas fa-envelope" /> <span>khaiHASO123@example.come</span></li>
                                    <li><i className="fas fa-phone" /> <span>(+11)8095423634</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;