import React, { Component } from 'react';

class Abouttext extends Component {
    render() {
        return (
            <div className="hm-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <img src={process.env.PUBLIC_URL + "/assets/img/categories/cat-5.jpg"} alt="about" />
                        </div>
                        <div className="offset-md-1 col-md-6">
                            <div className="hm-about-inner">
                                <p className="hm-highlight hm-text-primary text-uppercase mb-0">Newsletter</p>
                                <h3>On The Other Hand, We Denouce With Rightous And Dislike</h3>
                                <h4>"For 23 years of existence, kiddo has implemented more than 1.700 activities, the total value about 10 milion euros."</h4>
                                <p>We are home to 1,500 students aged 2 to 6 and 100 expert faculty and staff a community representing over 40 different nations.</p>
                                <img src={process.env.PUBLIC_URL + "/assets/img/other/sign.png"} alt="about" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Abouttext;