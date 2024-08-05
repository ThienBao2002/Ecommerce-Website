import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import wishlistItems from "../../../data/shop/shop.json";
import { handleDeleteFromWishlist } from "../../../helper/shopHelper";

class Content extends Component {
    render() {
        return (
            <div className="container">
                <div className="hm-section">
                    <div className="w-100 table-responsive mb-4">
                        <table className="table hm-cart-table">
                            <thead>
                                <tr>
                                    <th />
                                    <th scope="col" className="product-name">Sản phẩm</th>
                                    <th scope="col" className="product-qty">Tình trạng kho</th>
                                    <th scope="col" className="product-price">Giá</th>
                                    <th scope="col" className="product-price">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Data */}
                                {wishlistItems.slice(0, 5).map((item, i) => (
                                    <tr key={i}>
                                        <td className="product-remove hm-align">
                                            <Link to="#" onClick={handleDeleteFromWishlist}><i className="fas fa-times" /></Link>
                                        </td>
                                        <td data-title="Product" className="has-title">
                                            <div className="product-thumbnail">
                                                <img src={process.env.PUBLIC_URL + "/" + item.image[0]} alt={item.title} />
                                            </div>
                                            <Link to={"/product-details/" + item.id} className="btn-link">{item.title}</Link>
                                        </td>
                                        <td className="product-availibilty hm-align has-title" data-title="Availability">
                                            {item.stock === true ?
                                                <span className="stock in-stock">Còn hàng</span>
                                                :
                                                <span className="stock in-stock text-danger">Hết hàng</span>
                                            }
                                        </td>
                                        <td className="product-price hm-align has-title" data-title="Price">
                                            <span className="product-currency">$</span> <span className="product-amount">{new Intl.NumberFormat().format((item.newPrice * (100 -
                                                item.discount) / 100).toFixed(2))}</span>
                                        </td>
                                        <td className="product-action hm-align has-title" data-title="Action">
                                            {item.stock === true ?
                                                <button type="button" className="btn btn-primary btn-md">Thêm vào giỏ hàng</button>
                                                :
                                                <button type="button" className="btn btn-primary btn-md" disabled>Thêm vào giỏ hàng</button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                {/* Data */}
                            </tbody>
                        </table>
                        {/*<div className="text-center mt-5">
                            <h5>Share Your Wishlist</h5>
                            <ul className="hm-footer-sm">
                                <li> <Link to="#"><i className="fab fa-facebook-f" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-google-plus-g" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-twitter" /></Link> </li>
                                <li> <Link to="#"><i className="fab fa-skype" /></Link> </li>
                            </ul>
                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;