import React, { useState, useEffect } from "react";
//import { shoppingCart } from "../../../data/ecommerce";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import {
  getCustomerById as onGetCustomerById,
  updateCart as onUpdateCart,
  deleteCart as onDeleteCart
} from "../../../slices/thunks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
const Content = () => {
  /**==================================GET CUSTOMER CART======================= */
  const [productList, setProductList] = useState([]);

  const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
    customers: ecom.customers,
  }));
  // Inside your component
  const { customers: customer } = useSelector(ecomCustomerProperties);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.Session.decodedToken);
  const [dispatchCount, setDispatchCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    if (customer && !customer.length && token !== null && dispatchCount < 1) {
      dispatch(onGetCustomerById(token.userId));
      setDispatchCount((prevCount) => prevCount + 1);
    } else if (customer && customer.cart && customer.cart.items) {
      setProductList(customer.cart.items);
    }
  }, [dispatch, token, customer, dispatchCount]);

  useEffect(() => {
    let subTotal = 0;
    productList.forEach((item) => {
      subTotal += item.quantity * item.newPrice;
    });

    if (subTotal !== 0) {
    } else {
    }
  }, [productList]);

  const removeCartItem = async (id, productId, variant1Id, variant2Id) => {
    const cartItem = {
      userId: token.userId,
      productId: productId,
      variant1Id: variant1Id,
      variant2Id: variant2Id
    };

    console.log(cartItem);
    await dispatch(onDeleteCart(cartItem));
    await dispatch(onGetCustomerById(token.userId));
  };

  const updateCartItemQuantity = async (id, new_quantity, itemPrice, productId, variant1Id, variant2Id) => {
    await setProductList((prevProductList) =>
      prevProductList.map((p) =>
        p._id === id ? { ...p, quantity: new_quantity, total: new_quantity * itemPrice } : p
      )
    );

    const cartItem = {
      userId: token.userId,
      productId: productId,
      quantity: new_quantity,
      variant1Id: variant1Id || "",
      variant2Id: variant2Id || "",
    };

    await dispatch(onUpdateCart(cartItem));
  };
  const countUP = async (id, prev_quantity, itemPrice, productId, variant1Id, variant2Id) => {
    await updateCartItemQuantity(id, prev_quantity + 1, itemPrice, productId, variant1Id, variant2Id);
  };

  const countDOWN = async (id, prev_quantity, itemPrice, productId, variant1Id, variant2Id) => {
    if (prev_quantity > 1) {
      await updateCartItemQuantity(id, prev_quantity - 1, itemPrice, productId, variant1Id, variant2Id);
    }
  };

  const handleUpdateQuantity = (cartItem, increment) => {
    let stock;
    if (cartItem.product && cartItem.product.variantClassCount === 0) {
      stock = cartItem.product.stock;
    } else if (cartItem.variant1 && cartItem.product.variantClassCount === 1) {
      stock = cartItem.variant1.stock;
    } else if (cartItem.variant2 && cartItem.product.variantClassCount === 2) {
      stock = cartItem.variant2.stock;
    }

    const canUpdate = increment ? cartItem.quantity < stock : cartItem.quantity > 1;

    if (canUpdate) {
      const action = increment ? countUP : countDOWN;
      const variant1Id = cartItem.variant1 ? cartItem.variant1._id : undefined;
      const variant2Id = cartItem.variant2 ? cartItem.variant2._id : undefined;
      action(
        cartItem._id,
        cartItem.quantity,
        cartItem.price,
        cartItem.product._id,
        variant1Id,
        variant2Id
      );
    }
  };



  const handleCheckout = async () => {
    try {
      const items = [...selectedItems];

      // Kiểm tra items có rỗng hay không
      if (items.length === 0) {
        throw new Error("Giỏ hàng rỗng!");
      }
      navigate("/checkout-v2", { state: { items } });
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.message, { autoClose: 3000 });
    }
  };



  const toggleItemSelection = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.find((i) => i._id === item._id)
        ? prevItems.filter((i) => i._id !== item._id)
        : [...prevItems, item]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === productList.filter(item => item.quantity > 0).length) {
      // Nếu tất cả các mục có stock > 0 đã được chọn, bỏ chọn tất cả
      setSelectedItems([]);
    } else {
      // Chỉ chọn những mục có stock > 0
      setSelectedItems(productList.filter(item => item.quantity > 0));
    }
  };
  function getStockForCartItem(cartItem) {
    if (!cartItem || !cartItem.product) return 0; // Kiểm tra đầu vào hợp lệ
  
    // Xử lý dựa trên số lượng biến thể
    switch (cartItem.product.variantClassCount) {
      case 1:
        // Nếu chỉ có 1 biến thể và biến thể đó tồn tại
        return cartItem.variant1 ? cartItem.variant1.stock : 0;
      case 2:
        // Nếu có 2 biến thể và cả hai biến thể đều tồn tại
        if (cartItem.variant2) {
          return cartItem.variant2.stock;
        }
        // Nếu chỉ có biến thể 1 tồn tại
        return cartItem.variant1 ? cartItem.variant1.stock : 0;
      default:
        // Trường hợp không có biến thể hoặc không rơi vào các trường hợp trên
        return cartItem.product.stock;
    }
  }
  
  
  useEffect(()=>{
    console.log(selectedItems)
  },[selectedItems])



  document.title = "Kiddo - Thời trang trẻ em| Giỏ hàng";
  return (
    <div className="container">
      <ToastContainer closeButton={false} limit={1} />
      {toast.clearWaitingQueue()}
      <div className="hm-section">
        <React.Fragment>
          <div className="page-content">
            <Container fluid>
              <Row className="mb-3">
                <Row className="align-items-center gy-3 mb-3">
                  <div className="col-sm">
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === productList.length && productList.length > 0}
                        onChange={selectAllItems}
                        className="me-2"
                      />
                      <span>Chọn tất cả {selectedItems.length}</span>
                      <h5 className="fs-14 mb-0">
                        Giỏ hàng của bạn ({productList.length} sản phẩm)
                      </h5>
                    </div>
                  </div>

                  <div className="col-sm-auto">
                    <Link
                      to="/"
                      //className="link-primary text-decoration-underline"
                      type="button"
                      className="btn btn-label previestab"
                    >
                      <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                      {"-- "}
                      Tiếp tục mua sắm
                    </Link>

                  </div>
                </Row>
                {productList.map((cartItem, key) => (
                  <React.Fragment key={cartItem._id}>
                    <Card className="product" style={{ height: "240px" }}>
                      <CardBody>
                        <Col md={1}>
                          {cartItem.quantity > 0 && (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(cartItem)}
                              onChange={() => toggleItemSelection(cartItem)}
                            />)}

                        </Col>
                        <Col>
                          <Row className="gy-3">
                            <div className="col-sm-auto">
                              <div className="avatar-lg  rounded p-1">
                                <img
                                  src={
                                    cartItem.variant1 && cartItem.variant1._id
                                      ? (cartItem.product.imagesVariant.find(img => img.name === cartItem.variant1.imageName)?.url || cartItem.product.images[0]?.url)
                                      : cartItem.product.images[0]?.url
                                  }
                                  alt=""
                                  className="img-fluid d-block"
                                />
                              </div>
                            </div>
                            <div className="col-sm">
                              <h5 className="fs-14 text-truncate">
                                <Link
                                  to={"/product-details-v2/" + cartItem.product._id}
                                  className="text-body"
                                >
                                  {cartItem.product.name.slice(0, 80) + "..."}
                                </Link>
                              </h5>
                              <ul className="list-inline text-muted">
                                <li className="list-inline-item">
                                  Phân loại:
                                  <span className="fw-medium">
                                    {(cartItem.variant1 && cartItem.variant1._id && cartItem.variant1.name + " ") || "Không"}
                                  </span>
                                </li>
                                <li className="list-inline-item">
                                  <span className="fw-medium">
                                    {cartItem.variant2 && cartItem.variant2._id && cartItem.variant2.name + " "}
                                  </span>
                                </li>
                                <li className="list-inline-item">
                                  Kho:
                                  <span className="fw-medium">
                                    {getStockForCartItem(cartItem)}
                                  </span>
                                </li>
                              </ul>
                              {console.log(cartItem)}
                              {getStockForCartItem(cartItem) > 0 ? (
                                <div className="input-step">
                                  <button
                                    type="button"
                                    className="minus"
                                    onClick={() => handleUpdateQuantity(cartItem, false)}
                                  >
                                    –
                                  </button>
                                  <Input
                                    type="number"
                                    className="product-quantity"
                                    value={cartItem.quantity}
                                    name="demo_vertical"
                                    onChange={(e) => {
                                      const stock = getStockForCartItem(cartItem);
                                      console.log("stock", stock);
                                      let newQuantity = parseInt(e.target.value, 10);
                                      if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity > stock) {
                                        newQuantity = stock; // Giới hạn số lượng tối đa là số lượng trong kho
                                      }
                                      updateCartItemQuantity(cartItem._id, isNaN(newQuantity) ? e.target.value : newQuantity, cartItem.price, cartItem.product._id, cartItem.variant1?._id, cartItem.variant2?._id);
                                    }}
                                    onBlur={(e) => {
                                      const stock = getStockForCartItem(cartItem);
                                      let newQuantity = parseInt(e.target.value, 10);
                                      if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity > stock) {
                                        newQuantity = 1; // Đặt lại số lượng tối thiểu nếu không hợp lệ
                                      }
                                      updateCartItemQuantity(cartItem._id, newQuantity, cartItem.price, cartItem.product._id, cartItem.variant1?._id, cartItem.variant2?._id);
                                    }}
                                    
                                  />
                                  <button
                                    type="button"
                                    className="plus"
                                    onClick={() => handleUpdateQuantity(cartItem, true)}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <div className="out-of-stock-message">
                                  Sản phẩm đã hết hàng
                                </div>
                              )}

                            </div>
                            <div className="col-sm-auto">
                              <div className="text-lg-end">
                                <p className="text-muted mb-1">Giá sản phẩm:</p>
                                <h5 className="fs-14">
                                  <span
                                    id="ticket_price"
                                    className="product-price"
                                  >
                                    {cartItem.price.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </span>
                                </h5>
                              </div>
                            </div>
                          </Row>
                        </Col>
                      </CardBody>

                      <div className="card-footer">
                        <div className="row align-items-center gy-3">
                          <div className="col-sm">
                            <div className="d-flex flex-wrap my-n1">
                              <div>
                                <button
                                  style={{ borderColor: "#f0f0f0", borderRadius: "15px" }}
                                  // className="d-block text-body p-1 px-2"
                                  onClick={(e) => {
                                    // Ngăn không cho sự kiện click lan ra phía ngoài
                                    e.stopPropagation();

                                    // Xác định _id của product và các variant, gửi null nếu chúng không tồn tại
                                    const productId = cartItem.product ? cartItem.product._id : null;
                                    const variant1Id = cartItem.variant1 ? cartItem.variant1._id : null;
                                    const variant2Id = cartItem.variant2 ? cartItem.variant2._id : null;

                                    removeCartItem(e.target, productId, variant1Id, variant2Id);
                                  }}
                                >
                                  <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i> Loại bỏ
                                </button>

                              </div>
                            </div>
                          </div>
                          <div className="col-sm-auto">
                            <div className="d-flex align-items-center gap-2 text-muted">
                              <div>Thành tiền :</div>
                              <h5 className="fs-14 mb-0">
                                <span className="product-line-price">
                                  {" "}
                                  {(
                                    cartItem.price * cartItem.quantity
                                  ).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </React.Fragment>
                ))}

                <div className="text-end mb-4">
                  <button
                    className="btn btn-secondary btn-label right ms-auto"
                    onClick={handleCheckout}
                  >
                    <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                    Đặt hàng
                  </button>
                </div>
              </Row>
            </Container>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Content;
