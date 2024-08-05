import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col, Container, Form, Row, Button, Offcanvas, OffcanvasHeader, OffcanvasBody, FormGroup,
    InputGroup,
    Label,
    Input,
    FormFeedback,
    Alert
} from "reactstrap";
import Dropzone from "react-dropzone";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PreviewCardHeader from '../../../Components/Common/PreviewCardHeader';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import { useFormik } from "formik";
import * as Yup from "yup";
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import ProductRow from "./ProductRow";
import { toast, ToastContainer } from "react-toastify";
// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    getProducts as onGetProducts,
    getPromotions as onGetPromotions,
    addNewPromotion as onAddNewPromotion,
    updatePromotion as onUpdatePromotion,
} from "../../../slices/thunks";
import { Link, useNavigate, useParams } from "react-router-dom";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
import EcommerceProducts from "./../EcommerceProducts/index";
import ImageArrayComponent from "../EcommerceProducts/ImageArrayComponent";
const EcommerceAddPromotion = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useDispatch();
    const history = useNavigate();
    const promotionId = useParams();
    const [isAddProductToPromotion, setIsAddProductToPromotion] = useState(true);
    const [productList, setProductList] = useState([]);
    const products = useSelector(state => state.Ecommerce.products);
    const promotions = useSelector(state => state.Ecommerce.promotions);
    const [promotionFound, setPromotionFound] = useState(null);
    const [selectedProductsToPromotion, setSelectedProductsToPromotion] = useState([]);
    const [selectedFilesBanner, setSelectedFilesBanner] = useState([]);
    const [selectedFilesFrameStyle, setSelectedFilesFrameStyle] = useState([]);
    const [isBottom, setIsBottom] = useState(false);
    
    const toggleBottomCanvas = () => {
        setIsBottom(!isBottom);
    };
    // thêm hình ảnh
    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(onGetProducts());
        }
        if (!promotions || promotions.length === 0) {
            dispatch(onGetPromotions());
        }
    }, [products, productList, promotions])
    useEffect(() => {
        if (products) {
            const selected = products.filter(product =>
                selectedProductsToPromotion.includes(product._id)
            );
            setProductList(selected);
        }
    }, [selectedProductsToPromotion, products]);


    const convertDateTimeFormat = (originalDateTime) => {
        const date = new Date(originalDateTime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý tháng trong JavaScript bắt đầu từ 0
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };
    const revertDateTimeFormat = (formattedDateTime) => {
        // Tách chuỗi dựa vào khoảng trắng và dấu hai chấm
        const [timePart, datePart] = formattedDateTime.split(' ');
        const [hours, minutes] = timePart.split(':');
        const [day, month, year] = datePart.split('/');

        // Tạo một đối tượng Date mới với thông tin theo giờ địa phương
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

        // Chuyển đổi đối tượng Date về định dạng ISO nhưng không bao gồm giây và múi giờ
        // Đảm bảo rằng ngày giờ được trả về theo giờ địa phương chính xác
        const offset = date.getTimezoneOffset() * 60000; // chuyển đổi múi giờ thành milisecond
        const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);

        return localISOTime;
    };

    useEffect(() => {
        validation.setFieldValue("products", productList)
    }, [productList]);
    document.title = "Thêm khuyến mãi | Kiddo - Trang quản trị ";


    useEffect(() => {
        const offcanvasBody = document.querySelector('.offcanvas-body');
        if (offcanvasBody) {
            const contentHeight = offcanvasBody.scrollHeight; // Chiều cao nội dung thực tế
            offcanvasBody.style.height = `${contentHeight}px`; // Đặt độ cao mới
        }
    }, []); // Chỉ chạy một lần sau khi component được mount
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            discount: 0,
            startDate: "",
            endDate: "",
            banner: [],
            frameStyle:[],
            products: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên chương trình khuyến mãi"),
            discount: Yup.number()
                .required("Vui lòng nhập % giảm giá")
                .positive("Phần trăm giảm giá phải lớn hơn 0"),
            banner: Yup.array().test(
                "images-validation",
                "Vui lòng thêm tối thiểu 1 ảnh",
                function (value) {
                    // Nếu isEditMode là true, trả về true và bỏ qua kiểm tra
                    // Kiểm tra số lượng ảnh khi isEditMode là false
                    return value && value.length >= 1;
                }),
            startDate: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
            endDate: Yup.string().required("Vui lòng chọn ngày kết thúc")
                .test(
                    "endDate-after-startDate",
                    "Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày",
                    function (endDate) {
                        const startDate = this.parent.startDate; // Truy cập giá trị của trường startDate

                        if (!startDate || !endDate) {
                            return true; // Bỏ qua kiểm tra nếu một trong hai trường chưa được nhập
                        }

                        const startDateObj = new Date(startDate);
                        const endDateObj = new Date(endDate);

                        // Kiểm tra xem endDateObj có sau startDateObj ít nhất 1 ngày hay không
                        return endDateObj.getTime() >= startDateObj.getTime() + 86400000; // 86400000 mili giây = 1 ngày
                    }
                ),
        }),
        onSubmit: async (values) => {
            const promotion = new FormData();
            promotion.append("name", values.name);
            promotion.append("discount", values.discount);
            promotion.append("startDate", convertDateTimeFormat(values.startDate));
            promotion.append("endDate", convertDateTimeFormat(values.endDate));
            const fileNamesImageBanner = values.banner.map(file => file.name).join(', ');
            promotion.append("nameBanner", fileNamesImageBanner);
            values.banner.forEach((file) => {
                if (file instanceof File)
                    promotion.append("banner", file);
            });
            const fileNamesImageFrame = values.frameStyle.map(file => file.name).join(', ');
            promotion.append("nameFrame", fileNamesImageFrame);
            values.frameStyle.forEach((file) => {
                if (file instanceof File)
                    promotion.append("frameStyle", file);
            });
            promotion.append("products", values.products.map(product => product._id).join(","));
            // Giả sử `isEditMode` quyết định liệu bạn đang thêm mới hay cập nhật
            if (!isEditMode) {
                // Logic để thêm mới một chương trình khuyến mãi
                try {
                    const actionResult = await dispatch(onAddNewPromotion(promotion));
                    await dispatch(onGetProducts());
                    for (const [key, value] of promotion.entries()) {
                        console.log(`${key}:`, value);
                    }
                    if (onAddNewPromotion.fulfilled.match(actionResult)) {
                        console.log("Chương trình khuyến mãi đã được tạo thành công:", actionResult.payload);
                        await dispatch(onGetPromotions()); // Tải lại danh sách khuyến mãi
                        history("/apps-ecommerce-promotions"); // Chuyển hướng người dùng
                        validation.resetForm(); // Reset form
                    } else {
                        console.error("Không thể tạo chương trình khuyến mãi:", actionResult.error);
                    }
                } catch (error) {
                    console.error("Lỗi không xác định khi tạo chương trình khuyến mãi:", error);
                }
            } else {
                // Thêm ID của chương trình khuyến mãi vào form data nếu là cập nhật
                promotion.append("id", promotionId._id);
                // Logic để cập nhật một chương trình khuyến mãi
                for (const [key, value] of promotion.entries()) {
                    console.log(`${key}:`, value);
                }
                try {
                    const actionResult = await dispatch(onUpdatePromotion(promotion));
                    await dispatch(onGetProducts());
                    if (onUpdatePromotion.fulfilled.match(actionResult)) {
                        console.log("Chương trình khuyến mãi đã được cập nhật thành công:", actionResult.payload);
                        await dispatch(onGetPromotions()); // Tải lại danh sách khuyến mãi
                        history("/apps-ecommerce-promotions"); // Chuyển hướng người dùng
                        validation.resetForm(); // Reset form
                    } else {
                        console.error("Không thể cập nhật chương trình khuyến mãi:", actionResult.error);
                    }
                } catch (error) {
                    console.error("Lỗi không xác định khi cập nhật chương trình khuyến mãi:", error);
                }
            }

        },
    });

    useEffect(() => {
        const fetchPromotionData = () => {
            // Giả sử bạn có một mảng 'promotions' và một 'promotionId'
            const foundPromotion = promotions.find(
                (promotion) => promotion._id === promotionId._id
            );
            if (foundPromotion) {
                setIsEditMode(true);
                validation.setFieldValue("name", foundPromotion.name);
                validation.setFieldValue("discount", foundPromotion.discount);
                validation.setFieldValue("startDate", foundPromotion.startDate);
                validation.setFieldValue("endDate", foundPromotion.endDate);
                // Chuyển đổi định dạng ngày từ ISO sang 'HH:mm DD/MM/YYYY'
                const formattedStartDate = revertDateTimeFormat(foundPromotion.startDate);
                const formattedEndDate = revertDateTimeFormat(foundPromotion.endDate);
                validation.setFieldValue("startDate", formattedStartDate);
                validation.setFieldValue("endDate", formattedEndDate);

                setSelectedFilesBanner(foundPromotion.banner);
                setSelectedFilesFrameStyle(foundPromotion.frameStyle||[]);
                setProductList(foundPromotion.products);
                const productIds = foundPromotion.products.map(item => item._id);
                setSelectedProductsToPromotion(productIds);
                validation.setFieldValue("banner", selectedFilesBanner);
                validation.setFieldValue("frameStyle", selectedFilesFrameStyle);

                const selectedProductsIds = foundPromotion.products.map((product) => product._id);
                validation.setFieldValue("products", selectedProductsIds);
                setPromotionFound(foundPromotion);
            }
        };
        fetchPromotionData();
    }, [promotionId, products, promotionFound]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Thêm khuyến mãi" pageTitle="Quản lý khuyến mãi" />
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
                                                        <Label htmlFor="validationCustom01">Tên khuyến mãi</Label>
                                                        <Input
                                                            name="name"
                                                            placeholder="Nhập tên khuyến mãi"
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom01"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.name || ""}
                                                            invalid={
                                                                validation.touched.name &&
                                                                    validation.errors.name
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.name &&
                                                            validation.errors.name ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.name}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom02">Giảm giá</Label>
                                                        <Input
                                                            name="discount"
                                                            placeholder="Nhập % giảm giá"
                                                            type="text"
                                                            className="form-control"
                                                            id="validationCustom02"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.discount || ""}
                                                            invalid={
                                                                validation.touched.discount &&
                                                                    validation.errors.discount
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {validation.touched.discount &&
                                                            validation.errors.discount ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.discount}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom03">Ngày bắt đầu</Label>
                                                        <Input
                                                            name="startDate"
                                                            type="datetime-local"
                                                            className="form-control"
                                                            id="validationCustom03"
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
                                                        <Label htmlFor="validationCustom04">Ngày kết thúc</Label>
                                                        <Input
                                                            name="endDate"
                                                            type="datetime-local"
                                                            className="form-control"
                                                            id="validationCustom04"
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
                                                <Card>
                                                    <CardHeader>
                                                        <Row>
                                                            <Col md={10}>
                                                                <h5 className="card-title flex-grow-1 mb-0">
                                                                    Danh sách sản phẩm: {productList.length}
                                                                </h5>
                                                            </Col>
                                                            <Col>
                                                                <Button color="success" onClick={toggleBottomCanvas}>Thêm sản phẩm</Button>
                                                            </Col>
                                                        </Row>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="table-responsive table-card">
                                                            <table className="table table-nowrap align-middle table-borderless mb-0">
                                                                <thead className="table-light text-muted">
                                                                    <tr>
                                                                        <th scope="col">Chi tiết sản phẩm</th>
                                                                        <th scope="col">Danh mục</th>
                                                                        <th scope="col">Hãng</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {productList &&
                                                                        productList.map((item, key) => (
                                                                            <ProductRow item={item} key={key} />

                                                                        ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            <ImageArrayComponent
                                                nameComponent="Banner"
                                                nameField="banner"
                                                selectedFiles={selectedFilesBanner}
                                                setSelectedFiles={setSelectedFilesBanner}
                                                validation={validation}
                                            ></ImageArrayComponent>
                                            <ImageArrayComponent
                                                nameComponent="Frame Style"
                                                nameField="frameStyle"
                                                selectedFiles={selectedFilesFrameStyle}
                                                setSelectedFiles={setSelectedFilesFrameStyle}
                                                validation={validation}
                                            ></ImageArrayComponent>
                                        </Col>
                                    </Row>
                                    {isEditMode ? (
                                        <Button color="primary" type="submit">
                                            Lưu khuyến mãi
                                        </Button>
                                    ) : (
                                        <Button color="primary" type="submit">
                                            Thêm khuyến mãi
                                        </Button>
                                    )}


                                </Form>
                            </div>
                        </CardBody>
                    </Card>
                    <Offcanvas
                        isOpen={isBottom}
                        direction="bottom"
                        toggle={toggleBottomCanvas}
                        id="offcanvasBottom"
                        style={{
                            minHeight: "90vh",
                            width: "80%", // Điều chỉnh chiều rộng của Offcanvas
                            margin: "0 auto", // Để căn giữa theo chiều ngang
                            height: "60vh", // Điều chỉnh chiều cao Offcanvas
                            transform: "translateY(-5%)",
                        }}
                    >
                        <OffcanvasHeader toggle={toggleBottomCanvas} id="offcanvasBottomLabel" className="border-bottom">
                            Danh sách sản phẩm
                        </OffcanvasHeader>
                        <OffcanvasBody >
                            <EcommerceProducts
                                usePageContentStyle={false}
                                selectedProductsToPromotion={selectedProductsToPromotion}
                                setSelectedProductsToPromotion={setSelectedProductsToPromotion}
                                isAddProductToPromotion={isAddProductToPromotion}
                            />
                        </OffcanvasBody>
                    </Offcanvas>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EcommerceAddPromotion;
