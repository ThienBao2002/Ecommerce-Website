import React, { useState, useEffect } from 'react';
import {
  Row, Button, Input,
  Col,
  Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert, FormFeedback,
  Badge
} from 'reactstrap';
import * as Yup from "yup";
import { useFormik } from "formik";
import treeDataProvince from "../../../data/dataprovince";
import { ToastContainer } from "react-toastify";
import {
  startSession,
  getAddressesByUserId as onGetAddressesByUserId,
  addNewAddress as onAddNewAddress,
  deleteAddress as onDeleteAddress,
  updateAddress as onUpdateAddress,

} from "../../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
const MyAddress = (props) => {
  const [selectedRadio, setSelectedRadio] = useState('');
  const [modal_grid, setmodal_grid] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalCenter, setModalCenter] = useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const handleCloseModal = () => {
    setModalCenter(false);
  };
  //** ======================== CheckSession========================
  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken);
  /**==================================GET CUSTOMER======================= */
  // Inside your component
  const addresses = useSelector((state) => state.Ecommerce.addresses);

  const dispatch = useDispatch();
  function tog_grid() {
    setIsEditMode(false);
    setmodal_grid(!modal_grid);
    validation.resetForm();
    setIsDefaultAddress(false);
  }
  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts = 4; // Giới hạn số lần gọi API

  useEffect(() => {
    // Kiểm tra điều kiện để thực hiện gọi API
    if (isSessionActive && (!addresses || addresses.length === 0) && attemptCount < maxAttempts) {
      dispatch(onGetAddressesByUserId(token.userId));
      setAttemptCount(attemptCount + 1); // Tăng số lần thử
    }

    // Cập nhật địa chỉ mặc định khi có danh sách địa chỉ
    if (addresses && addresses.length > 0 && !props.selectedAddress) {
      const defaultAddress = addresses.find(item => item.isDefault);
      if (defaultAddress) {
        props.setSelectedAddress(defaultAddress);
      }
    }
    // eslint-disable-next-line
  }, [addresses, isSessionActive, attemptCount]); // Theo dõi attemptCount để biết khi nào cần gọi lại API


  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.id);

  };
  const handleClick = (index, address) => {
    const radioId = `vbtn-radio${index}`;
    setSelectedRadio(radioId);
    props.setSelectedAddress(address);
  };
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // eslint-disable-next-line
  const [selectedWard, setSelectedWard] = useState(null);
  const provinceOptions = Object.values(treeDataProvince).map((province) => ({
    value: province.value,
    label: province.label,
  }));
  // Tạo biểu thức để tạo danh sách options cho quận/huyện
  const districtOptions = selectedProvince
    ? Object.values(treeDataProvince[selectedProvince.value].children).map(
      (district) => ({
        value: district.value,
        label: district.label,
      })
    )
    : [];
  // Tạo biểu thức để tạo danh sách options cho phường/xã
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
  // Hàm xử lý khi chọn tỉnh/thành phố
  const handleSelectProvince = async (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedWard(null);
    await validation.setFieldValue("province", selectedOption);
    await validation.setFieldValue("district", "");
    await validation.setFieldValue("ward", "");
  };

  // Hàm xử lý khi chọn quận/huyện
  const handleSelectDistrict = async (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedWard(null);
    await validation.setFieldValue("district", selectedOption);
    await validation.setFieldValue("ward", "");
  };

  // Hàm xử lý khi chọn phường/xã
  const handleSelectWard = async (selectedOption) => {
    setSelectedWard(selectedOption);
    await validation.setFieldValue("ward", selectedOption);
  };
  const handleToggleChange = (event) => {
    setIsDefaultAddress(event.target.checked);
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
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
          "Vui lòng chọn tỉnh thành", // Thông điệp lỗi
          (value) => Object.keys(value || {}).length > 0 // Kiểm tra không phải đối tượng rỗng
        ),

      district: Yup.object()
        .required("Vui lòng chọn Thành phố/Quận/Huyện")
        .test(
          "is-not-empty",
          "Vui lòng chọn Thành phố/Quận/Huyện", // Thông điệp lỗi
          (value) => Object.keys(value || {}).length > 0 // Kiểm tra không phải đối tượng rỗng
        ),

      ward: Yup.object()
        .required("Vui lòng chọn Phường/Xã")
        .test(
          "is-not-empty",
          "Vui lòng chọn Phường/Xã", // Thông điệp lỗi
          (value) => Object.keys(value || {}).length > 0 // Kiểm tra không phải đối tượng rỗng
        ),
    }),

    onSubmit: async (values) => {
      await dispatch(startSession());
      const shippingAddress = `${values.address}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`;
      const newAddress = {
        _id: props.selectedAddress ? props.selectedAddress._id : null,
        userId: token.userId,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        shippingAddress: shippingAddress,
        isDefault:values.isDefault
      };

      if (!isEditMode) {
        try {
          const actionResult = await dispatch(onAddNewAddress(newAddress));
          if (onAddNewAddress.fulfilled.match(actionResult)) {
            console.log("Địa chỉ mới đã được thêm thành công:", actionResult.payload);
            dispatch(onGetAddressesByUserId(token.userId));
            tog_grid();
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
    if (isEditMode) {
      // Set các trường thông tin cơ bản
      validation.setFieldValue("name", props.selectedAddress.name);
      validation.setFieldValue("phoneNumber", props.selectedAddress.phoneNumber);
      validation.setFieldValue("email", props.selectedAddress.email);

      // Phân tách địa chỉ thành các thành phần
      const addressParts = props.selectedAddress.shippingAddress.split(',');
      validation.setFieldValue("address", addressParts[0].trim());
      //validation.setFieldValue("isDefault",props.selectedAddress.isDefault);
      setIsDefaultAddress(props.selectedAddress.isDefault);

      // Tìm kiếm giá trị tương ứng cho province, district, và ward trong các options
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
  }, [isEditMode, props.selectedAddress]);
  const handleDeleteAddress = async (address) => {
    if (address) {
      props.setSelectedAddress(address);
      setModalCenter(true);
    } else {
      try {
        // Gọi action xóa địa chỉ và chờ kết quả
        const addressUser = {
          userId: token.userId,
          addressId: props.selectedAddress._id
        };

        const actionResult = await dispatch(onDeleteAddress(addressUser));
        if (onDeleteAddress.fulfilled.match(actionResult)) {
          // Xử lý khi xóa thành công
          console.log("Địa chỉ đã được xóa thành công:", actionResult.payload);
          setModalCenter(false);
          props.setSelectedAddress(null); // Reset ID sau khi xóa
          dispatch(onGetAddressesByUserId(token.userId));
          // Cập nhật UI hoặc thông báo tới người dùng
        } else {
          // Xử lý khi action không thành công (ví dụ: không tìm thấy địa chỉ)
          console.error("Không thể xóa địa chỉ:", actionResult.error.message);
        }
      } catch (error) {
        // Xử lý lỗi ngoại lệ không xác định
        console.error("Lỗi khi xóa địa chỉ:", error);
      }
    }
  };
  useEffect(()=>{
    validation.setFieldValue("isDefault",isDefaultAddress);
    // eslint-disable-next-line
 },[isDefaultAddress]);
  const handleUpdateAddress = async (address) => {
    setmodal_grid(true);
    setIsEditMode(true);
    props.setSelectedAddress(address);
    console.log("address",address);
  };



  return (
    <>
      <ToastContainer closeButton={false} limit={1} />
      <Modal
        size='lg'
        isOpen={props.modal_scroll_MyAddress}
        toggle={() => {
          props.tog_scroll_MyAddress();
        }}
        scrollable={true}
        id="exampleModalScrollable"
      >
        <ModalHeader className="modal-title" id="exampleModalScrollableTitle" toggle={() => {
          props.tog_scroll_MyAddress();
        }}>
          Địa chỉ của tôi
        </ModalHeader>
        <ModalBody>
          <Row>
            {addresses.map((item, index) => (
              <Col md={6} key={item._id} className="mb-4">
                <div key={item._id} className="mb-2">
                  <Input
                    type="radio"
                    className="btn-check"
                    name="addressRadio"
                    id={`vbtn-radio${index}`}
                    onChange={handleRadioChange}
                    checked={selectedRadio === `vbtn-radio${index}`}
                  />
                  <Button
                    color=""
                    htmlFor={`vbtn-radio${index}`}
                    outline
                    onClick={() => handleClick(index, item)} // Thêm sự kiện onClick ở đây
                  >
                    <div className="d-flex">
                      <div className="flex-grow-1 text-muted overflow-hidden">
                      {item.isDefault ? (
                              <Badge className="badge-gradient-primary">Địa chỉ mặc định</Badge>
                            ):<span>#</span>}
                        <h5 className="fs-14 text-truncate">
                          <span className="text-body">
                            {item.name}
                          </span>
                        </h5>
                        <p className="text-muted text-truncate mb-0">
                          Số điện thoại :{" "}
                          <span className="fw-semibold text-body">
                            {item.phoneNumber}
                          </span>
                        </p>
                        <p className="text-muted text-truncate mb-0">
                          Email :{" "}
                          <span className="fw-semibold text-body">
                            {item.email}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex mt-4">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h5 className="fs-12 text-muted mb-0">
                              Địa chỉ :{item.shippingAddress}
                            </h5>
                          </div>

                        </div>
                      </div>

                    </div>
                    <div className="d-flex" style={{ marginTop: "10px" }}>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            onClick={() => handleUpdateAddress(item)}
                            color="light" > <i className="ri-brush-2-fill" />Chỉnh sửa</Button>
                          <Button
                            color="danger"
                            onClick={() => handleDeleteAddress(item)}> <i className="ri-delete-bin-5-line" />Xóa
                          </Button>
                        </div>
                      </div>
                    </div>

                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </ModalBody>

        <div className="modal-footer">
          <Button onClick={() => tog_grid()} className="btn btn-primary">Thêm địa chỉ mới</Button>
          <Button
            color="light"
            onClick={() => props.setmodal_scroll_MyAddress(false)}
          >
            Đóng
          </Button>
        </div>
      </Modal>

      <Modal
        size="lg"
        isOpen={modal_grid}
        toggle={() => {
          tog_grid();
        }}
      >
        <ModalHeader >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
            <h5 className="modal-title">
              {isEditMode ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
            </h5>

            <Button
              type="button" className="btn-close"
              onClick={() => {
                setmodal_grid(false);
              }}
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
            {/* Thông tin cá nhân */}
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

            {/* Email */}
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

            {/* Số điện thoại */}
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
                    Thành phố
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
                    Phường
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

            {/* Địa chỉ */}
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

            {/* Các thông tin khác và button */}
            {/* ... */}

            <Button color="primary" type="submit">
              {isEditMode ? 'Lưu chỉnh sửa' : 'Thêm'}
            </Button>
          </Form>

        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalCenter}
        toggle={handleCloseModal}
        centered
      >
        <ModalHeader toggle={handleCloseModal} className="modal-title">
          Xác nhận
        </ModalHeader>
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
              <Button
                onClick={() => handleDeleteAddress(null)}
                className="btn btn-danger">Xóa
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default MyAddress;
