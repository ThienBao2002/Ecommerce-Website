import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { handleOutofStock } from "../../../helper/shopHelper";
import shopblock from "../../../data/shop/shop.json";
import Quickview from '../../layouts/Quickview';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalshow: false,
            lastActiveBox: -1
        };
        this.modalShow = this.modalShow.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }
    // Modal
    modalShow(index) {
        this.setState({ modalshow: true, lastActiveBox: index });
    }
    modalClose() {
        this.setState({ modalshow: false });
    }
    render() {
        return (
            <div className="hm-section pt-0">
                <div className="container-fluid">
                    <div className="hm-section-title">
                        <h2>Featured Items</h2>
                        <p>Nunc mauris enim, pretium quis orci eget</p>
                    </div>
                    <div className="hm-products">
                        <div className="row">
                            {/* Product */}
                            {shopblock.slice(0, 12).map((item, i) => (
                                <div key={i} className="col-xl-2 col-lg-3 col-md-3 col-sm-6">
                                    <div className="hm-product">
                                        <Link to={"/product-details/" + item.id} className="hm-product-img-wrapper p-0">
                                            <div className="hm-product-badges">
                                                {item.featured === true ?
                                                    <span className="flaticon-fire hot" />
                                                    : ''}
                                                {item.discount > 0 || item.discount !== '' ?
                                                    <span className="sale">{item.discount}%</span>
                                                    : ''}
                                            </div>
                                            <img src={process.env.PUBLIC_URL + "/" + item.image[0]} alt={item.title} />
                                        </Link>
                                        <div className="hm-product-content">
                                            <h3 className="hm-product-name"><Link to={"/product-details/" + item.id}>{item.title}</Link>
                                            </h3>
                                            <div className="hm-product-controls">
                                                <div className="hm-product-atc">
                                                    {/* Cart */}
                                                    {item.stock === true ?
                                                        <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                                                            <i className="fas fa-shopping-cart hm-to-right" />
                                                        </span>
                                                        :
                                                        <span className="btn hm-favorite hm-product-icon hm-hoverable-icon" onClick={handleOutofStock}>
                                                            <i className="fas fa-shopping-cart hm-to-right" />
                                                        </span>
                                                    }
                                                    {/* Wishlist */}
                                                    <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                                                        <i className="fas fa-heart hm-to-right" />
                                                    </span>
                                                    <span className="btn hm-favorite hm-product-icon hm-hoverable-icon has-quicklook" onClick={(e) => this.modalShow(item.id)}><i className="fas fa-eye hm-to-right" /></span>
                                                </div>
                                            </div>
                                            <div className="hm-product-meta">
                                                <div className="hm-product-price">
                                                    <span className="hm-discounted-price hm-text-primary">${new Intl.NumberFormat().format((item.newPrice * (100 - item.discount) / 100).toFixed(2))}</span>
                                                    {item.discount > 0 || item.discount !== '' ?
                                                        <span className="hm-actual-price has-discount">${new Intl.NumberFormat().format((item.newPrice).toFixed(2))}</span>
                                                        : ''}
                                                </div>
                                                <div className="hm-product-colors">
                                                    {/* Data */}
                                                    {item.colors.map((color, i) => (
                                                        <OverlayTrigger key={i} placement="top" overlay={<Tooltip> {color.title} </Tooltip>} >
                                                            <span className={"color-" + color.color} key={i} />
                                                        </OverlayTrigger>
                                                    ))}
                                                    {/* Data */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Product */}
                            {/* Modal (Quick View) */}
                            <Modal show={this.state.modalshow} className="hm-quicklook" onHide={this.modalClose} aria-labelledby="contained-modal-title-vcenter" centered>
                                <Modal.Body className="hm-quicklook-body p-0">
                                    <button type="button" className="close hm-close-quicklook" onClick={this.modalClose}>
                                        <span />
                                        <span />
                                    </button>
                                    <Quickview productId={this.state.lastActiveBox} />
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Products;