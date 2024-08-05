import React, { Component } from 'react';

class Newsletter extends Component {
    render() {
        return (
            <div className="hm-section hm-newsletter hm-newsletter-home1">
                <div className="container">
                    <div className="row">
                        <div className="offset-md-5 col-md-7">
                            <div className="hm-newsletter-container">
                                <div className="hm-newsletter-inner">
                                    <p className="hm-highlight">Newsletter</p>
                                    <h5>Get 30% Discount off</h5>
                                    <p>Nam sed felis at eros blandit ultirces et quis quam. In sit amet molestie lectus.</p>
                                </div>
                                <form className="hm-form hm-form-newsletter">
                                    <div className="w-100">
                                        <input type="text" placeholder="Your Email" className="newsletter w-100" id="newsLetter" name="newsLetter" required />
                                        <input type="submit" className="hm-newsletter-btn" name="newsLetter-submit" defaultValue="Subscribe" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Newsletter;