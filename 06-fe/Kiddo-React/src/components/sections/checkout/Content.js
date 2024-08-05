import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cartItems from "../../../data/shop/shop.json";

const labelStyle ={
    textAlign: 'right', // Đặt căn chỉnh văn bản về phía phải
    cursor: 'pointer', // Đặt kiểu con trỏ chuột thành pointer
    color: 'blue',
    textDecoration: 'underline',
};

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: cartItems,
            priceTotal: cartItems.slice(0, 5).reduce((totalPrice, item) => totalPrice + item.newPrice * (100 - item.discount) / 100 * item.rating, 0),
            isFormVisible: false,
            name: '',
            email: '',
            address: '',
        };
    }

    toggleFormVisibility = () => {
    this.setState({ isFormVisible: !this.state.isFormVisible });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
      };
    
      handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, address } = this.state;
        
        // Xử lý dữ liệu form (ví dụ: gửi dữ liệu lên máy chủ, lưu trữ, v.v.)
        console.log(`Tên: ${name}, Email: ${email}, Địa chỉ: ${address}`);
      };
    

    render() {
        return (
            <div className="container">
                <div className="hm-section">
                    <div className="row">
                        <div className="col-lg-12 col-xl-12">
                            <div className="card mb-3">
                                <div className="card-title">
                                   
                                    <h5>Địa chỉ giao hàng</h5>
                                    <h5><Link to="/login">Đăng nhập</Link></h5>
                                </div>
                                <div className="card-body">
                                   
                                    <form className="hm-checkout-body">
                                        <div className="form-group row">
                                            <label htmlFor="inputFname" className="col-sm-4 col-form-label">Tên:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputFname" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputLname" className="col-sm-4 col-form-label">Họ:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputLname" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputAddress1" className="col-sm-4 col-form-label">Địa chỉ (ưu tiên):</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputAddress1" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputAddress2" className="col-sm-4 col-form-label">Địa chỉ (phụ):</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputAddress2" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputCity" className="col-sm-4 col-form-label">City:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputCity" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputPcode" className="col-sm-4 col-form-label">Postal Code:</label>
                                            <div className="col-sm-8">
                                                <input type="number" className="form-control" id="inputPcode" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputState" className="col-sm-4 col-form-label">State:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputState" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputCount" className="col-sm-4 col-form-label">Country:</label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="inputCount" />
                                            </div>
                                        </div>
                                    </form> 
                                    <div style={{textAlign: 'right'}}>
                                        <label
                                            style={labelStyle} // Đặt kiểu con trỏ chuột cụ thể
                                            onClick={this.toggleFormVisibility}
                                        >
                                            Thay đổi
                                    </label>
                                    </div>
                                    {this.state.isFormVisible && (
                                     <form>
                                        <form onSubmit={this.handleSubmit}>
                                         <label>
                                            Tên:
                                            <input
                                            type="text"
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.handleInputChange}
                                            />
                                            </label>
                                            <br />
                                            <label>
                                            Email:
                                            <input
                                                type="email"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleInputChange}
                                            />
                                            </label>
                                            <br />
                                            <label>
                                            Địa chỉ:
                                            <input
                                                type="text"
                                                name="address"
                                                value={this.state.address}
                                                onChange={this.handleInputChange}
                                            />
                                        </label>
                                        <br />
                                        <button type="submit">Hoàn thành đơn hàng</button>
                                    </form>
                                    </form>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-xl-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-title">
                                            <h5>Chi tiết đơn hàng</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="hm-checkout-body">
                                                <table className="table hm-table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Sản phẩm</th>
                                                            <th scope="col">Số lượng</th>
                                                            <th scope="col">Tổng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Data */}
                                                        {cartItems.slice(0, 5).map((item, i) => (
                                                            <tr key={i}>
                                                                <td>{item.title}</td>
                                                                <td>x{item.rating}</td>
                                                                <td>${new Intl.NumberFormat().format((item.newPrice * (100 - item.discount) / 100 * item.rating).toFixed(2))}</td>
                                                            </tr>
                                                        ))}
                                                        {/* Data */}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="hm-table-footer">
                                                            <td>Tổng giá trị đơn hàng</td>
                                                            <td />
                                                            <td>${new Intl.NumberFormat().format((this.state.newPriceTotal + 2.99).toFixed(2))}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-title">
                                            <h5>Phương thức thanh toán</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="hm-checkout-body">
                                                <div className="hm-text-content">
                                                    <p>Thanh toán qua các phương thức</p>
                                                </div>
                                                <div className="hm-payment-cards">
                                                    <ul className="list-inline" id="hm-pay-method">
                                                        <li className="list-inline-item"><Link to="#"><span><i className="fab fa-3x fa-cc-paypal" /></span></Link></li>
                                                        <li className="list-inline-item"><Link to="#"><span><i className="fab fa-3x fa-cc-stripe" /></span></Link></li>
                                                        <li className="list-inline-item"><Link to="#"><span><i className="fab fa-3x fa-cc-visa" /></span></Link></li>
                                                        <li className="list-inline-item"><Link to="#"><span><i className="fab fa-3x fa-cc-mastercard" /></span></Link></li>
                                                        <li className="list-inline-item"><Link to="#"><span><i className="fab fa-3x fa-cc-amex" /></span></Link></li>
                                                    </ul>
                                                </div>
                                                <div className="hm-payment-form">
                                                    <form className="hm-pay-form">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label htmlFor="inputCnumber" className="col-form-label">Số thẻ:</label>
                                                                    </td>
                                                                    <td colSpan={3}>
                                                                        <input type="text" className="form-control" id="inputCnumber" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label htmlFor="inputCcv" className="col-form-label">CCV:</label>
                                                                    </td>
                                                                    <td colSpan={3}>
                                                                        <input type="text" className="form-control" id="inputCcv" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label htmlFor="inputMonth" className="col-form-label">Tháng</label>
                                                                    </td>
                                                                    <td>
                                                                        <span>
                                                                            <input type="number" className="form-control" id="inputMonth" />
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <label htmlFor="inputYear" className="col-form-label">Năm</label>
                                                                    </td>
                                                                    <td>
                                                                        <span>
                                                                            <input type="number" className="form-control" id="inputYear" /></span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 col-lg-12">
                            <div className="hm-checkout-btn mt-5  hm-center-item text-right">
                                <button className="btn btn-secondary btn-md">Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;