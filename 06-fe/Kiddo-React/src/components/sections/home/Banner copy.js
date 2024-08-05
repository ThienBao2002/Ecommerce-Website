import React, { Component } from 'react';
import banner from "../../../data/banner.json";
import OwlCarousel from 'react-owl-carousel2';
import { Link } from 'react-router-dom';

const settings = {
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 14000,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
        0: { items: 1 },
        600: { items: 1 },
        1000: { items: 1 }
    } 
}; 


class Banner extends Component {
    render() {
        return (
            <OwlCarousel options={settings} className="hm-banner owl-carousel banner-4 arrows-bottom" id="home-banner">
                {/* Data */}
                {banner.map((item, i) => (
                    <div className="owl-slide" key={i} style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/" + item.image + ")" }}>
                        <div className="container">
                            <div className="hm-banner-text">
                                <h1 style={{ fontSize: '3rem', marginBottom: '10px', marginRight:'50px' }} dangerouslySetInnerHTML={{ __html: item.title }} />
                                <p style={{ fontSize: '1rem', marginBottom: '20px', marginRight:'50px' }}> {item.text} </p>
                                {/*<div className="hm-banner-meta">
                                    <div className="hm-product-price">
                                        <span className="hm-discounted-price"> <span className="hm-text-primary">$</span> {new Intl.NumberFormat().format((item.discountprice).toFixed(2))}</span>
                                        <span className="hm-actual-price has-discount">${new Intl.NumberFormat().format((item.newPrice).toFixed(2))}</span>
                                    </div>
                                    <div className="hm-banner-video">
                                        <a className="popup-youtube" href={item.videourl}><i className="flaticon-play-button" /> Play Video</a>
                                    </div>
                                </div>*/}
                                <Link to="/shop-grid-left" className="btn btn-border btn-shadow">Xem thêm</Link>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Data */}
            </OwlCarousel>
        );
    }
}

export default Banner;