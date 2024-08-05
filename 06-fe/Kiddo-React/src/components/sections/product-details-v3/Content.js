import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { getProduct, handleOutofStock } from "../../../helper/shopHelper";
import { getAuthor, Rating } from "../../../helper/helper";
import offers from "../../../data/offers.json";
import { Tab, Nav } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            qty: 1
        }
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }
    increment() {
        this.setState({
            qty: this.state.qty + 1
        });
    }
    decrement() {
        this.setState({
            qty: this.state.qty > 1 ? this.state.qty - 1 : 1
        });
    }
    handleChange(event) {
        this.setState({ qty: event.target.value });
    }
    render() {
        const detailId = this.props.detailId;
        const item = getProduct(detailId);
        return (
            <Fragment>
                <div className="row hm-product-details">
                    <div className="col-xl-5 col-md-6">
                        <div className="hm-product-img-wrapper hm-focused-product">
                            <img src={process.env.PUBLIC_URL + "/" + item.image[0]} alt={item.title} />
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6">
                        <div className="hm-product-content">
                            <h3 className="hm-product-title">{item.title}</h3>
                            <div className="hm-product-topbar">
                                {item.stock === true ?
                                    <span className="stock in-stock">In Stock</span>
                                    :
                                    <span className="stock in-stock text-danger">In Stock</span>
                                }
                                <span className="sku">SKU: <b>{item.sku}</b> </span>
                                <div className="hm-product-rating-container">
                                    <ul className="hm-product-rating">
                                        {Rating(item.rating)}
                                    </ul>
                                    <span>{item.reviews.length} Reviews</span>
                                </div>
                            </div>
                            <p className="hm-product-description">{item.shorttext.slice(0, 130)}</p>
                            <div className="hm-product-variants">
                                <div className="hm-variant-container">
                                    <span>Color: </span>
                                    <div className="hm-product-colors hm-variant-selection">
                                        {/* Data */}
                                        {item.colors.map((color, i) => (
                                            <OverlayTrigger key={i} placement="top" overlay={<Tooltip> {color.title} </Tooltip>} >
                                                <label>
                                                    <input type="radio" name="color" defaultValue={color.color} />
                                                    <span className={"color-" + color.color} />
                                                </label>
                                            </OverlayTrigger>
                                        ))}
                                        {/* Data */}
                                    </div>
                                </div>
                                <div className="hm-variant-container">
                                    <span>Size: </span>
                                    <div className="hm-product-size hm-variant-selection">
                                        {/* Data */}
                                        {item.size.map((size, i) => (
                                            <label className="btn btn-outline-secondary hm-icon-btn" key={i}>
                                                <input type="radio" name="size" defaultValue={size} />
                                                <span>{size}</span>
                                            </label>
                                        ))}
                                        {/* Data */}
                                    </div>
                                </div>
                                <div className="quantity hm-variant-container">
                                    <div >Số lượng: </div>
                                    <div className="hm-variant-selection">
                                        <input type="button" defaultValue="-" className="minus btn btn-outline-secondary hm-qty-btn" onClick={this.decrement} />
                                        <input type="text" id="quantity1" className="input-text qty text" name="quantity" value={this.state.qty} onChange={this.handleChange.bind(this)} readOnly />
                                        <input type="button" defaultValue="+" className="plus btn btn-outline-secondary hm-qty-btn" onClick={this.increment} />
                                    </div>
                                </div>
                            </div>
                            <div className="hm-product-price">
                                <span className="hm-discounted-price hm-text-primary">${new Intl.NumberFormat().format((item.newPrice * (100 - item.discount) / 100).toFixed(2))}</span>
                                {
                                    item.discount > 0 || item.discount !== '' ? <span className="hm-actual-price has-discount">${new Intl.NumberFormat().format((item.newPrice).toFixed(2))}</span> : ''
                                }
                            </div>
                            {/* Add To Cart */}
                            {item.stock === true ?
                                <button type="button" className="btn hm-add-to-cart btn-lg btn btn-primary my-3"><i className="flaticon-shopping-cart" /> Add to cart</button>
                                :
                                <button type="button" className="btn hm-add-to-cart btn-lg btn btn-primary my-3" onClick={handleOutofStock} disabled><i className="flaticon-shopping-cart" /> Add to cart</button>
                            }
                            <div>
                                <span className="btn hm-favorite hm-product-icon hm-hoverable-icon"><i className="fas fa-rss hm-to-right" /></span>
                                {/* Wishlist */}
                                <span className="btn hm-favorite hm-product-icon hm-hoverable-icon"><i className="fas fa-heart hm-to-right" /></span>
                            </div >
                            <Countdown
                                date={Date.now() + 31622400000}
                                renderer={renderer}
                            />
                        </div >
                    </div>
                    <div className="col-xl-3">
                        <ul className="hm-product-perks">
                            {/* Data */}
                            {offers.map((offer, i) => (
                                <li key={i}>
                                    <h6>{offer.title}</h6>
                                    {offer.text > 0 || offer.text !== '' ?
                                        <p>{offer.text}</p>
                                        : ''}
                                    {offer.image > 0 || offer.image !== '' ?
                                        <div className="hm-next-product">
                                            <img src={process.env.PUBLIC_URL + "/" + offer.image} alt={offer.caption} />
                                            <div className="hm-next-product-desc">
                                                <Link to="/shop" className="btn btn-secondary">{offer.caption}</Link>
                                            </div>
                                        </div>
                                        : ''}
                                </li >
                            ))}
                            {/* Data */}
                        </ul>
                    </div>
                </div>
                <div className="hm-product-info">
                    <Tab.Container defaultActiveKey="tab1">
                        <Nav as="ul" varient="tabs" className="nav nav-tabs">
                            <Nav.Item as="li">
                                <Nav.Link eventKey="tab1">Description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="tab2">Additional Info</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="tab3">Reviews ({item.reviews.length})</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="tab1">
                                <div dangerouslySetInnerHTML={{ __html: item.htmltext }} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="tab2">
                                <table className="table table-striped">
                                    <tbody>
                                        {/* Data */}
                                        {item.addinfo.map((info, i) => (
                                            <tr key={i}>
                                                <td>{info.title}</td>
                                                <td>{info.text}</td>
                                            </tr>
                                        ))}
                                        {/* Data */}
                                    </tbody>
                                </table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="tab3">
                                <ul className="hm-reviews">
                                    {/* Data */}
                                    {item.reviews.map((review, i) => (
                                        <li key={i}>
                                            {getAuthor(review.user).map((author, i) => (
                                                <p className="hm-reviewer" key={i}>{author.name}</p>
                                            ))}
                                            <ul className="hm-product-rating">
                                                {Rating(review.rating)}
                                            </ul>
                                            <p>{review.comment}</p>
                                        </li>
                                    ))}
                                    {/* Data */}
                                </ul>

                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container >
                </div >
            </Fragment>
        );
    }
}

export default Content;