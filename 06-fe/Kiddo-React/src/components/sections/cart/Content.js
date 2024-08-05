import React, { Component } from "react";
import { Link } from "react-router-dom";
import cartItems from "../../../data/shop/shop.json";
import { handleDeleteFromCart } from "../../../helper/shopHelper";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: cartItems,
      priceTotal: cartItems
        .slice(0, 5)
        .reduce(
          (totalPrice, item) =>
            totalPrice +
            ((item.newPrice * (100 - item.discount)) / 100) * item.rating,
          0
        ),
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }
  increment(item) {
    item.rating = item.rating + 1;
    this.setState({
      cartItems: this.state.cartItems,
      priceTotal: cartItems
        .slice(0, 5)
        .reduce(
          (totalPrice, item) =>
            totalPrice +
            ((item.newPrice * (100 - item.discount)) / 100) * item.rating,
          0
        ),
    });
  }
  decrement(item) {
    item.rating = item.rating > 1 ? item.rating - 1 : 1;
    this.setState({
      cartItems: this.state.cartItems,
      priceTotal: cartItems
        .slice(0, 5)
        .reduce(
          (totalPrice, item) =>
            totalPrice +
            ((item.newPrice * (100 - item.discount)) / 100) * item.rating,
          0
        ),
    });
  }
  render() {
    return (
      <div className="container">
        <div className="hm-section">
          <div className="w-100 table-responsive mb-4">
            <table className="table hm-cart-table">
              <thead>
                <tr>
                  <th />
                  <th scope="col" className="product-name">
                    Sản phẩm
                  </th>
                  <th scope="col" className="product-qty">
                    Đơn giá
                  </th>
                  <th scope="col" className="product-qty">
                    Số lượng
                  </th>
                  <th scope="col" className="product-price">
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Data */}
                {cartItems.slice(0, 5).map((item, i) => (
                  <tr key={i}>
                    <td className="product-remove hm-align">
                      <Link to="#" onClick={handleDeleteFromCart}>
                        <i className="fas fa-times" />
                      </Link>
                    </td>
                    <td data-title="Product" className="has-title">
                      <div className="product-thumbnail">
                        <img
                          src={process.env.PUBLIC_URL + "/" + item.image[0]}
                          alt={item.title}
                        />
                      </div>
                      <Link
                        to={"/product-details/" + item.id}
                        className="btn-link"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="price hm-align has-title" data-title="Price">
                      {new Intl.NumberFormat().format(
                        ((item.newPrice * (100 - item.discount)) / 100).toFixed(2)
                      )}
                    </td>
                    <td
                      className="quantity hm-align has-title"
                      data-title="Quantity"
                    >
                      <input
                        type="button"
                        defaultValue="-"
                        className="minus btn btn-outline-secondary hm-qty-btn"
                        onClick={(e) => this.decrement(item)}
                      />
                      <input
                        type="text"
                        className="input-text qty text"
                        name="quantity"
                        value={item.rating}
                        readOnly
                      />
                      <input
                        type="button"
                        defaultValue="+"
                        className="plus btn btn-outline-secondary hm-qty-btn"
                        onClick={(e) => this.increment(item)}
                      />
                    </td>
                    <td
                      className="product-price hm-align has-title"
                      data-title="Price"
                    >
                      <span className="product-currency">$</span>{" "}
                      <span className="product-amount">
                        {new Intl.NumberFormat().format(
                          (
                            ((item.newPrice * (100 - item.discount)) / 100) *
                            item.rating
                          ).toFixed(2)
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Data */}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <button className="btn btn-secondary btn-md float-left">
                      Tiếp tục mua sắm
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-5">
              <div className="hm-product-promo">
                <div className="hm-title">
                  <h5>Mã giảm giá</h5>
                </div>
                <form>
                  <div className="form-group">
                    <label htmlFor="couponCode">Nhập mã giảm giá</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã giảm giá ở đây"
                      id="couponCode"
                    />
                    <button
                      type="submit"
                      className="btn btn-md btn-secondary mt-4"
                    >
                      Áp dụng
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="offset-lg-6 col-lg-6 col-md-12">
              <div className="hm-product-promo">
                <table className="table hm-table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <b>Tổng chi phí sản phẩm</b>{" "}
                      </td>
                      <td className="text-right">
                        ${" "}
                        {new Intl.NumberFormat().format(
                          this.state.newPriceTotal.toFixed(2)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <b>Phí giao hàng</b>{" "}
                      </td>
                      <td className="text-right">$ 2.99</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <b>Thành tiền</b>{" "}
                      </td>
                      <td className="text-right">
                        ${" "}
                        {new Intl.NumberFormat().format(
                          (this.state.newPriceTotal + 2.99).toFixed(2)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Link to="/checkout" className="btn btn-md btn-secondary w-100">
                  Tiến hành đặt hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
