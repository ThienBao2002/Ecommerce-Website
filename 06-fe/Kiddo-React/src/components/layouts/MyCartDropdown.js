import React, { useState, useEffect } from "react";
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

//SimpleBar
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
import {
  getCustomerById as onGetCustomerById,
  deleteCart as onDeleteCart,
} from "../../slices/thunks";
const MyCartDropdown = () => {
  const navigate = useNavigate();
  //** ======================== CheckSession========================
  const token = useSelector((state) => state.Session.decodedToken);

  //** ======================== Get customer by id ========================
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
    customers: ecom.customers,
    isCustomerSuccess: ecom.isCustomerSuccess,
    error: ecom.error,
  }));
  // Inside your component
  // eslint-disable-next-line
  const { customers: customer } = useSelector(ecomCustomerProperties);
  useEffect(() => {
    if (customer && !customer.length && token !== null) {
      dispatch(onGetCustomerById(token.userId));
    }
    // eslint-disable-next-line
  }, [dispatch, token]);
  const [cartData, setCartData] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  useEffect(() => {
    // Kiểm tra nếu customer tồn tại và có cart.items trước khi thực hiện
    if (customer && customer.cart && customer.cart.items) {
      setCartData([...customer.cart.items]);
      setCartItemCount(customer.cart.items.length);
    }
  }, [customer]);
  const [isCartDropdown, setIsCartDropdown] = useState(false);
  const toggleCartDropdown = () => {
    setIsCartDropdown(!isCartDropdown);
    setCartItemCount(cartData.length);
  };


  const removeItem = async (ele, productId, variant1Id, variant2Id) => {
    const cartItem = {
      userId: token.userId,
      productId: productId,
      variant1Id: variant1Id || "",
      variant2Id: variant2Id || ""
    };
    await dispatch(onDeleteCart(cartItem));
    await dispatch(onGetCustomerById(token.userId));
  };
  const handleItemClick = (item) => {
    navigate(`/product-details-v2/${item.product._id}`);
  };


  return (
    <React.Fragment>

      <Dropdown
        isOpen={isCartDropdown}
        toggle={toggleCartDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle
          type="button"
          tag="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        >
          <i className="bx bx-shopping-bag fs-22"></i>
          <span className="position-absolute cartitem-badge topbar-badge fs-10 translate-middle badge rounded-pill bg-info">
            {cartItemCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        </DropdownToggle>
        <DropdownMenu
          className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart"
          aria-labelledby="page-header-cart-dropdown"
        >

            <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold"> Giỏ hàng</h6>
                </Col>
                <div className="col-auto">
                  <span className="badge bg-warning-subtle text-warning fs-13">
                    <span className="cartitem-badge"> {cartItemCount} </span>{" "}
                    sản phẩm
                  </span>
                </div>
              </Row>
          </div>
          {isCartDropdown &&
            <SimpleBar style={{ maxHeight: "300px" }}>

              <div className="p-2">
                <div
                  className="text-center empty-cart"
                  id="empty-cart"
                  style={{ display: "none" }}
                >
                  <div className="avatar-md mx-auto my-3">
                    <div className="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                      <i className="bx bx-cart"></i>
                    </div>
                  </div>
                  <h5 className="mb-3">Không có sản phẩm trong giỏ hàng</h5>
                  <Link
                    to="/apps-ecommerce-products"
                    className="btn btn-success w-md mb-3"
                  >
                    Shop Now
                  </Link>
                </div>

                {isCartDropdown && cartData.map((item, key) => (

                  <div
                    className="d-block dropdown-item text-wrap dropdown-item-cart px-3 py-2"
                    style={{ marginBottom: '60px' }}
                    key={key}
                  >
                    <div className="d-flex " >
                      <img src={
                        item.variant1 && item.variant1._id
                          ? (item.product.imagesVariant.find(img => img.name === item.variant1.imageName)?.url || item.product.images[0]?.url)
                          : item.product.images[0]?.url
                      }
                        className="me-3 rounded-circle avatar-sm p-2 bg-light"
                        alt={item.name} />
                      <div
                        className="flex-grow-1"
                        onClick={() => handleItemClick(item)}
                      >
                        <h6 className="mt-0 mb-1 fs-14">
                          <span className="text-reset">
                            {item.product.name.slice(0, 20) + "..."}
                          </span>
                        </h6>
                        <p className="mb-0 fs-12 text-muted">
                          SL:{" "}
                          <span>
                            {item.quantity} x{" "}
                            {item.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </p>
                        <p className="mb-0 fs-12 text-muted">
                          {" "}
                          <span>
                            {item.variant1 && item.variant1._id && item.variant1.name + " "}
                          </span>
                          <span>
                            {item.variant2 && item.variant2._id && item.variant2.name}
                          </span>

                        </p>
                      </div>
                      <div className="px-2">
                        <h5 className="m-0 fw-normal">
                          <span className="cart-item-price">
                            {(item.quantity * item.price).toLocaleString(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            )}
                          </span>
                        </h5>
                      </div>
                      <div className="ps-2">
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
                          onClick={(e) => {
                            // Ngăn không cho sự kiện click lan ra phía ngoài
                            e.stopPropagation();

                            // Xác định _id của product và các variant, gửi null nếu chúng không tồn tại
                            const productId = item.product ? item.product._id : null;
                            const variant1Id = item.variant1 ? item.variant1._id : null;
                            const variant2Id = item.variant2 ? item.variant2._id : null;

                            removeItem(e.target, productId, variant1Id, variant2Id);
                          }}
                        >
                          <i className="ri-close-fill fs-16"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SimpleBar>}
            <div
              className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border"
              id="checkout-elem"
            >
              <div className="d-flex justify-content-between align-items-center pb-3">
                <h5 className="m-0 text-muted">Tổng cộng:</h5>
                <div className="px-2">
                  <h5 className="m-0">
                    <span id="cart-item-total">
                      {
                        customer && customer.cart && customer.cart.total
                          ? customer.cart.total.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                          : "0 ₫" // Hoặc giá trị mặc định khi không có dữ liệu
                      }
                    </span>
                  </h5>
                </div>
              </div>

              <Link to="/cart" className="btn btn-success text-center w-100">
                Đến giỏ hàng
              </Link>
            </div>

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default MyCartDropdown;
