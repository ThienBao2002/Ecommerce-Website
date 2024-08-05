import React, { useEffect, useState } from "react";
//import data tỉnh thành

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
  FormFeedback,
  Alert,
  FormGroup,
  Button,
  Badge
} from "reactstrap";
import MyAddress from "./MyAddress";
import Select from "react-select";
import classnames from "classnames";
//import { orderSummary } from "../../../data/ecommerce";
import treeDataProvince from "../../../data/dataprovince";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
//Import actions
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  addNewOrder as onAddNewOrder,
  getProducts as onGetProducts,
  addCheckVoucher as onAddCheckVoucher,
  getCustomerById as onGetCustomerById,
  startSession
} from "../../../slices/thunks";
import VoucherSwiper from "../home/VoucherSwiper";

const Content = (props) => {
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [modal, setModal] = useState(false);
  const [deletemodal, setDeleteModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modal_scroll_myAddress, setmodal_scroll_myAddress] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  function tog_scroll_myAddress() {
    setmodal_scroll_myAddress(!modal_scroll_myAddress);
  }
  const dispatch = useDispatch();

  const navigate = useNavigate();
  //mua ngay
  const location = useLocation();
  const selectDashboardData = createSelector(
    (state) => state.Ecommerce.products,
    (products) => products
  );
  const products = useSelector(selectDashboardData);
  const checkVouchers = useSelector((state) => state.Ecommerce.checkVoucher);
  const customer = useSelector((state) => state.Ecommerce.customers);



  useEffect(() => {
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
    // eslint-disable-next-line
  }, [products, selectedAddress]);

  const items = location.state.items; // Truy cập thông tin sản phẩm và số lượng từ location.state
  const totalItem = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shippingCost = [
    { label: "Giao hàng tiết kiệm", value: 30000 },
    { label: "Giao hàng hỏa tốc", value: 100000 },
  ];

  const toggledeletemodal = () => {
    setDeleteModal(!deletemodal);
  };

  const togglemodal = () => {
    setModal(!modal);
  };

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // eslint-disable-next-line
  const [selectedWard, setSelectedWard] = useState(null);

  const provinceOptions = Object.values(treeDataProvince).map((province) => ({
    value: province.value,
    label: province.label,
  }));

  const districtOptions = selectedProvince
    ? Object.values(treeDataProvince[selectedProvince.value].children).map(
      (district) => ({
        value: district.value,
        label: district.label,
      })
    )
    : [];

  const wardOptions = selectedDistrict
    ? Object.values(
      treeDataProvince[selectedProvince.value].children[
        selectedDistrict.value
      ].children
    ).map((ward) => ({
      value: ward.value,
      label: ward.label,
    }))
    : [];

  const handleSelectProvince = async (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedWard(null);
    await validation.setFieldValue("province", selectedOption);
    await validation.setFieldValue("district", "");
    await validation.setFieldValue("ward", "");
  };

  const handleSelectDistrict = async (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedWard(null);
    await validation.setFieldValue("district", selectedOption);
    await validation.setFieldValue("ward", "");
  };

  const handleSelectWard = async (selectedOption) => {
    setSelectedWard(selectedOption);
    await validation.setFieldValue("ward", selectedOption);
  };

  const handleHidePaymentForm = () => {
    setShowPaymentForm(false);
  };

  // eslint-disable-next-line
  const handleShowPaymentForm = () => {
    setShowPaymentForm(true);
  };

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  //** ======================== CheckSession========================
  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken);

  //validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      items: [],
      taxFee: 10,
      voucher: 0,
      voucherValue: 0,
      voucherCode: "",
      totalItem: 0,
      shippingCost: 30000,
      total: 0,
      email: "",
      phoneNumber: "",
      province: {},
      district: {},
      ward: {},
      address: "",
      paymentMethod: "COD",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập họ và tên"),
      phoneNumber: Yup.number().required("Vui lòng nhập vào số điện thoại"),
      address: Yup.string()
        .when([], () => {
          // Kiểm tra nếu selectedAddress không khả dụng, yêu cầu nhập trường address
          return selectedAddress ? Yup.string().notRequired() : Yup.string().required("Vui lòng nhập địa chỉ");
        }),
      province: Yup.object()
        .when([], () => {
          return selectedAddress ? Yup.object().notRequired() : Yup.object()
            .required("Vui lòng chọn tỉnh thành")
            .test(
              "is-not-empty",
              "Vui lòng chọn tỉnh thành",
              (value) => value && Object.keys(value).length > 0
            );
        }),
      district: Yup.object()
        .when([], () => {
          return selectedAddress ? Yup.object().notRequired() : Yup.object()
            .required("Vui lòng chọn Thành phố/Quận/Huyện")
            .test(
              "is-not-empty",
              "Vui lòng chọn Thành phố/Quận/Huyện",
              (value) => value && Object.keys(value).length > 0
            );
        }),
      ward: Yup.object()
        .when([], () => {
          return selectedAddress ? Yup.object().notRequired() : Yup.object()
            .required("Vui lòng chọn Phường/Xã")
            .test(
              "is-not-empty",
              "Vui lòng chọn Phường/Xã",
              (value) => value && Object.keys(value).length > 0
            );
        }),
    }),

    onSubmit: async (values) => {
      await dispatch(startSession());
      const shippingAddress = selectedAddress ? selectedAddress.shippingAddress : `${values.address}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`;
      // Xử lý dữ liệu khác
      const newOrder = {
        name: values.name,
        taxFee: values.taxFee,
        voucher: values.voucher,
        totalItem: values.totalItem,
        shippingCost: values.shippingCost,
        total: values.total,
        email: values.email,
        phoneNumber: values.phoneNumber,
        shippingAddress: shippingAddress,
        paymentMethod: values.paymentMethod,
        voucherValue: values.voucherValue,
        voucherCode: values.voucherCode,
        items: values.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          variant1Id: item.variant1 ? item.variant1._id : "",
          variant2Id: item.variant2 ? item.variant2._id : "",

          // Thêm các trường dữ liệu khác của sản phẩm tương ứng
        })),
      };
      if (isSessionActive) {
        newOrder.userId = token.userId; // Thay userId bằng giá trị thực tế của userId
      }
      if (validation.values.paymentMethod === "COD") {
        try {
          const actionResult = await dispatch(onAddNewOrder(newOrder));
          if (onAddNewOrder.fulfilled.match(actionResult)) {
            setDiscountCode("");
            validation.resetForm();
            setTimeout(() => {
              navigate('/', { state: { items, products } });
            }, 2000);

          } else {
            console.log('Failed to create the order:', actionResult.error.message);
            if (actionResult.error.message === "Số lượng tồn không đủ"||actionResult.error.message==="Số lượng mua phải lớn hơn 0") {
              toggleTab(3);
              setTimeout(() => {
                navigate('/cart');
              }, 5000);
            }
            else if (actionResult.error.message === "Voucher không trong thời gian hiệu lực")
            {
              toggleTab(3);
              handleVoucherApply("");
            }
          }
        } catch (error) {
          console.log('Error dispatching onAddNewOrder for COD:', error);
          //navigate('/cart');
          setDiscountCode("");
        }
      }
      
      if (validation.values.paymentMethod === "VNPay") {
        try {
          const actionResult = await dispatch(onAddNewOrder(newOrder));
          if (onAddNewOrder.fulfilled.match(actionResult)) {
            const orderUrl = actionResult.payload.data.redirectUrl;
            setDiscountCode("");
            if (orderUrl) {
              window.location.href = orderUrl;
            } else {
              navigate('/order-info', { state: { orderDetails: actionResult.payload } });
            }
          } else {
            if (actionResult.error.message === "Số lượng tồn không đủ"||actionResult.error.message==="Số lượng mua phải lớn hơn 0") {
              toggleTab(3);
              setTimeout(() => {
                navigate('/cart');
              }, 5000);
            }
            else if (actionResult.error.message === "Voucher không trong thời gian hiệu lực")
            {
              toggleTab(3);
              handleVoucherApply("");
            }
          }
        } catch (error) {
          setDiscountCode("");
          console.error('Error dispatching onAddNewOrder for VNPay:', error);
        }
      }
      


    },
  });

  useEffect(() => {
    // Chuyển đổi các giá trị từ chuỗi sang số nếu cần
    const totalItemValue = parseFloat(totalItem); // Đảm bảo rằng totalItem là một số
    const voucher = parseFloat(validation.values.voucher);
    const taxFee = parseFloat(validation.values.taxFee);
    const shippingCost = parseFloat(validation.values.shippingCost);

    let voucherValue = 0;
    if (checkVouchers.discountType === "Percent") {
      voucherValue = totalItemValue * voucher / 100; // Giảm giá tính theo phần trăm của tổng tiền hàng
    } else if (checkVouchers.discountType === "Cash") {
      voucherValue = voucher; // Giảm giá trực tiếp bằng tiền mặt
    }

    // Tính toán giá trị total
    const total = totalItemValue - voucherValue + shippingCost + (totalItemValue * taxFee) / 100;

    // Cập nhật giá trị total bằng cách sử dụng setFieldValue
    validation.setFieldValue("total", total);
    validation.setFieldValue("totalItem", totalItemValue);
    validation.setFieldValue("voucherValue", voucherValue);
    validation.setFieldValue("items", items);
    validation.setFieldValue("voucherCode",discountCode);
    // eslint-disable-next-line
  }, [
    validation.values.totalItem,
    validation.values.voucher,
    validation.values.taxFee,
    validation.values.shippingCost,
    validation.errors.province,
    validation.errors.district,
    validation.errors.ward,
    totalItem,
    discountCode,
    items,
  ]);

  useEffect(() => {
    if (isSessionActive && selectedAddress) {
      validation.setFieldValue("name", selectedAddress.name);
      validation.setFieldValue("phoneNumber", selectedAddress.phoneNumber);
      validation.setFieldValue("email", selectedAddress.email);
    }
    // eslint-disable-next-line
  }, [selectedAddress, isSessionActive])


  useEffect(() => {
    if (checkVouchers.length !== 0) {
      validation.setFieldValue("voucher", checkVouchers.discountValue)
      validation.setFieldValue("voucherCode", checkVouchers.code)
    }
    else {
      validation.setFieldValue("voucher", 0);
    }
    // eslint-disable-next-line
  }, [checkVouchers])



  const handleVoucherApply = (voucherCode) => {
    setDiscountCode(voucherCode);
    handleSubmitVoucher(voucherCode);
  };

  const handleSubmitVoucher = async (voucherCode) => {
    const voucher = {
      voucherCode: voucherCode,
      userId: token.userId,
      total: validation.values.totalItem,
    };
    try {
      const actionResult = await dispatch(onAddCheckVoucher(voucher));
      if (onAddCheckVoucher.fulfilled.match(actionResult)) {
      } else {
      }
    } catch (error) {
      console.error("Exception when calling onAddCheckVoucher:", error);
    }
  };

  useEffect(() => {
    if (token === null)
      return;
    if (customer || !customer.length || token !== null) {
      dispatch(onGetCustomerById(token.userId));
    }
    // eslint-disable-next-line
  }, [dispatch, token]);


  const findBestVoucher = (vouchers, totalItem) => {
    let bestVoucher = null;
    let maxDiscount = 0;
  
    vouchers.forEach(voucher => {
      if (voucher.minPurchase <= totalItem) {
        let discount = 0;
        if (voucher.discountType === "Percent") {
          discount = (voucher.discountValue / 100) * totalItem;
        } else if (voucher.discountType === "Cash") {
          discount = voucher.discountValue;
        }
  
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestVoucher = voucher;
        }
      }
    });
  
    return bestVoucher;
  };
  
  const sortVouchers = (vouchers, totalItem) => {
    const bestVoucher = findBestVoucher(vouchers, totalItem);
    if (!bestVoucher) return vouchers; // Return original array if no best voucher found
  
    let sortedVouchers = vouchers.filter(voucher => voucher !== bestVoucher);
    sortedVouchers.unshift(bestVoucher); // Place the best voucher at the start
    return sortedVouchers;
  };
  
  // Make sure customer.vouchers is valid and use empty array as fallback
  const availableVouchers = customer?.vouchers?.filter(voucher => voucher.minPurchase <= totalItem) || [];
  
  const sortedAvailableVouchers = sortVouchers(availableVouchers, totalItem);

  

  return (
    <div className="container">
      <div className="hm-section">
        <React.Fragment>
          <ToastContainer closeButton={false} limit={1} />
          <div className="page-content">
            <Container fluid>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col xl="8">
                    <Card>
                      <CardBody className="checkout-tab">
                        <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                          <Nav
                            className="nav-pills nav-justified custom-nav"
                            role="tablist"
                          >
                            <NavItem role="presentation">
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 1,
                                    done: activeTab <= 4 && activeTab >= 0,
                                  },
                                  "p-3 fs-15"
                                )}
                                onClick={() => {
                                  toggleTab(1);
                                }}
                              >
                                <i className="ri-user-2-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                Thông tin cá nhân
                              </NavLink>
                            </NavItem>
                            <NavItem role="presentation">
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 2,
                                    done: activeTab <= 4 && activeTab > 1,
                                  },
                                  "p-3 fs-15"
                                )}
                                onClick={() => {
                                  toggleTab(2);
                                }}
                              >
                                <i className="ri-truck-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                Thông tin gửi hàng
                              </NavLink>
                            </NavItem>
                            <NavItem role="presentation">
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 3,
                                    done: activeTab <= 4 && activeTab > 2,
                                  },
                                  "p-3 fs-15"
                                )}
                                onClick={() => {
                                  toggleTab(3);
                                }}
                              >
                                <i className="ri-bank-card-line fs-16 p-2 bg-primary-subtle text-primary rounded-circle align-middle me-2"></i>
                                Thông tin thanh toán
                              </NavLink>
                            </NavItem>
                            <NavItem role="presentation">
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 4,
                                    done: activeTab <= 4 && activeTab > 3,
                                  },
                                  "p-3 fs-15"
                                )}
                                onClick={() => {
                                  toggleTab(4);
                                }}
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

                            {isSessionActive ?
                              <Card className="card-body">
                                <div className="d-flex mb-4 align-items-center">
                                  <div className="flex-grow-1 ms-2">
                                    <h5 className="card-title mb-1">Địa chỉ của tôi</h5>
                                    {selectedAddress?.isDefault && (
                                      <Badge className="badge-gradient-primary">Địa chỉ mặc định</Badge>
                                    )}
                                    <p className="text-muted mb-0">{"Họ và tên: " + selectedAddress?.name}</p>
                                    <p className="text-muted mb-0">{"Email: " + selectedAddress?.email}</p>
                                    <p className="text-muted mb-0">{"Địa chỉ: " + selectedAddress?.shippingAddress}</p>
                                    <p className="text-muted mb-0">{"Số điện thoại: " + selectedAddress?.phoneNumber}</p>
                                  </div>
                                </div>
                                <Button color="primary" onClick={() => tog_scroll_myAddress()}>Thay đổi</Button>

                              </Card> :
                              <div>
                                <Row>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="billinginfo-firstName"
                                      className="form-label"
                                    >
                                      Họ và tên
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="name-title-input"
                                      placeholder="Nhập vào họ và tên"
                                      name="name"
                                      value={validation.values.name || ""}
                                      onBlur={validation.handleBlur}
                                      onChange={validation.handleChange}
                                      invalid={
                                        validation.errors.name &&
                                          validation.touched.name
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.errors.name &&
                                      validation.touched.name ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.name}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Row>
                                <Row>
                                  <Col sm={6}>
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="billinginfo-email"
                                        className="form-label"
                                      >
                                        Email
                                        <span className="text-muted">
                                          (Optional)
                                        </span>
                                      </Label>
                                      <Input
                                        type="text"
                                        className="form-control"
                                        id="name-title-input"
                                        placeholder="Email"
                                        name="email"
                                        value={validation.values.email || ""}
                                        onBlur={validation.handleBlur}
                                        onChange={validation.handleChange}
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
                                        id="phone-title-input"
                                        placeholder="Nhập vào số điện thoại"
                                        name="phoneNumber"
                                        value={
                                          validation.values.phoneNumber || ""
                                        }
                                        onBlur={validation.handleBlur}
                                        onChange={validation.handleChange}
                                        invalid={
                                          validation.errors.phoneNumber &&
                                            validation.touched.phoneNumber
                                            ? true
                                            : false
                                        }
                                      />
                                      {validation.errors.phoneNumber &&
                                        validation.touched.phoneNumber ? (
                                        <FormFeedback type="invalid">
                                          {validation.errors.phoneNumber}
                                        </FormFeedback>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md={4}>
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="province"
                                        className="form-label"
                                      >
                                        Tỉnh
                                      </Label>
                                      <Select
                                        name="province"
                                        options={provinceOptions}
                                        value={validation.values.province}
                                        onBlur={validation.handleBlur}
                                        onChange={async (selectedOption) => {
                                          handleSelectProvince(selectedOption);
                                        }}
                                      />
                                      {validation.touched.province && validation.errors.province ? (
                                        <Alert color="danger">
                                          <strong>Có lỗi xảy ra! </strong>
                                          {validation.errors.province}
                                        </Alert>
                                      ) : null}
                                    </div>
                                  </Col>

                                  <Col md={4}>
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="district"
                                        className="form-label"
                                      >
                                        Thành phố/Quận/Huyện
                                      </Label>
                                      <Select
                                        name="district"
                                        options={districtOptions}
                                        value={validation.values.district}
                                        onBlur={validation.handleBlur}
                                        onChange={(selectedOption) => {
                                          handleSelectDistrict(selectedOption);
                                        }}
                                      />
                                      {validation.touched.district && validation.errors.district ? (
                                        <Alert color="danger">
                                          <strong>Có lỗi xảy ra! </strong>
                                          {validation.errors.district}
                                        </Alert>
                                      ) : null}
                                    </div>
                                  </Col>

                                  <Col md={4}>
                                    <div className="mb-3">
                                      <Label
                                        htmlFor="ward"
                                        className="form-label"
                                      >
                                        Phường/Xã
                                      </Label>
                                      <Select
                                        name="ward"
                                        options={wardOptions}
                                        value={validation.values.ward}
                                        onBlur={validation.handleBlur}
                                        onChange={(selectedOption) => {
                                          handleSelectWard(selectedOption);
                                        }}
                                      />
                                      {validation.touched.ward && validation.errors.ward ? (
                                        <Alert color="danger">
                                          <strong>Có lỗi xảy ra! </strong>
                                          {validation.errors.ward}
                                        </Alert>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>

                                <div className="mb-3">
                                  <FormGroup>
                                    <Label
                                      htmlFor="billinginfo-address"
                                      className="form-label"
                                    >
                                      Địa chỉ
                                    </Label>
                                    <textarea
                                      className={`form-control ${validation.errors.address &&
                                        validation.touched.address
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      id="billinginfo-address"
                                      placeholder="Nhập vào địa chỉ"
                                      name="address"
                                      value={validation.values.address || ""}
                                      onBlur={validation.handleBlur}
                                      onChange={validation.handleChange}
                                    ></textarea>
                                    {validation.errors.address &&
                                      validation.touched.address ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.address}
                                      </FormFeedback>
                                    ) : null}
                                  </FormGroup>
                                </div>
                              </div>}
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

                          </TabPane>

                          <TabPane tabId={2}>
                            <div>
                              <h5 className="mb-1">Thông tin gửi hàng</h5>
                              <p className="text-muted mb-4">
                                Vui lòng chọn hình thức giao hàng
                              </p>
                            </div>

                            <div className="mt-4">
                              <div className="mt-4">
                                <h5 className="fs-14 mb-3">
                                  Phương thức giao hàng
                                </h5>

                                <Row className="g-4">
                                  <Col lg={6}>
                                    <div className="form-check card-radio">
                                      <Input
                                        id="shippingMethod01"
                                        name="shippingMethod"
                                        type="radio"
                                        className="form-check-input"
                                        onChange={() =>
                                          validation.setFieldValue(
                                            "shippingCost",
                                            shippingCost[0].value
                                          )
                                        }
                                        defaultChecked
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="shippingMethod01"
                                      >
                                        <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                          {new Intl.NumberFormat().format(
                                            shippingCost[0].value
                                          )}{" "}
                                          đ
                                        </span>
                                        <span className="fs-14 mb-1 text-wrap d-block">
                                          {shippingCost[0].label}
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
                                        onChange={() =>
                                          validation.setFieldValue(
                                            "shippingCost",
                                            shippingCost[1].value
                                          )
                                        }
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="shippingMethod02"
                                      >
                                        <span className="fs-20 float-end mt-2 text-wrap d-block fw-semibold">
                                          {new Intl.NumberFormat().format(
                                            shippingCost[1].value
                                          )}{" "}
                                          đ
                                        </span>
                                        <span className="fs-14 mb-1 text-wrap d-block">
                                          {shippingCost[1].label}
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
                                className="btn btn-label previestab"
                                onClick={() => {
                                  toggleTab(activeTab - 1);
                                }}
                              >
                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                {"-- "}
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
                              <Col lg={6} sm={6}>
                                <div>
                                  <div className="form-check card-radio">
                                    <Input
                                      id="paymentMethod01"
                                      name="paymentMethod"
                                      type="radio"
                                      className="form-check-input"
                                      onChange={() => {
                                        validation.setFieldValue(
                                          "paymentMethod",
                                          "COD"
                                        );
                                        handleHidePaymentForm();
                                      }}
                                      defaultChecked
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="paymentMethod01"
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
                              <Col lg={6} sm={6}>
                                <div>
                                  <div className="form-check card-radio">
                                    <Input
                                      id="paymentMethod02"
                                      name="paymentMethod"
                                      type="radio"
                                      className="form-check-input"
                                      onChange={() => {
                                        validation.setFieldValue(
                                          "paymentMethod",
                                          "VNPay"
                                        );
                                        handleHidePaymentForm();
                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="paymentMethod02"
                                    >
                                      <span className="fs-16 text-muted me-2">
                                        <i className="ri-paypal-fill align-bottom"></i>
                                      </span>
                                      <span className="fs-14 text-wrap">
                                        VNPay
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              </Col>
                              {/* <Col lg={4} sm={6}>
                                <div>
                                  <div className="form-check card-radio">
                                    <Input
                                      id="paymentMethod03"
                                      name="paymentMethod"
                                      type="radio"
                                      className="form-check-input"
                                      onChange={() => {
                                        validation.setFieldValue(
                                          "paymentMethod",
                                          "credit"
                                        );
                                        handleShowPaymentForm();
                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="paymentMethod03"
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
                              </Col> */}
                            </Row>
                            {showPaymentForm && (
                              <div
                                className="collapse show"
                                id="paymentmethodCollapse"
                              >
                                <Card className="p-4 border shadow-none mb-0 mt-4">
                                  <Row className="gy-3">
                                    <Col md={12}>
                                      <Label
                                        htmlFor="cc-name"
                                        className="form-label"
                                      >
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
                                      <Label
                                        htmlFor="cc-cvv"
                                        className="form-label"
                                      >
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
                                  Phương thức thanh toán của bạn được bảo mật
                                  bởi mã hóa SSL
                                </div>
                              </div>
                            )}

                            <div className="d-flex align-items-start gap-3 mt-4">
                              <button
                                type="button"
                                className="btn btn-light btn-label previestab"
                                onClick={() => {
                                  toggleTab(activeTab - 1);
                                }}
                              >
                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                {"--"}
                                Trở về đặt hàng
                              </button>
                              <button
                                type="submit"
                                className="btn btn-secondary btn-label right ms-auto nexttab"
                                onClick={() => {
                                  if (
                                    Object.keys(validation.errors).length !== 0
                                  ) {
                                    toggleTab(activeTab - 2); // Nếu có lỗi validation, giảm 2 tab
                                  } else {
                                    toggleTab(activeTab + 1); // Nếu không có lỗi validation, tăng 1 tab
                                  }
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
                              <h5>Cảm ơn bạn đã đặt hàng </h5>
                              {/*<p className="text-muted">
                                Bạn sẽ nhận được mail xác nhận kèm theo thông
                                tin đơn hàng
                              </p>

                              <h3 className="fw-semibold">
                                Mã đơn hàng:{" "}
                                <a
                                  href="apps-ecommerce-order-details"
                                  className="text-decoration-underline"
                                >
                                  KHAIHASO123
                                </a>
                              </h3>*/}
                            </div>
                          </TabPane>
                        </TabContent>
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
                              {Array.isArray(items) &&
                                items.map((item, index) => {
                                  const product = products.find(
                                    (p) => p._id === item.product._id
                                  );
                                  if (product) {
                                    return (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td>
                                            <div className="avatar-md bg-light rounded p-1">


                                              <img
                                                src={product.variant1 ?
                                                  (product?.imagesVariant?.find(img => img.name === item.variant1?.imageName)?.url || product?.images[0]?.url) : product.images[0]?.url}
                                                //src={product.images[0].url}
                                                // src={
                                                //   product.variant1
                                                //     ? (
                                                //       product.imagesVariant.find(img => img._id === item.variant1Id)?.url ||
                                                //       product.images[0]?.url
                                                //     )
                                                //     : product.images[0]?.url
                                                // }
                                                alt=""
                                                className="img-fluid d-block"
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <h5 className="fs-14">
                                              <Link
                                                to={`/product-details-v2/${product._id}`}

                                                className="text-body"
                                              >
                                                {product.name.length > 29
                                                  ? `${product.name.slice(
                                                    0,
                                                    45
                                                  )}...`
                                                  : product.name}
                                              </Link>
                                            </h5>
                                            <p className="text-muted mb-0">
                                              {new Intl.NumberFormat().format(
                                                item.price
                                              )}{" "}
                                              x {item.quantity}
                                            </p>

                                            <p className="text-muted mb-0">
                                              {item.variant1 && item.variant2 && `${item.variant1.name} ${item.variant2.name}`}
                                            </p>
                                            <p className="text-muted mb-0">
                                              {item.variant1 && !item.variant2 && `${item.variant1.name} `}
                                            </p>
                                          </td>
                                          <td className="text-end">
                                            {new Intl.NumberFormat().format(
                                              item.price * item.quantity
                                            )}{" "}
                                            đ
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  } else {
                                    // Xử lý trường hợp không tìm thấy sản phẩm
                                    return (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td>
                                            <span>Product Not Found</span>
                                          </td>
                                          <td>
                                            {/* Hiển thị thông tin khác nếu cần*/}
                                          </td>
                                          <td></td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  }
                                })}

                              <tr>
                                <td className="fw-semibold" colSpan="2">
                                  Tổng :
                                </td>
                                <td className="fw-semibold text-end">
                                  {" "}
                                  {new Intl.NumberFormat().format(validation.values.totalItem)}đ
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="3">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="discountCode" style={{ fontWeight: 'bold' }}>
                                      Mã giảm giá:
                                    </label>
                                    <div style={{ display: 'flex', flex: '1', justifyContent: 'flex-end', alignItems: 'center' }}>
                                      <Input
                                        type="text"
                                        id="discountCode"
                                        value={discountCode}
                                        onChange={e => setDiscountCode(e.target.value)}
                                        placeholder="Nhập mã giảm giá"
                                        className="discount-input"
                                        style={{ marginRight: '10px', flex: '1' }}
                                      />
                                      <Button
                                        color="primary"
                                        onClick={(e) => {
                                          handleSubmitVoucher(discountCode); // Gọi hàm xử lý với sự kiện
                                        }}
                                      >
                                        Áp dụng
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>


                              <tr>
                                <td colSpan="2">
                                  Voucher (<span style={{ fontSize: '0.8em' }}>{validation.values.voucherCode}</span>)
                                </td>

                                <td className="text-end">
                                  -{new Intl.NumberFormat().format(
                                    validation.values.voucherValue
                                  )}
                                  đ
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2">Phí vận chuyển :</td>
                                <td className="text-end">
                                  {new Intl.NumberFormat().format(
                                    validation.values.shippingCost
                                  )}
                                  đ
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2">Thuế VAT (10%): </td>
                                <td className="text-end">
                                  {" "}
                                  {new Intl.NumberFormat().format(
                                    (validation.values.taxFee *
                                      validation.values.totalItem) /
                                    100
                                  )}
                                  đ
                                </td>
                              </tr>
                              <tr className="table-active">
                                <th colSpan="2">Thành tiền (VND) :</th>
                                <td className="text-end">
                                  <span className="fw-semibold">
                                    {" "}
                                    {new Intl.NumberFormat().format(
                                      validation.values.total
                                    )}
                                    đ
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>{" "}
              </Form>
              {sortedAvailableVouchers.length > 0 && token &&(
                <VoucherSwiper
                  nameTitleVoucher="Mã giảm giá của bạn"
                  vouchersFilter={sortedAvailableVouchers.slice(0, 10)}
                  isCheckoutPage={true}
                  handleVoucherApply={handleVoucherApply}
                />
              )}

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
            <ModalHeader
              toggle={() => {
                setDeleteModal(!deletemodal);
              }}
            ></ModalHeader>
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
                <button
                  type="button"
                  className="btn w-sm btn-danger"
                  onClick={() => {
                    setDeleteModal(!deletemodal);
                  }}
                >
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
                  <select
                    className="form-select"
                    id="state"
                    data-plugin="choices"
                  >
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
          <MyAddress
            setSelectedAddress={setSelectedAddress}
            selectedAddress={selectedAddress}
            tog_scroll_MyAddress={tog_scroll_myAddress}
            setmodal_scroll_MyAddress={setmodal_scroll_myAddress}
            modal_scroll_MyAddress={modal_scroll_myAddress}
          ></MyAddress>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Content;
