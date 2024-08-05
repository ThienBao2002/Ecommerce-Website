import React, { useState } from "react";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";

import {
  Container,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import Select from "react-select";
import classnames from "classnames";
import { orderSummary } from "../../common/data/ecommerce";
import { Link } from "react-router-dom";

const EcommerceCheckout = () => {
  const [selectedCountry, setselectedCountry] = useState(null);
  const [selectedState, setselectedState] = useState(null);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [modal, setModal] = useState(false);
  const [deletemodal, setDeleteModal] = useState(false);

  const toggledeletemodal = () => {
    setDeleteModal(!deletemodal);
  };

  const togglemodal = () => {
    setModal(!modal);
  };

  function handleSelectCountry(selectedCountry) {
    setselectedCountry(selectedCountry);
  }

  function handleSelectState(selectedState) {
    setselectedState(selectedState);
  }

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const productState = [
    {
      options: [
        { label: "Tỉnh", value: "Chọn tỉnh" },
        { label: "An Giang", value: "An Giang" },
        { label: "Bà Rịa – Vũng Tàu", value: "Bà Rịa – Vũng Tàu" },
        { label: "Bắc Giang", value: "Bắc Giang" },
        { label: "Bắc Kạn", value: "Bắc Kạn" },
        { label: "Bạc Liêu", value: "Bạc Liêu" },
        { label: "Bắc Ninh", value: "Bắc Ninh" },
        { label: "Bến Tre", value: "Bến Tre" },
        { label: "Bình Định", value: "Bình Định" },
        { label: "Bình Dương", value: "Bình Dương" },
        { label: "Bình Phước", value: "Bình Phước" },
        { label: "Bình Thuận", value: "Bình Thuận" },
        { label: "Cà Mau", value: "Cà Mau" },
        { label: "Cần Thơ", value: "Cần Thơ" },
        { label: "Cao Bằng", value: "Cao Bằng" },
        { label: "Đà Nẵng", value: "Đà Nẵng" },
        { label: "Đắk Lắk", value: "Đắk Lắk" },
        { label: "Đắk Nông", value: "Đắk Nông" },
        { label: "Điện Biên", value: "Điện Biên" },
        { label: "Đồng Nai", value: "Đồng Nai" },
        { label: "Đồng Tháp", value: "Đồng Tháp" },
        { label: "Hà Giang", value: "Hà Giang" },
        { label: "Hà Nam", value: "Hà Nam" },
        { label: "Hà Nội", value: "Hà Nội" },
        { label: "Hà Tĩnh", value: "Hà Tĩnh" },
        { label: "Hải Dương", value: "Hải Dương" },
        { label: "Hải Phòng", value: "Hải Phòng" },
        { label: "Hậu Giang", value: "Hậu Giang" },
        { label: "Hòa Bình", value: "Hòa Bình" },
        { label: "Hưng Yên", value: "Hưng Yên" },
        { label: "Khánh Hòa", value: "Khánh Hòa" },
        { label: "Kiên Giang", value: "Kiên Giang" },
        { label: "Kon Tum", value: "Kon Tum" },
        { label: "Lai Châu", value: "Lai Châu" },
        { label: "Lâm Đồng", value: "Lâm Đồng" },
        { label: "Lạng Sơn", value: "Lạng Sơn" },
        { label: "Lào Cai", value: "Lào Cai" },
        { label: "Long An", value: "Long An" },
        { label: "Nam Định", value: "Nam Định" },
        { label: "Nghệ An", value: "Nghệ An" },
        { label: "Ninh Bình", value: "Ninh Bình" },
        { label: "Ninh Thuận", value: "Ninh Thuận" },
        { label: "Phú Thọ", value: "Phú Thọ" },
        { label: "Phú Yên", value: "Phú Yên" },
        { label: "Quảng Bình", value: "Quảng Bình" },
        { label: "Quảng Nam", value: "Quảng Nam" },
        { label: "Quảng Ngãi", value: "Quảng Ngãi" },
        { label: "Quảng Ninh", value: "Quảng Ninh" },
        { label: "Quảng Trị", value: "Quảng Trị" },
        { label: "Sóc Trăng", value: "Sóc Trăng" },
        { label: "Sơn Lah", value: "Sơn La" },
        { label: "Tây Ninh", value: "Tây Ninh" },
        { label: "Thái Bình", value: "Thái Bình" },
        { label: "Thái Nguyên", value: "Thái Nguyên" },
        { label: "Thanh Hóa", value: "Thanh Hóa" },
        { label: "Thừa Thiên Huế", value: "Thừa Thiên Huế" },
        { label: "Tiền Giang", value: "Tiền Giang" },
        { label: "TP Hồ Chí Minh", value: "TP Hồ Chí Minh" },
        { label: "Trà Vinh", value: "Trà Vinh" },
        { label: "Tuyên Quang", value: "Tuyên Quang" },
        { label: "Vĩnh Long", value: "Vĩnh Long" },
        { label: "Vĩnh Phúc", value: "Vĩnh Phúc" },
        { label: "	Yên Bái", value: "	Yên Bái" },
      ],
    },
  ];

  const productCountry = [
    {
      options: [
        { label: "Select Country...", value: "Select Country" },
        { label: "Việt Nam", value: "Việt Nam" },
      ],
    },
  ];

  document.title = "Checkout | Kiddo - Trang quản trị ";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Checkout" pageTitle="Ecommerce" />

          <Row>
            <Col xl="8">
              <Card>
                <CardBody className="checkout-tab">
                  <Form action="#">
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <Nav
                        className="nav-pills nav-justified custom-nav"
                        role="tablist"
                      >
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 1, done: (activeTab <= 4 && activeTab >= 0) }, "p-3 fs-15")}
                            onClick={() => { toggleTab(1); }}
                          >
                            <i className="ri-user-2-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                            Thông tin cá nhân
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 2, done: activeTab <= 4 && activeTab > 1 }, "p-3 fs-15")}
                            onClick={() => { toggleTab(2); }}
                          >
                            <i className="ri-truck-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                            Thông tin gửi hàng
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3 fs-15")}
                            onClick={() => { toggleTab(3); }}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                            Thông tin thanh toán
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink href="#"
                            className={classnames({ active: activeTab === 4, done: activeTab <= 4 && activeTab > 3 }, "p-3 fs-15")}
                            onClick={() => { toggleTab(4); }}
                          >
                            <i className="ri-checkbox-circle-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                            Hoàn tất
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={1} id="pills-bill-info">
                        <div>
                          <h5 className="mb-1">Thông tin cá nhân</h5>
                          <p className="text-muted mb-4">
                            Vui lòng điền vào thông tin bên dưới
                          </p>
                        </div>

                        <div>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-firstName"
                                  className="form-label"
                                >
                                  Tên
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="billinginfo-firstName"
                                  placeholder="Nhập vào tên"
                                />
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-lastName"
                                  className="form-label"
                                >
                                  họ
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="billinginfo-lastName"
                                  placeholder="Nhập vào họ"
                                />
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-email"
                                  className="form-label"
                                >
                                  Email
                                  <span className="text-muted">(Optional)</span>
                                </Label>
                                <Input
                                  type="email"
                                  className="form-control"
                                  id="billinginfo-email"
                                  placeholder="Nhập địa chỉ email"
                                />
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-phone"
                                  className="form-label"
                                >
                                  Số điện thoại
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="billinginfo-phone"
                                  placeholder="Nhập vào số điện thoại"
                                />
                              </div>
                            </Col>
                          </Row>

                          <div className="mb-3">
                            <Label
                              htmlFor="billinginfo-address"
                              className="form-label"
                            >
                              Địa chỉ
                            </Label>
                            <textarea
                              className="form-control"
                              id="billinginfo-address"
                              placeholder="Nhập vào địa chỉ"
                              rows="3"
                            ></textarea>
                          </div>

                          <Row>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label htmlFor="country" className="form-label">
                                  Đất nước
                                </Label>
                                <Select
                                  value={selectedCountry}
                                  onChange={() => {
                                    handleSelectCountry();
                                  }}
                                  options={productCountry}
                                  id="country"
                                ></Select>
                              </div>
                            </Col>

                            <Col md={4}>
                              <div className="mb-3">
                                <Label htmlFor="state" className="form-label">
                                  Tỉnh
                                </Label>
                                <Select
                                  id="state"
                                  value={selectedState}
                                  onChange={() => {
                                    handleSelectState();
                                  }}
                                  options={productState}
                                ></Select>
                              </div>
                            </Col>

                            <Col md={4}>
                              <div className="mb-3">
                                <Label htmlFor="zip" className="form-label">
                                  Mã tỉnh thành
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="zip"
                                  placeholder="Enter zip code"
                                />
                              </div>
                            </Col>
                          </Row>

                          <div className="d-flex align-items-start gap-3 mt-3">
                            <button
                              type="button"
                              className="btn btn-secondary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                              Tiến hành gửi hàng
                            </button>
                          </div>
                        </div>
                      </TabPane>

                      <TabPane tabId={2}>
                        <div>
                          <h5 className="mb-1">Thông tin gửi hàng</h5>
                          <p className="text-muted mb-4">
                            Vui lòng điền vào thông tin bên dưới
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="flex-grow-1">
                              <h5 className="fs-14 mb-0">Địa chỉ đã lưu</h5>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                className="btn btn-sm btn-info mb-3"
                                onClick={togglemodal}
                              >
                                Thêm địa chỉ
                              </button>
                            </div>
                          </div>
                          <Row className="gy-3">
                            <Col lg={4} sm={6}>
                              <div className="form-check card-radio">
                                <Input
                                  id="shippingAddress01"
                                  name="shippingAddress"
                                  type="radio"
                                  className="form-check-input"
                                  defaultChecked
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="shippingAddress01"
                                >
                                  <span className="mb-4 fw-semibold d-block text-muted text-uppercase">
                                    Home Address
                                  </span>

                                  <span className="fs-14 mb-2 d-block">
                                    Marcus Alfaro
                                  </span>
                                  <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                    4739 Bubby Drive Austin, TX 78729
                                  </span>
                                  <span className="text-muted fw-normal d-block">
                                    Mo. 012-345-6789
                                  </span>
                                </Label>
                              </div>
                              <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">
                                <div>
                                  <Link
                                    to="#"
                                    className="d-block text-body p-1 px-2"
                                    onClick={togglemodal}
                                  >
                                    <i className="ri-pencil-fill text-muted align-bottom me-1"></i>
                                    Chỉnh sửa
                                  </Link>
                                </div>
                                <div>
                                  <Link
                                    to="#"
                                    className="d-block text-body p-1 px-2"
                                    onClick={toggledeletemodal}
                                  >
                                    <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                    Loại bỏ
                                  </Link>
                                </div>
                              </div>
                            </Col>
                            <Col lg={4} sm={6}>
                              <div className="form-check card-radio">
                                <Input
                                  id="shippingAddress02"
                                  name="shippingAddress"
                                  type="radio"
                                  className="form-check-input"
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="shippingAddress02"
                                >
                                  <span className="mb-4 fw-semibold d-block text-muted text-uppercase">
                                    Office Address
                                  </span>

                                  <span className="fs-14 mb-2 d-block">
                                    James Honda
                                  </span>
                                  <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                    1246 Virgil Street Pensacola, FL 32501
                                  </span>
                                  <span className="text-muted fw-normal d-block">
                                    Mo. 012-345-6789
                                  </span>
                                </Label>
                              </div>
                              <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">
                                <div>
                                  <Link
                                    to="#"
                                    className="d-block text-body p-1 px-2"
                                    onClick={togglemodal}
                                  >
                                    <i className="ri-pencil-fill text-muted align-bottom me-1"></i>
                                    Chỉnh sửa
                                  </Link>
                                </div>
                                <div>
                                  <Link
                                    to="#"
                                    className="d-block text-body p-1 px-2"
                                    onClick={toggledeletemodal}
                                  >
                                    <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                    Loại bỏ
                                  </Link>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <div className="mt-4">
                            <h5 className="fs-14 mb-3">Phương thức giao hàng</h5>

                            <Row className="g-4">
                              <Col lg={6}>
                                <div className="form-check card-radio">
                                  <Input
                                    id="shippingMethod01"
                                    name="shippingMethod"
                                    type="radio"
                                    className="form-check-input"
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod01"
                                  >
                                    <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                      Miễn phí
                                    </span>
                                    <span className="fs-14 mb-1 text-wrap d-block">
                                      Miễn phí giao hàng
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                      Dự kiến giao hàng từ 3 đến 5 ngày
                                    </span>
                                  </Label>
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="form-check card-radio">
                                  <Input
                                    id="shippingMethod02"
                                    name="shippingMethod"
                                    type="radio"
                                    className="form-check-input"
                                    defaultChecked
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod02"
                                  >
                                    <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                      100.000 VND
                                    </span>
                                    <span className="fs-14 mb-1 text-wrap d-block">
                                      Giao hàng hỏa tốc
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                      Có hàng trong vòng 24 giờ
                                    </span>
                                  </Label>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>

                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Trở về thông tin cá nhân
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-label right ms-auto nexttab"
                            onClick={() => {
                              toggleTab(activeTab + 1);
                            }}
                          >
                            <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                            Tiếp tục thanh toán
                          </button>
                        </div>
                      </TabPane>

                      <TabPane tabId={3}>
                        <div>
                          <h5 className="mb-1">Phương thức thanh toán</h5>
                          <p className="text-muted mb-4">
                            Vui lòng điền vào thông tin bên dưới
                          </p>
                        </div>

                        <Row className="g-4">
                          <Col lg={4} sm={6}>
                            <div>
                              <div className="form-check card-radio">
                                <Input
                                  id="paymentMethod01"
                                  name="paymentMethod"
                                  type="radio"
                                  className="form-check-input"
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="paymentMethod01"
                                >
                                  <span className="fs-16 text-muted me-2">
                                    <i className="ri-paypal-fill align-bottom"></i>
                                  </span>
                                  <span className="fs-14 text-wrap">
                                    Paypal
                                  </span>
                                </Label>
                              </div>
                            </div>
                          </Col>
                          <Col lg={4} sm={6}>
                            <div>
                              <div className="form-check card-radio">
                                <Input
                                  id="paymentMethod02"
                                  name="paymentMethod"
                                  type="radio"
                                  className="form-check-input"
                                  defaultChecked
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="paymentMethod02"
                                >
                                  <span className="fs-16 text-muted me-2">
                                    <i className="ri-bank-card-fill align-bottom"></i>
                                  </span>
                                  <span className="fs-14 text-wrap">
                                    Thẻ tín dụng
                                  </span>
                                </Label>
                              </div>
                            </div>
                          </Col>

                          <Col lg={4} sm={6}>
                            <div>
                              <div className="form-check card-radio">
                                <Input
                                  id="paymentMethod03"
                                  name="paymentMethod"
                                  type="radio"
                                  className="form-check-input"
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="paymentMethod03"
                                >
                                  <span className="fs-16 text-muted me-2">
                                    <i className="ri-money-dollar-box-fill align-bottom"></i>
                                  </span>
                                  <span className="fs-14 text-wrap">
                                    Trả tiền trực tiếp
                                  </span>
                                </Label>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <div
                          className="collapse show"
                          id="paymentmethodCollapse"
                        >
                          <Card className="p-4 border shadow-none mb-0 mt-4">
                            <Row className="gy-3">
                              <Col md={12}>
                                <Label htmlFor="cc-name" className="form-label">
                                  Tên chủ thẻ
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cc-name"
                                  placeholder="Enter name"
                                />
                                <small className="text-muted">
                                  Tên in trên thẻ
                                </small>
                              </Col>

                              <Col md={6}>
                                <Label
                                  htmlFor="cc-number"
                                  className="form-label"
                                >
                                  Số tài khoản
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cc-number"
                                  placeholder="xxxx xxxx xxxx xxxx"
                                />
                              </Col>

                              <Col md={3}>
                                <Label
                                  htmlFor="cc-expiration"
                                  className="form-label"
                                >
                                  Hạn sử dụng
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cc-expiration"
                                  placeholder="MM/YY"
                                />
                              </Col>

                              <Col md={3}>
                                <Label htmlFor="cc-cvv" className="form-label">
                                  Mã CVV
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cc-cvv"
                                  placeholder="xxx"
                                />
                              </Col>
                            </Row>
                          </Card>
                          <div className="text-muted mt-2 fst-italic">
                            <i
                              data-feather="lock"
                              className="text-muted icon-xs"
                            ></i>{" "}
                            Phương thức thanh toán của bạn được bảo mật bởi mã hóa SSL
                          </div>
                        </div>

                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Trờ về đặt hàng
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-label right ms-auto nexttab"
                            onClick={() => {
                              toggleTab(activeTab + 1);
                            }}
                          >
                            <i className="ri-shopping-basket-line label-icon align-middle fs-16 ms-2"></i>
                            Hoàn thành đơn hàng
                          </button>
                        </div>
                      </TabPane>

                      <TabPane tabId={4} id="pills-finish">
                        <div className="text-center py-5">
                          <div className="mb-4">
                            <lord-icon
                              src="https://cdn.lordicon.com/lupuorrc.json"
                              trigger="loop"
                              colors="primary:#0ab39c,secondary:#405189"
                              style={{ width: "120px", height: "120px" }}
                            ></lord-icon>
                          </div>
                          <h5>Cảm ơn! Đơn hàng của bạn đã hoàn tất  </h5>
                          <p className="text-muted">
                            Bạn sẽ nhận được mail xác nhận kèm theo thông tin đơn hàng
                          </p>

                          <h3 className="fw-semibold">
                            Mã đơn hàng:{" "}
                            <a
                              href="apps-ecommerce-order-details"
                              className="text-decoration-underline"
                            >
                             KHAIHASO123
                            </a>
                          </h3>
                        </div>
                      </TabPane>
                    </TabContent>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Tổng đơn hàng</h5>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless align-middle mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th style={{ width: "90px" }} scope="col">
                            Sản phẩm
                          </th>
                          <th scope="col">Tên sản phẩm</th>
                          <th scope="col" className="text-end">
                            Giá
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderSummary.map((product, key) => (
                          <React.Fragment key={key}>
                            <tr>
                              <td>
                                <div className="avatar-md bg-light rounded p-1">
                                  <img
                                    src={product.img}
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                              </td>
                              <td>
                                <h5 className="fs-14">
                                  <Link
                                    to="/apps-ecommerce-product-details"
                                    className="text-body"
                                  >
                                    {product.name}
                                  </Link>
                                </h5>
                                <p className="text-muted mb-0">
                                  $ {product.price} x {product.quantity}
                                </p>
                              </td>
                              <td className="text-end">$ {product.total}</td>
                            </tr>
                          </React.Fragment>
                        ))}

                        <tr>
                          <td className="fw-semibold" colSpan="2">
                            Tổng :
                          </td>
                          <td className="fw-semibold text-end">$ 359.96</td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            Giảm giá{" "}
                            <span className="text-muted">(VELZON15)</span>:{" "}
                          </td>
                          <td className="text-end">- $ 50.00</td>
                        </tr>
                        <tr>
                          <td colSpan="2">Phí vận chuyển :</td>
                          <td className="text-end">$ 24.99</td>
                        </tr>
                        <tr>
                          <td colSpan="2">Thuế (12%): </td>
                          <td className="text-end">$ 100.000</td>
                        </tr>
                        <tr className="table-active">
                          <th colSpan="2">Thành tiền (VND) :</th>
                          <td className="text-end">
                            <span className="fw-semibold">$353.15</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {/* modal Delete Address */}
      <Modal
        isOpen={deletemodal}
        role="dialog"
        autoFocus={true}
        centered
        id="removeItemModal"
        toggle={toggledeletemodal}
      >
        <ModalHeader toggle={() => {
          setDeleteModal(!deletemodal);
        }}>
        </ModalHeader>
        <ModalBody>
          <div className="mt-2 text-center">
            <lord-icon
              src="https://cdn.lordicon.com/gsqxdxog.json"
              trigger="loop"
              colors="primary:#f7b84b,secondary:#f06548"
              style={{ width: "100px", height: "100px" }}
            ></lord-icon>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Bạn có chắc không ?</h4>
              <p className="text-muted mx-4 mb-0">
                Bạn có chắc muốn loại bỏ địa chỉ này không ?
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light"
              onClick={() => {
                setDeleteModal(!deletemodal);
              }}
            >
              Đóng
            </button>
            <button type="button" className="btn w-sm btn-danger" onClick={() => {
              setDeleteModal(!deletemodal);
            }}>
              Xóa
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* modal Add Address */}
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered
        id="addAddressModal"
        toggle={togglemodal}
      >
        <ModalHeader
          toggle={() => {
            setModal(!modal);
          }}
        >
          <h5 className="modal-title" id="addAddressModalLabel">
            Địa chỉ
          </h5>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Tên
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                placeholder="Nhập tên"
              />
            </div>

            <div className="mb-3">
              <Label for="addaddress-textarea" className="form-label">
                Dịa chỉ
              </Label>
              <textarea
                className="form-control"
                id="addaddress-textarea"
                placeholder="Nhập địa chỉ"
                rows="2"
              ></textarea>
            </div>

            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Số điện thoại
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="mb-3">
              <Label for="state" className="form-label">
                Địa chỉ là:
              </Label>
              <select className="form-select" id="state" data-plugin="choices">
                <option value="homeAddress">Nhà riêng (7am to 10pm)</option>
                <option value="officeAddress">Cơ quan (11am to 7pm)</option>
              </select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setModal(!modal);
            }}
          >
            Đóng
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              setModal(!modal);
            }}
          >
            Lưu
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default EcommerceCheckout;
