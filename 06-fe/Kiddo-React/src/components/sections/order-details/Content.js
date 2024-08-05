import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Collapse,
  Button,
  Modal, ModalBody, ModalHeader,
} from "reactstrap";


import classnames from "classnames";
import EcommerceOrderProduct from "./EcommerceOrderProduct";
import AddReviewDetail from "./AddReviewDetail";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
//redux
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { ScrollableModalExample } from './UiModalCode';
import {
  getOrderById as onGetOrderByID,
  updateOrder as onUpdateOrder,
  getCustomerById as onGetCustomerById,
} from "../../../slices/thunks";
import { ToastContainer } from "react-toastify";
const Content = (props) => {

  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(true);
  const [col3, setcol3] = useState(true);
  const { _id: orderId } = useParams();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.Ecommerce.orderDetails);
  const token = useSelector((state) => state.Session.decodedToken);

  useEffect(() => {
    if (orderDetails && !orderDetails.length) {
      dispatch(onGetOrderByID(orderId));
    }
    // eslint-disable-next-line
  }, [orderId, dispatch]);

  const shippingAddress =
    orderDetails && orderDetails.shippingAddress
      ? orderDetails.shippingAddress
      : "";
  function togglecol1() {
    setcol1(!col1);
  }

  function togglecol2() {
    setcol2(!col2);
  }

  function togglecol3() {
    setcol3(!col3);
  }
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const [showProductReview, setShowProductReview] = useState(false);
  const [showAddReviewDetails, setShowAddReviewDetails] = useState(false);
  function ShowProductReviewPopUp() {
    setShowProductReview(!showProductReview);
  }
  function ShowAddReviewDetailsPopUp() {
    setShowAddReviewDetails(!showAddReviewDetails);
  }
  const handleOrderList = () => {
    ShowProductReviewPopUp();
  }
  const [selectedProduct, setSelectedProduct] = useState(null);
  const HandleAddReviewDetail = (product) => {
    setSelectedProduct(product);
    ShowAddReviewDetailsPopUp();
  }
  const handleDeleteOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn Hủy đơn hàng này?")) {
      const updateOrder = {
        _id: orderId,
        status: "Cancelled",
      };
      try {
        // update order
        await dispatch(onUpdateOrder(updateOrder));
        await dispatch(onGetCustomerById(token.userId));
        await dispatch(onGetOrderByID(orderId));
        // Bạn có thể thêm hành động khác nếu cần
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  document.title = "Order Details | Velzon - React Admin & Dashboard Template";
  return (
    <div className="container">
      <ToastContainer closeButton={false} limit={1} />
      <div className="hm-section">
        <Container fluid>
          <Row>
            <Col xl={9}>
              <Card>
                <CardHeader> {console.log(orderDetails)}
                  <div className="d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      {"Đơn hàng " + orderDetails.orderCode}
                    </h5>
                    {orderDetails.status === "Delivered" && (
                      <div className="flex-shrink-0">
                        <Link
                          to={`/apps-invoices-details/${orderDetails._id}`}
                          className="btn-sm"
                          style={{ color: "#FF1493" }}
                        >
                          <i className="ri-download-2-fill align-middle me-1"></i>{" "}
                          Hóa đơn
                        </Link>
                      </div>)}
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-nowrap align-middle table-borderless mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th scope="col">Chi tiết sản phẩm</th>
                          <th scope="col">Đơn giá</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col" className="text-end">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails &&
                          orderDetails.items &&
                          orderDetails.items.map((item, key) => (
                            <EcommerceOrderProduct item={item} key={key} />
                          ))}

                        {orderDetails && (
                          <tr className="border-top border-top-dashed">
                            <td colSpan="3"></td>
                            <td colSpan="2" className="fw-medium p-0">
                              <table className="table table-borderless mb-0">
                                <tbody>
                                  <tr>
                                    <td>
                                      Tổng :{" "}
                                      {orderDetails.totalItem &&
                                        orderDetails.totalItem.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                    </td>
                                    <td className="text-end"></td>
                                  </tr>
                                  <tr>
                                  <td>
                                    Giảm giá{" "}
                                    <span className="text-muted">
                                      {orderDetails?.voucher}
                                    </span>{" "}
                                    : -{orderDetails?.voucherValue?.toLocaleString(
                                        "vi-VN",
                                        {
                                          style: "currency",
                                          currency: "VND",
                                        }
                                      )}
                                  </td>
                                  <td className="text-end"></td>
                                </tr>
                                  <tr>
                                    <td>
                                      Phí ship :{" "}
                                      {orderDetails.shippingCost &&
                                        orderDetails.shippingCost.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                    </td>
                                    <td className="text-end"></td>
                                  </tr>
                                  <tr>
                                    <td>Thuế: {orderDetails.taxFee}%</td>
                                    <td className="text-end"></td>
                                  </tr>
                                  <tr className="border-top border-top-dashed">
                                    <th scope="row">
                                      Tổng giá trị đơn hàng:{" "}
                                      {orderDetails.total &&
                                        orderDetails.total.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}
                                    </th>
                                    <th className="text-end"></th>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="d-sm-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-0">
                      Trạng thái đơn hàng
                    </h5>
                    <div>
                      {orderDetails?.status === "Pending" ? (
                        <span className="badge bg-warning-subtle text-warning text-uppercase">Đang xử lý</span>
                      ) : orderDetails.status === "Cancelled" ? (
                        <span className="badge bg-danger-subtle text-danger text-uppercase">Đã hủy</span>
                      ) : orderDetails.status === "Inprogress" ? (
                        <span className="badge bg-secondary-subtle text-secondary text-uppercase">Đang tiến hành</span>
                      ) : orderDetails.status === "Pickups" ? (
                        <span className="badge bg-info-subtle text-info text-uppercase">Lấy hàng</span>
                      ) : orderDetails.status === "Returns" ? (
                        <span className="badge bg-primary-subtle text-primary text-uppercase">Trả hàng</span>
                      ) : orderDetails.status === "Delivered" ? (
                        <span className="badge bg-success-subtle text-success text-uppercase">Đã giao</span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning text-uppercase">{orderDetails.status}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0 mt-2 mt-sm-0">
                      <Button
                        type="button"
                        className="text-primary bg-transparent border-0 p-0"
                        onClick={handleDeleteOrder}
                      >
                        <i className="mdi mdi-archive-remove-outline align-middle me-1"></i>{" "}
                        Hủy đơn hàng
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="profile-timeline">
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushExample"
                    >
                      <div
                        className="accordion-item border-0"
                        onClick={togglecol1}
                      >
                        <div className="accordion-header" id="headingOne">
                          <Link
                            to="#"
                            className={classnames(
                              "accordion-button",
                              "p-2",
                              "shadow-none",
                              { collapsed: !col1 }
                            )}
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className="avatar-title bg-success rounded-circle">
                                  <i className="ri-shopping-bag-line"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-0 fw-semibold">
                                  Đã đặt hàng -{" "}
                                  <span className="fw-normal">
                                    {orderDetails.createDate}
                                  </span>
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse
                          id="collapseOne"
                          className="accordion-collapse"
                          isOpen={col1}
                        >
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="mb-1">Đơn hàng đã được đặt</h6>
                            <p className="text-muted">
                              {orderDetails.createDate}
                            </p>

                            <h6 className="mb-1">
                              Nhân viên nhận đơn và chuẩn bị hàng
                            </h6>
                            <p className="text-muted mb-0">
                              {orderDetails.modifyDate}
                            </p>
                          </div>
                        </Collapse>
                      </div>
                      <div
                        className="accordion-item border-0"
                        onClick={togglecol2}
                      >
                        <div className="accordion-header" id="headingTwo">
                          <Link
                            to="#"
                            className={classnames(
                              "accordion-button",
                              "p-2",
                              "shadow-none",
                              { collapsed: !col2 }
                            )}
                            href="#collapseTwo"
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className="avatar-title bg-success rounded-circle">
                                  <i className="mdi mdi-gift-outline"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-1 fw-semibold">
                                  Đã đóng gói -{" "}
                                  <span className="fw-normal">
                                    {orderDetails.modifyDate}
                                  </span>
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse
                          id="collapseTwo"
                          className="accordion-collapse"
                          isOpen={col2}
                        >
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="mb-1">
                              Đơn hàng đã được gửi cho công ty chuyển phát
                            </h6>
                            <p className="text-muted mb-0">Đang cập nhật</p>
                          </div>
                        </Collapse>
                      </div>
                      <div
                        className="accordion-item border-0"
                        onClick={togglecol3}
                      >
                        <div className="accordion-header" id="headingThree">
                          <Link
                            to="#"
                            className={classnames(
                              "accordion-button",
                              "p-2",
                              "shadow-none",
                              { collapsed: !col3 }
                            )}
                            href="#collapseThree"
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className="avatar-title bg-success rounded-circle">
                                  <i className="ri-truck-line"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-1 fw-semibold">
                                  Đang giao -{" "}
                                  <span className="fw-normal">
                                    Đang cập nhật
                                  </span>
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse
                          id="collapseThree"
                          className="accordion-collapse"
                          isOpen={col3}
                        >
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="fs-14">Đang cập nhật</h6>
                            <h6 className="mb-1">
                              Đơn hàng đang được giao đến người nhận
                            </h6>
                            <p className="text-muted mb-0">Đang cập nhật</p>
                          </div>
                        </Collapse>
                      </div>
                      <div className="accordion-item border-0">
                        <div className="accordion-header" id="headingFour">
                          <Link
                            to="#"
                            className="accordion-button p-2 shadow-none"
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className="avatar-title bg-light text-success rounded-circle">
                                  <i className="ri-takeaway-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-14 mb-0 fw-semibold">
                                  Trên đường vận chuyển
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="accordion-item border-0">
                        <div className="accordion-header" id="headingFive">
                          <Link
                            className="accordion-button p-2 shadow-none"
                            to="#"
                          >
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className="avatar-title bg-light text-success rounded-circle">
                                  <i className="mdi mdi-package-variant"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-14 mb-0 fw-semibold">
                                  Đã giao hàng
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3}>
              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <h5 className="card-title flex-grow-1 mb-0">
                      <i className="mdi mdi-truck-fast-outline align-middle me-1 text-muted"></i>
                      Thông tin đơn vị vận chuyển
                    </h5>
                    <div className="flex-shrink-0">
                      <Link
                        to="#"
                        className="badge bg-primary-subtle text-primary fs-11"
                      >
                        Theo dõi đơn hàng
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/uetqnvvg.json"
                      trigger="loop"
                      colors="primary:#405189,secondary:#0ab39c"
                      style={{ width: "80px", height: "80px" }}
                    ></lord-icon>
                    <h5 className="fs-16 mt-2">UTE Logistics</h5>
                    <p className="text-muted mb-0">
                      {"#ID: " + orderDetails.orderCode}
                    </p>
                    <p className="text-muted mb-0">
                      {"Thanh toán:" + orderDetails.paymentMethod}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <h5 className="card-title flex-grow-1 mb-0">
                      Thông tin người nhận
                    </h5>
                    {/* <div className="flex-shrink-0">
                      <Link to="#" className="link-secondary">
                        Xem hồ sơ
                      </Link>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody>
                  <ul className="list-unstyled mb-0 vstack gap-3">
                    <li>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <img
                            src={avatar3}
                            alt=""
                            className="avatar-sm rounded"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          {/* <h6 className="fs-14 mb-1">
                            {orderDetails.name
                              ? orderDetails.name + "(Vãng lai)"
                              : orderDetails.user
                                ? orderDetails.user.name + "(Thành viên)"
                                : ""}
                          </h6> */}
                          {orderDetails.name && (
                            <div>
                              <h6 className="fs-14 mb-1">
                                {orderDetails.name}
                              </h6>
                              <h6 className="fs-14 mb-1">
                                Vãng lai
                              </h6>
                            </div>
                          )}
                          {orderDetails.user && (
                            <div>
                              <h6 className="fs-14 mb-1">
                                {orderDetails.user.name}
                              </h6>
                              <h6 className="fs-14 mb-1">
                                Thành viên
                              </h6>
                            </div>
                          )}
                          {!orderDetails.name && !orderDetails.user}
                          <>
                          </>
                          <p className="text-muted mb-0">Khách hàng</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <i className="ri-mail-line me-2 align-middle text-muted fs-16"></i>
                      {orderDetails.email}
                    </li>
                    <li>
                      <i className="ri-phone-line me-2 align-middle text-muted fs-16"></i>
                      {orderDetails.phoneNumber}
                    </li>
                  </ul>
                </CardBody>
              </Card>

              {/* <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                  Địa chỉ thanh toán
                </h5>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                  <li className="fw-medium fs-14">Joseph Parker</li>
                  <li>+(256) 245451 451</li>
                  <li>2186 Joyce Street Rocky Mount</li>
                  <li>New York - 25645</li>
                  <li>United States</li>
                </ul>
              </CardBody>
            </Card> */}

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="ri-map-pin-line align-middle me-1 text-muted"></i>{" "}
                    Địa chỉ giao hàng
                  </h5>
                </CardHeader>
                <CardBody>
                  <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                    <li className="fw-medium fs-14">
                      <span style={{ fontWeight: "bold" }}>Địa chỉ:</span>{" "}
                      {shippingAddress}
                    </li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="ri-secure-payment-line align-bottom me-1 text-muted"></i>{" "}
                    Thông tin thanh toán
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-shrink-0">
                      <p className="text-muted mb-0">Mã đơn hàng:</p>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <h6 className="mb-0">{orderDetails.orderCode}</h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-shrink-0">
                      <p className="text-muted mb-0">Phương thức thanh toán:</p>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <h6 className="mb-0">{orderDetails.paymentMethod}</h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <p className="text-muted mb-0">Tổng giá trị đơn hàng:</p>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <h6 className="mb-0">
                        {" "}
                        {orderDetails.total &&
                          orderDetails.total.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-shrink-0">
                      <p className="text-muted mb-0">Trạng thái thanh toán:</p>
                    </div>


                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-0" style={{ color: 'rgb(255, 20, 147)' }}>{orderDetails.paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}</h6>
                  </div>


                  {orderDetails.paymentStatus !== 'Paid' && orderDetails.paymentMethod!=='COD'&& orderDetails.status !== 'Cancelled'&&(
                    <div className="d-flex align-items-center mb-2">
                      {/* <div className="flex-shrink-0">
                        <p className="text-muted mb-0">Thanh toán ngay:</p>
                      </div> */}
                      <Button color="primary" >
                        <Link to={orderDetails.redirectUrl} >
                          <span className="mb-0" style={{ color: 'rgb(255, 255, 255)' }}>Thanh toán ngay</span>
                        </Link>
                      </Button>
                    </div>
                  )}  </CardBody>
              </Card>
              {!orderDetails.isSuccessReviewed&&orderDetails.status==="Delivered" && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">
                      <i className="ri-secure-payment-line align-bottom me-1 text-muted"></i>{" "}
                      Đánh giá
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="live-preview">
                      <div>
                        <Button color="primary" onClick={() => handleOrderList()}>Đánh giá sản phẩm</Button>
                      </div>
                    </div>
                    <div className="d-none code-view">
                      <pre className="language-markup" style={{ height: "275px" }}>
                        <code>
                          <ScrollableModalExample />
                        </code>
                      </pre>
                    </div>
                  </CardBody>
                </Card>)}
              <Modal
                size="lg"
                isOpen={showProductReview}
                toggle={() => {
                  ShowProductReviewPopUp();
                }}
                scrollable={true}
                id="exampleModalScrollable"
              >
                <ModalHeader className="modal-title" id="exampleModalScrollableTitle" toggle={() => {
                  ShowProductReviewPopUp();
                }}>
                  Đánh giá sản phẩm
                </ModalHeader>
                <ModalBody>
                  {orderDetails && orderDetails.items && orderDetails.items.map((item, key) => (
                    <div key={key}>
                      {/* Chỉ hiển thị nút Đánh giá nếu sản phẩm chưa có đánh giá */}
                      {(!item.review || item.review.length === 0) && (
                        <table><tbody>
                          <EcommerceOrderProduct item={item} />
                          <Button
                            color="primary"
                            onClick={() => HandleAddReviewDetail(item)}
                          >
                            Đánh giá
                          </Button>
                        </tbody></table>
                      )}
                    </div>
                  ))}
                </ModalBody>
                <div className="modal-footer">
                  <Button
                    color="light"
                    onClick={() => setShowProductReview(false)}
                  >
                    Close
                  </Button>
                </div>
              </Modal>
              <Modal size="lg"
                isOpen={showAddReviewDetails}
                toggle={() => {
                  ShowAddReviewDetailsPopUp();
                }}
                scrollable={true}
                id="exampleModalScrollable">
                <ModalHeader className="modal-title" id="exampleModalScrollableTitle" toggle={() => {
                  ShowAddReviewDetailsPopUp();
                }}>
                  Đánh giá sản phẩm
                </ModalHeader>
                <ModalBody>
                  {selectedProduct && (
                    <div>
                      {/* Hiển thị thông tin sản phẩm */}
                      <AddReviewDetail item={selectedProduct}
                        orderId={orderId}
                        ShowAddReviewDetailsPopUp={ShowAddReviewDetailsPopUp}
                        tog_backdrop={tog_backdrop} />
                    </div>
                  )}
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>

      </div>
    </div>
  );
};

export default Content;
