import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col, Container, Form, Row, Button, FormGroup,
    Label,
    Input,
    FormFeedback
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
    addNewVoucher as onAddNewVoucher,
    updateVoucher as onUpdateVoucher,
    getVouchers as onGetVouchers
} from "../../../slices/thunks";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import ImageArrayComponent from "../EcommerceProducts/ImageArrayComponent";

const EcommerceAddVoucher = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useDispatch();
    const history = useNavigate();
    const voucherId = useParams();
    const vouchers = useSelector(state => state.Ecommerce.vouchers);
    const [selectedFilesImageVoucher, setSelectedFilesImageVoucher] = useState([]);

    useEffect(() => {
        if (!vouchers || vouchers.length === 0) {
            dispatch(onGetVouchers());
        }
    }, [vouchers]);

    const convertDateTimeFormat = (originalDateTime) => {
        const date = new Date(originalDateTime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const revertDateTimeFormat = (formattedDateTime) => {
        const [timePart, datePart] = formattedDateTime.split(' ');
        const [hours, minutes] = timePart.split(':');
        const [day, month, year] = datePart.split('/');
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            description: "",
            discountType: "",
            discountValue: 0,
            minPurchase: 0,
            startDate: "",
            endDate: "",
            quantity: 0,
            isActive: "true",
            imageVoucher: [],
            voucherType: "",
            userVoucherLimit: 0,
        },

        validationSchema: Yup.object({
            description: Yup.string().required("Vui lòng nhập mô tả"),
            discountType: Yup.string().required("Vui lòng chọn loại giảm giá"),
            discountValue: Yup.number().required("Vui lòng nhập giá trị giảm giá").positive("Giá trị giảm giá phải lớn hơn 0"),
            minPurchase: Yup.number().required("Vui lòng nhập giá trị mua tối thiểu").min(0, "Giá trị mua tối thiểu phải lớn hơn hoặc bằng 0"),
            startDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
            endDate: Yup.string().required("Vui lòng chọn ngày kết thúc")
                .test(
                    "endDate-after-startDate",
                    "Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày",
                    function (endDate) {
                        const startDate = this.parent.startDate;
                        if (!startDate || !endDate) {
                            return true;
                        }
                        const startDateObj = new Date(startDate);
                        const endDateObj = new Date(endDate);
                        return endDateObj.getTime() >= startDateObj.getTime() + 86400000;
                    }
                ),
            quantity: Yup.number().required("Vui lòng nhập số lượng").min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
            imageVoucher: Yup.array().test(
                "images-validation",
                "Vui lòng thêm tối thiểu 1 ảnh",
                function (value) {
                    return value && value.length >= 1;
                }
            ),
            voucherType: Yup.string().required("Vui lòng chọn loại voucher"),
            userVoucherLimit: Yup.number().required("Vui lòng nhập giới hạn số lần sử dụng mỗi khách hàng").min(0, "Giới hạn phải lớn hơn hoặc bằng 0"),
        }),

        onSubmit: async (values) => {
            const voucher = new FormData();
            voucher.append("description", values.description);
            voucher.append("discountType", values.discountType);
            voucher.append("discountValue", values.discountValue);
            voucher.append("minPurchase", values.minPurchase);
            voucher.append("startDate", convertDateTimeFormat(values.startDate));
            voucher.append("endDate", convertDateTimeFormat(values.endDate));
            voucher.append("quantity", values.quantity);
            voucher.append("isActive", values.isActive);
            voucher.append("voucherType", values.voucherType);
            voucher.append("userVoucherLimit", values.userVoucherLimit);

            const fileNamesImageVoucher = values.imageVoucher.map(file => file.name).join(', ');
            voucher.append("nameImageVoucher", fileNamesImageVoucher);
            values.imageVoucher.forEach((file) => {
                if (file instanceof File)
                    voucher.append("imageVoucher", file);
            });

            if (!isEditMode) {
                try {
                    const actionResult = await dispatch(onAddNewVoucher(voucher));
                    for (const [key, value] of voucher.entries()) {
                        console.log(`${key}:`, value);
                    }
                    if (onAddNewVoucher.fulfilled.match(actionResult)) {
                        console.log("Voucher đã được tạo thành công:", actionResult.payload);
                        await dispatch(onGetVouchers());
                        history("/apps-ecommerce-vouchers");
                        validation.resetForm();
                    } else {
                        console.error("Không thể tạo voucher:", actionResult.error);
                    }
                } catch (error) {
                    console.error("Lỗi không xác định khi tạo voucher:", error);
                }
            } else {
                voucher.append("id", voucherId._id);
                for (const [key, value] of voucher.entries()) {
                    console.log(`${key}:`, value);
                }
                try {
                    const actionResult = await dispatch(onUpdateVoucher(voucher));
                    if (onUpdateVoucher.fulfilled.match(actionResult)) {
                        console.log("Voucher đã được cập nhật thành công:", actionResult.payload);
                        await dispatch(onGetVouchers());
                        history("/apps-ecommerce-vouchers");
                        validation.resetForm();
                    } else {
                        console.error("Không thể cập nhật voucher:", actionResult.error);
                    }
                } catch (error) {
                    console.error("Lỗi không xác định khi cập nhật voucher:", error);
                }
            }
        },

    });

    useEffect(() => {
        const fetchVoucherData = () => {
            const foundVoucher = vouchers.find(
                (voucher) => voucher._id === voucherId._id
            );
            if (foundVoucher) {
                setIsEditMode(true);
                validation.setFieldValue("description", foundVoucher.description);
                validation.setFieldValue("discountType", foundVoucher.discountType);
                validation.setFieldValue("discountValue", foundVoucher.discountValue);
                validation.setFieldValue("minPurchase", foundVoucher.minPurchase);
                validation.setFieldValue("startDate", foundVoucher.startDate);
                validation.setFieldValue("endDate", foundVoucher.endDate);
                const formattedStartDate = revertDateTimeFormat(foundVoucher.startDate);
                const formattedEndDate = revertDateTimeFormat(foundVoucher.endDate);
                validation.setFieldValue("startDate", formattedStartDate);
                validation.setFieldValue("endDate", formattedEndDate);
                setSelectedFilesImageVoucher(foundVoucher.imageVoucher || []);
                validation.setFieldValue("imageVoucher", selectedFilesImageVoucher);
                validation.setFieldValue("quantity", foundVoucher.quantity);
                validation.setFieldValue("isActive", foundVoucher.isActive.toString());
                validation.setFieldValue("voucherType", foundVoucher.voucherType);
                validation.setFieldValue("userVoucherLimit", foundVoucher.userVoucherLimit);
            }
        };

        fetchVoucherData();
    }, [voucherId, vouchers]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Tạo Voucher" pageTitle="Quản lý Voucher" />
                    <Card>
                        <CardHeader className="align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Thông tin cơ bản</h4>
                        </CardHeader>
                        <CardBody>
                            <div className="live-preview">
                                <Form
                                    className="needs-validation"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                    }}
                                >
                                    <Row>
                                        <Col md={8}>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="description">Mô tả</Label>
                                                        <Input
                                                            name="description"
                                                            placeholder="Nhập mô tả voucher"
                                                            type="text"
                                                            className="form-control"
                                                            id="description"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.description || ""}
                                                            invalid={
                                                                validation.touched.description &&
                                                                    validation.errors.description
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.description &&
                                                            validation.errors.description ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.description}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="discountType">Loại giảm giá</Label>
                                                        <Input
                                                            name="discountType"
                                                            type="select"
                                                            className="form-select"
                                                            id="discountType"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.discountType || ""}
                                                            invalid={
                                                                validation.touched.discountType &&
                                                                    validation.errors.discountType
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <option value="">Chọn loại giảm giá</option>
                                                            <option value="Percent">Phần trăm</option>
                                                            <option value="Cash">Giảm giá trực tiếp</option>
                                                        </Input>
                                                        {validation.touched.discountType &&
                                                            validation.errors.discountType ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.discountType}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="discountValue">Giá trị giảm giá</Label>
                                                        <Input
                                                            name="discountValue"
                                                            placeholder="Nhập giá trị giảm giá"
                                                            type="number"
                                                            className="form-control"
                                                            id="discountValue"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.discountValue || ""}
                                                            invalid={
                                                                validation.touched.discountValue &&
                                                                    validation.errors.discountValue
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.discountValue &&
                                                            validation.errors.discountValue ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.discountValue}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="minPurchase">Giá trị mua tối thiểu</Label>
                                                        <Input
                                                            name="minPurchase"
                                                            placeholder="Nhập giá trị mua tối thiểu"
                                                            type="number"
                                                            className="form-control"
                                                            id="minPurchase"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.minPurchase || ""}
                                                            invalid={
                                                                validation.touched.minPurchase &&
                                                                    validation.errors.minPurchase
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.minPurchase &&
                                                            validation.errors.minPurchase ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.minPurchase}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="startDate">Ngày bắt đầu</Label>
                                                        <Input
                                                            name="startDate"
                                                            type="datetime-local"
                                                            className="form-control"
                                                            id="startDate"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.startDate || ""}
                                                            invalid={validation.touched.startDate && validation.errors.startDate ? true : false}
                                                        />
                                                        {validation.touched.startDate && validation.errors.startDate ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.startDate}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="endDate">Ngày kết thúc</Label>
                                                        <Input
                                                            name="endDate"
                                                            type="datetime-local"
                                                            className="form-control"
                                                            id="endDate"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.endDate || ""}
                                                            invalid={validation.touched.endDate && validation.errors.endDate ? true : false}
                                                        />
                                                        {validation.touched.endDate && validation.errors.endDate ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.endDate}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="quantity">Số lượng</Label>
                                                        <Input
                                                            name="quantity"
                                                            placeholder="Nhập số lượng"
                                                            type="number"
                                                            className="form-control"
                                                            id="quantity"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.quantity || ""}
                                                            invalid={
                                                                validation.touched.quantity &&
                                                                    validation.errors.quantity
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.quantity &&
                                                            validation.errors.quantity ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.quantity}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="isActive">Trạng thái</Label>
                                                        <Input
                                                            name="isActive"
                                                            type="select"
                                                            className="form-select"
                                                            id="isActive"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.isActive}
                                                            invalid={
                                                                validation.touched.isActive &&
                                                                    validation.errors.isActive
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <option value="true">Hoạt động</option>
                                                            <option value="false">Không hoạt động</option>
                                                        </Input>
                                                        {validation.touched.isActive &&
                                                            validation.errors.isActive ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.isActive}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="voucherType">Loại Voucher</Label>
                                                        <Input
                                                            name="voucherType"
                                                            type="select"
                                                            className="form-select"
                                                            id="voucherType"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.voucherType || ""}
                                                            invalid={
                                                                validation.touched.voucherType &&
                                                                    validation.errors.voucherType
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <option value="">Chọn loại voucher</option>
                                                            <option value="Bronze">Đồng</option>
                                                            <option value="Silver">Bạc</option>
                                                            <option value="Gold">Vàng</option>
                                                            <option value="Diamond">Kim Cương</option>
                                                            <option value="VIP">VIP</option>
                                                            <option value="VVIP">VVIP</option>
                                                            <option value="allUsers">Tất cả user</option>
                                                        </Input>
                                                        {validation.touched.voucherType &&
                                                            validation.errors.voucherType ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.voucherType}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="userVoucherLimit">Giới hạn số lần sử dụng mỗi khách hàng</Label>
                                                        <Input
                                                            name="userVoucherLimit"
                                                            placeholder="Nhập giới hạn số lần sử dụng mỗi khách hàng"
                                                            type="number"
                                                            className="form-control"
                                                            id="userVoucherLimit"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.userVoucherLimit || ""}
                                                            invalid={
                                                                validation.touched.userVoucherLimit &&
                                                                    validation.errors.userVoucherLimit
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.userVoucherLimit &&
                                                            validation.errors.userVoucherLimit ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.userVoucherLimit}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            <ImageArrayComponent
                                                nameComponent="Voucher"
                                                nameField="imageVoucher"
                                                selectedFiles={selectedFilesImageVoucher}
                                                setSelectedFiles={setSelectedFilesImageVoucher}
                                                validation={validation}
                                            ></ImageArrayComponent>
                                        </Col>
                                    </Row>
                                    {isEditMode ? (
                                        <Button color="primary" type="submit">
                                            Lưu Voucher
                                        </Button>
                                    ) : (
                                        <Button color="primary" type="submit">
                                            Thêm Voucher
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EcommerceAddVoucher;
