import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
  Modal, ModalHeader, ModalBody, Input,
  Form, FormGroup, FormFeedback, Label,
  Alert,
} from "reactstrap";

import Select from "react-select";
import classnames from "classnames";
import { Autoplay } from "swiper/modules";
import SwiperCore from 'swiper/bundle';

import profileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import EcommerceOrders from "./EcommerceOrders";
import * as Yup from "yup";
import { useFormik } from "formik";
import treeDataProvince from "../../../data/dataprovince";

import {
  startSession,
  getAddressesByUserId as onGetAddressesByUserId,
  addNewAddress as onAddNewAddress,
  deleteAddress as onDeleteAddress,
  updateAddress as onUpdateAddress,
} from "../../../slices/thunks";
import AddressCard from "./AddressCard";
import VoucherSwiper from "../home/VoucherSwiper";

const Content = () => {
  const [modal_grid, setmodal_grid] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken) || null;
  const customer = useSelector((state) => state.Ecommerce.customers);

  useEffect(() => {
    console.log("customer", JSON.stringify(customer, null, 2));
  }, [customer]);

  const addresses = useSelector((state) => state.Ecommerce.addresses);
  const [isAddressesLoaded, setIsAddressesLoaded] = useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const dispatch = useDispatch();

  function tog_grid() {
    setIsEditMode(false);
    setmodal_grid(!modal_grid);
    setIsDefaultAddress(false);
    validation.resetForm();
  }

  useEffect(() => {
    if (isSessionActive && !isAddressesLoaded && (!addresses || addresses.length === 0)) {
      dispatch(onGetAddressesByUserId(token.userId));
      setIsAddressesLoaded(true);
    }
    // eslint-disable-next-line
  }, [addresses, isSessionActive, isAddressesLoaded]);

  SwiperCore.use([Autoplay]);
  const [modalCenter, setModalCenter] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleDeleteAddress = async (address) => {
    if (address) {
      setSelectedAddress(address);
      setModalCenter(true);
    } else {
      try {
        const addressUser = {
          userId: token.userId,
          addressId: selectedAddress._id
        };

        const actionResult = await dispatch(onDeleteAddress(addressUser));
        if (onDeleteAddress.fulfilled.match(actionResult)) {
          console.log("Địa chỉ đã được xóa thành công:", actionResult.payload);
          setModalCenter(false);
          setSelectedAddress(null);
          dispatch(onGetAddressesByUserId(token.userId));
        } else {
          console.error("Không thể xóa địa chỉ:", actionResult.error.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
      }
    }
  };

  const handleUpdateAddress = async (address) => {
    setmodal_grid(true);
    setIsEditMode(true);
    setSelectedAddress(address);
    console.log(address);
  };

  const handleCloseModal = () => {
    setModalCenter(false);
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
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

  const handleToggleChange = async (event) => {
    setIsDefaultAddress(event.target.checked);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      phoneNumber: "",
      address: "",
      province: "",
      district: "",
      ward: "",
      isDefault: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập họ và tên"),
      phoneNumber: Yup.number().required("Vui lòng nhập vào số điện thoại"),
      address: Yup.string().required("Vui nhập địa chỉ"),
      province: Yup.object()
        .required("Vui lòng chọn tỉnh thành")
        .test(
          "is-not-empty",
          "Vui lòng chọn tỉnh thành",
          (value) => Object.keys(value || {}).length > 0
        ),
      district: Yup.object()
        .required("Vui lòng chọn Thành phố/Quận/Huyện")
        .test(
          "is-not-empty",
          "Vui lòng chọn Thành phố/Quận/Huyện",
          (value) => Object.keys(value || {}).length > 0
        ),
      ward: Yup.object()
        .required("Vui lòng chọn Phường/Xã")
        .test(
          "is-not-empty",
          "Vui lòng chọn Phường/Xã",
          (value) => Object.keys(value || {}).length > 0
        ),
    }),
    onSubmit: async (values) => {
      await dispatch(startSession());
      const shippingAddress = `${values.address}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`;
      const newAddress = {
        _id: selectedAddress ? selectedAddress._id : null,
        userId: token.userId,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        shippingAddress: shippingAddress,
        isDefault: values.isDefault,
      };

      if (!isEditMode) {
        try {
          const actionResult = await dispatch(onAddNewAddress(newAddress));
          if (onAddNewAddress.fulfilled.match(actionResult)) {
            console.log("Địa chỉ mới đã được thêm thành công:", actionResult.payload);
            tog_grid();
            dispatch(onGetAddressesByUserId(token.userId));
          } else {
            console.error("Không thể thêm địa chỉ mới:", actionResult.error.message);
          }
        } catch (error) {
          console.error("Lỗi không xác định khi thêm địa chỉ mới:", error);
        }
      } else {
        try {
          const actionResult = await dispatch(onUpdateAddress(newAddress));
          if (onUpdateAddress.fulfilled.match(actionResult)) {
            console.log("Địa chỉ đã được cập nhật thành công:", actionResult.payload);
            tog_grid();
            dispatch(onGetAddressesByUserId(token.userId));
          } else {
            console.error("Không thể cập nhật địa chỉ:", actionResult.error.message);
          }
        } catch (error) {
          console.error("Lỗi không xác định khi cập nhật địa chỉ:", error);
        }
      }
    }
  });

  useEffect(() => {
    validation.setFieldValue("isDefault", isDefaultAddress);
    // eslint-disable-next-line
  }, [isDefaultAddress]);

  useEffect(() => {
    if (isEditMode) {
      validation.setFieldValue("name", selectedAddress.name);
      validation.setFieldValue("phoneNumber", selectedAddress.phoneNumber);
      validation.setFieldValue("email", selectedAddress.email);
      setIsDefaultAddress(selectedAddress.isDefault);

      const addressParts = selectedAddress.shippingAddress.split(',');
      validation.setFieldValue("address", addressParts[0].trim());

      const foundProvince = Object.values(treeDataProvince).find(p => p.label.trim() === addressParts[3].trim());
      if (foundProvince) {
        validation.setFieldValue("province", { value: foundProvince.value, label: foundProvince.label });
        const foundDistrict = Object.values(foundProvince.children).find(d => d.label.trim() === addressParts[2].trim());
        if (foundDistrict) {
          validation.setFieldValue("district", { value: foundDistrict.value, label: foundDistrict.label });
          const foundWard = Object.values(foundDistrict.children).find(w => w.label.trim() === addressParts[1].trim());
          if (foundWard) {
            validation.setFieldValue("ward", { value: foundWard.value, label: foundWard.label });
          }
        }
      }
    }
    // eslint-disable-next-line 
  }, [isEditMode, selectedAddress]);

  

  document.title = "Kiddo - Thời trang trẻ em | Thông tin cá nhân";
  if (!customer||customer.length===0) {
    return <div>Không tồn tại khách hàng</div>;
  }

  return (
    <div className="container">
      <ToastContainer closeButton={false} limit={1} />
      <div className="hm-section">
        <React.Fragment>
          <div className="page-content">
            <Container fluid>
              <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                  <img src={profileBg} alt="" className="profile-wid-img" />
                </div>
              </div>
              <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                <Row className="g-4">
                  <div className="col-auto">
                    <div className="avatar-lg">
                      <img
                        src={avatar1}
                        alt="user-img"
                        className="img-thumbnail rounded-circle"
                      />
                    </div>
                  </div>
                  <Col>
                    <div className="p-2">
                      <h3 className="text-white mb-1">{customer.name}</h3>
                      <p className="text-white text-opacity-75">{"Quyền: " + customer.role}</p>
                      <div className="hstack text-white-50 gap-1">
                        <div className="me-2">
                          <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <div className="col-auto">
                    <Card className="card-body text-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                      <div className="d-flex mb-4 align-items-center">
                        <div className="avatar-lg">
                          <img
                            src={customer.vipStatus.level.imageRank[0].url}
                            alt="rank-img"
                          />
                        </div>
                        <div className="flex-grow-1 ms-2" style={{ maxWidth: "200px" }}> {/* Giới hạn chiều rộng để tránh vỡ layout */}
                          <h5 className="card-title" title={customer.vipStatus.level.rankName} style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{customer.vipStatus.level.rankName}</h5>
                          <p className="card-text text-muted" title={customer.vipStatus.level.description} style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'justify'
                          }}>{customer.vipStatus.level.description}</p>
                        </div>
                      </div>
                      <h6 className="mb-1">{`Điểm: ${customer.vipStatus.points}`}</h6>
                      <p className="card-text text-muted">{`Cấp độ: ${customer.vipStatus.level.rankName}`}</p>
                    </Card>
                  </div>


                </Row>
              </div>
              <Row style={{ marginTop: "-60px" }}>
                <Col lg={12}>
                  <div>
                    <div className="d-flex profile-wrapper">
                      <Nav
                        pills
                        className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            href="#OdersHistoryTab"
                            className={classnames({ active: activeTab === "1" })}
                            onClick={() => { toggleTab("1"); }}
                          >
                            <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                            <span className="d-none d-md-inline-block">Lịch sử đơn hàng</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            href="#addressList"
                            className={classnames({ active: activeTab === "2" })}
                            onClick={() => { toggleTab("2"); }}
                          >
                            <i className="ri-price-tag-line d-inline-block d-md-none"></i>{" "}
                            <span className="d-none d-md-inline-block">Sổ địa chỉ</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            href="#voucherList"
                            className={classnames({ active: activeTab === "3" })}
                            onClick={() => { toggleTab("3"); }}
                          >
                            <i className="ri-price-tag-line d-inline-block d-md-none"></i>{" "}
                            <span className="d-none d-md-inline-block">Voucher</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <div className="flex-shrink-0">
                        {activeTab === "2" &&
                          <Button className="btn btn-secondary" onClick={() => tog_grid()}>
                            <i className="ri-edit-box-line align-bottom"></i> Thêm địa chỉ
                          </Button>
                        }
                      </div>
                    </div>

                    <TabContent activeTab={activeTab} className="pt-4">
                      <TabPane tabId="1">
                        <EcommerceOrders />
                      </TabPane>

                      <TabPane tabId="2">
                        <Card>
                          <CardBody>
                            <h4>Địa chỉ của tôi</h4>
                            <Row>
                              {console.log(addresses)}
                              {Array.isArray(addresses) && addresses.map((item, key) => (
                                <Col xxl={3} sm={6} key={key}>
                                  <AddressCard
                                    item={item}
                                    handleUpdateAddress={handleUpdateAddress}
                                    handleDeleteAddress={handleDeleteAddress}
                                  />
                                </Col>
                              ))}
                            </Row>
                          </CardBody>
                        </Card>
                      </TabPane>

                      <TabPane tabId="3">
                        <VoucherSwiper
                          nameTitleVoucher={"Voucher"}
                          vouchersFilter={customer.vouchers.slice(0, 10)}                                     
                          isProfilePage={true}                                                                          
                        />

                      </TabPane>
                    </TabContent>
                  </div>
                </Col>

                <Modal size="lg" isOpen={modal_grid} toggle={tog_grid}>
                  <ModalHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 className="modal-title">{isEditMode ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h5>
                      <Button
                        type="button" className="btn-close"
                        onClick={() => setmodal_grid(false)}
                        aria-label="Close"
                        style={{ marginLeft: "620px", backgroundColor: "#ffffff" }}
                      >
                      </Button>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <Form className="needs-validation" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <FormGroup className='mb-3'>
                        <Input
                          className="form-check-input code-switcher"
                          type="checkbox"
                          checked={isDefaultAddress}
                          onChange={handleToggleChange}
                        />
                        <Label className="form-label text-muted">Đặt làm địa chỉ mặc định</Label>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom01">Họ và tên</Label>
                        <Input
                          name="name"
                          placeholder="Nhập vào họ và tên"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={validation.touched.name && validation.errors.name ? true : false}
                        />
                        {validation.touched.name && validation.errors.name && (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom02">Email</Label>
                        <Input
                          name="email"
                          placeholder="Email"
                          type="email"
                          className="form-control"
                          id="validationCustom02"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                        />
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">Số điện thoại</Label>
                        <Input
                          name="phoneNumber"
                          placeholder="Nhập vào số điện thoại"
                          type="text"
                          className="form-control"
                          id="validationCustom03"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.phoneNumber || ""}
                          invalid={validation.touched.phoneNumber && validation.errors.phoneNumber ? true : false}
                        />
                        {validation.touched.phoneNumber && validation.errors.phoneNumber && (
                          <FormFeedback type="invalid">
                            {validation.errors.phoneNumber}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="province" className="form-label">Tỉnh</Label>
                            <Select
                              name="province"
                              options={provinceOptions}
                              value={validation.values.province}
                              onBlur={validation.handleBlur}
                              onChange={handleSelectProvince}
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
                            <Label htmlFor="district" className="form-label">Thành phố</Label>
                            <Select
                              name="district"
                              options={districtOptions}
                              value={validation.values.district}
                              onBlur={validation.handleBlur}
                              onChange={handleSelectDistrict}
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
                            <Label htmlFor="ward" className="form-label">Phường</Label>
                            <Select
                              name="ward"
                              options={wardOptions}
                              value={validation.values.ward}
                              onBlur={validation.handleBlur}
                              onChange={handleSelectWard}
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
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom05">Địa chỉ</Label>
                        <textarea
                          name="address"
                          placeholder="Nhập vào địa chỉ"
                          className={`form-control ${validation.errors.address && validation.touched.address ? "is-invalid" : ""}`}
                          id="validationCustom05"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.address || ""}
                        ></textarea>
                        {validation.touched.address && validation.errors.address && (
                          <FormFeedback type="invalid">
                            {validation.errors.address}
                          </FormFeedback>
                        )}
                      </FormGroup>
                      <Button color="primary" type="submit">
                        {isEditMode ? 'Lưu chỉnh sửa' : 'Thêm'}
                      </Button>
                    </Form>
                  </ModalBody>
                </Modal>
              </Row>
              <Modal isOpen={modalCenter} toggle={handleCloseModal} centered>
                <ModalHeader toggle={handleCloseModal} className="modal-title">Xác nhận</ModalHeader>
                <ModalBody className="text-center p-5">
                  <lord-icon
                    src="https://cdn.lordicon.com/hrqwmuhr.json"
                    trigger="loop"
                    colors="primary:#121331,secondary:#08a88a"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div className="mt-4">
                    <h4 className="mb-3">Bạn có muốn xóa địa chỉ này không?</h4>
                    <div className="hstack gap-2 justify-content-center">
                      <Button color="light" onClick={handleCloseModal}>Đóng</Button>
                      <Button onClick={() => handleDeleteAddress(null)} className="btn btn-danger">Xóa</Button>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </Container>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Content;
