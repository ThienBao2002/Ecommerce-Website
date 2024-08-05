import {
    Alert,
    Card,
    CardBody,
    Col,
    Row,
    Button,
    Form,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
    getOrderById as onGetOrderByID,
    addNewReview as onAddNewReview,
    //startSession,
} from "../../../slices/thunks";
import Rating from "react-rating";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EcommerceOrderProduct from "./EcommerceOrderProduct";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const AddReviewDetail = ({ item, orderId, ShowAddReviewDetailsPopUp, tog_backdrop }) => {
    const isSessionActive = useSelector((state) => state.Session.isSessionActive);
    const token = useSelector((state) => state.Session.decodedToken);
    const [selectedFiles, setselectedFiles] = useState([]);
    //const [modal_scroll, setmodal_scroll] = useState(true);
    const [rating, setRating] = useState(5);
    const dispatch = useDispatch();


    
    function handleAcceptedFiles(files, fromClipboard = false) {
        // Xử lý tất cả các file để thêm tên ngẫu nhiên và cập nhật thuộc tính
        const processedFiles = files.map((file) => {
            const randomFileName = generateRandomString(10); // Tạo tên file ngẫu nhiên
            const newFile = new File([file], `${randomFileName}.png`, {
                type: file.type,
            });

            return Object.assign(newFile, {
                preview: URL.createObjectURL(file), // Tạo URL xem trước cho file
                formattedSize: formatBytes(file.size), // Định dạng kích thước file
            });
        });

        if (fromClipboard) {
            // Nếu từ clipboard, chỉ thêm file đầu tiên trong mảng processedFiles
            setselectedFiles((prevFiles) => [...prevFiles, processedFiles[0]]);
        } else {
            // Logic cho việc thêm file thủ công
            if (selectedFiles.length === 0) {
                setselectedFiles(processedFiles);
            } else if (selectedFiles.length === 1) {
                const newFiles = processedFiles.slice(0, 2);
                setselectedFiles([...selectedFiles, ...newFiles]);
            } else {
                setselectedFiles([...selectedFiles, ...processedFiles]);
            }
        }
    }
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
    function generateRandomString(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }

        return result;
    }
    function handleRemoveImage(index) {
        // Tạo một bản sao của danh sách ảnh đã chọn
        const updatedFiles = [...selectedFiles];
        // Loại bỏ ảnh tại chỉ mục index
        updatedFiles.splice(index, 1);
        // Cập nhật danh sách ảnh
        setselectedFiles(updatedFiles);
        // Cập nhật trường images trong Formik với danh sách ảnh mới
        validation.setFieldValue("imagesReview", updatedFiles);
    }
    const validation = useFormik({
        initialValues: {
            orderId: '', // Mã đơn hàng
            userId: '', // ID người dùng
            productId: '', // ID sản phẩm
            variant1Id: '', // ID của biến thể 1
            variant2Id: '', // ID của biến thể 2
            reviewContent: '', // Nội dung đánh giá
            rating: 0, // Xếp hạng
            imagesReview: [], // Hình ảnh trong đánh giá
        },
        validationSchema: Yup.object({
            // reviewContent: Yup.string().required("Vui lòng nhập nội dung đánh giá"),
            // rating: Yup.number().min(1, "Xếp hạng tối thiểu là 1").max(5, "Xếp hạng tối đa là 5").required("Vui lòng chọn xếp hạng"),
            // imagesReview: Yup.array().of(Yup.mixed().required("Vui lòng chọn hình ảnh cho đánh giá")),
        }),
        onSubmit: async (values) => {
            // Gửi dữ liệu đánh giá lên server hoặc xử lý nội bộ
            console.log(values);
            const reviewData = new FormData();
            reviewData.append("orderId", values.orderId);
            reviewData.append("userId", values.userId);
            reviewData.append("productId", values.productId);

            if (item.product.data.variantClassCount === 1 && values.variant1Id) {
                reviewData.append("variant1Id", values.variant1Id);
            }
            if (item.product.data.variantClassCount === 2 && values.variant2Id) {
                reviewData.append("variant1Id", values.variant1Id);
                reviewData.append("variant2Id", values.variant2Id);
            }

            reviewData.append("reviewContent", values.reviewContent);
            reviewData.append("rating", values.rating);

            values.imagesReview.forEach((file) => {
                reviewData.append("imagesReview", file);
            });
            for (const [key, value] of reviewData.entries()) {
                console.log(`${key}: ${value}`);
            }
            try {
                // Dispatch the addNewReview action and wait for it to finish.
                const actionResult = await dispatch(onAddNewReview(reviewData));
                // You can check the action result to see if it was fulfilled or rejected
                if (onAddNewReview.fulfilled.match(actionResult)) {
                    // The dispatch was successful
                    await dispatch(onGetOrderByID(orderId));
                    tog_backdrop();
                    ShowAddReviewDetailsPopUp();

                } else if (onAddNewReview.rejected.match(actionResult)) {
                    // The dispatch was failed
                    console.error( actionResult.error);
                }
            } catch (error) {
                console.error( error);
            }
        },

    });
    useEffect(() => {
        const handlePaste = (event) => {
            const clipboardData = event.clipboardData || window.clipboardData;
            const items = clipboardData.items || [];

            // Lặp từ cuối lên đầu
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                if (item.type.indexOf("image") !== -1) {
                    const blob = item.getAsFile();
                    const randomFileName = generateRandomString(10); // Độ dài tên file mong muốn
                    const file = new File([blob], `${randomFileName}.png`, {
                        type: blob.type,
                    });
                    handleAcceptedFiles([file, ...selectedFiles], true);
                    break; // Dừng sau khi xử lý ảnh đầu tiên (gần nhất)
                }
            }
        };
        document.addEventListener("paste", handlePaste);
        return () => {
            document.removeEventListener("paste", handlePaste);
        };
        // eslint-disable-next-line
    }, [selectedFiles]);
    useEffect(() => {
        console.log("Sản phẩm là: ", item);
        validation.setFieldValue("orderId", orderId);
        validation.setFieldValue("userId", token.userId);
        validation.setFieldValue("productId", item.product.product);
        validation.setFieldValue("rating", rating);
        item && item.variant1 && item.variant1._id && validation.setFieldValue("variant1Id", item.variant1._id._id);
        item && item.variant2 && item.variant2._id && validation.setFieldValue("variant2Id", item.variant2._id._id);
        validation.setFieldValue("imagesReview", selectedFiles);
        // eslint-disable-next-line
    }, [isSessionActive, token.userId, orderId, item, selectedFiles,rating]);




    return (
        <>
            <ToastContainer closeButton={false} limit={1} />
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                }}
            >
                <table>
                    <tbody>
                        <EcommerceOrderProduct item={item} />

                    </tbody>
                </table>

                <div style={{ display: "flex"}}>
                    <h5 className="fs-14 mb-1" >Chất lượng sản phẩm</h5>
                    <Rating
                        style={{ marginLeft: "50px" }}
                        initialRating={rating}
                        emptySymbol="mdi mdi-star-outline text-muted "
                        fullSymbol="mdi mdi-star text-warning "
                        onChange={(value) => setRating(value)}  // Cập nhật giá trị rating khi người dùng chọn xếp hạng mới
                    />
                </div>

                <Card
                    className={`mb-3`}
                >

                    <CardBody>
                        <div>
                            <h5 className="fs-14 mb-1">Đánh giá sản phẩm</h5>
                            <p className="text-muted">Thêm nhận xét</p>
                            <textarea
                                style={{
                                    border: '1px solid   #000000',
                                    backgroundColor: 'white'
                                }}
                                className="form-control"
                                rows="3"
                                id="reviewContent"
                                name="reviewContent"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.reviewContent || ""}
                            ></textarea>
                            {validation.touched.reviewContent && validation.errors.reviewContent ? (
                                <div className="text-danger">{validation.errors.reviewContent}</div>
                            ) : null}


                            <p className="text-muted">Thêm ảnh sản phẩm</p>

                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    const newFiles = acceptedFiles;
                                    handleAcceptedFiles(newFiles);
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="dropzone dz-clickable">
                                        <div
                                            className="dz-message needsclick mt-4"
                                            {...getRootProps()}
                                        >
                                            <div className="mb-3">
                                                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                            </div>
                                            <h5>
                                                Kéo thả hoặc click vào để đăng ảnh (tối thiểu 1
                                                ảnh)
                                            </h5>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>

                            <div className="list-unstyled mb-0" id="file-previews">
                                {selectedFiles.map((f, i) => {
                                    return (
                                        <Card
                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                            key={i + "-file"}
                                        >
                                            <div className="p-2">
                                                <Row className="align-items-center">
                                                    <Col className="col-auto">
                                                        <img
                                                            data-dz-thumbnail=""
                                                            height="80"
                                                            className="avatar-sm rounded bg-light"
                                                            alt={f.name}
                                                            src={f.preview || f.url}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                            to="#"
                                                            className="text-muted font-weight-bold"
                                                        >
                                                            {f.name}
                                                        </Link>
                                                        <p className="mb-0">
                                                            <strong>{f.formattedSize}</strong>
                                                        </p>
                                                    </Col>

                                                    <div className="col-xl-3 col-lg-4 col-sm-6">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            //onBlur={validation.handleBlur}
                                                            onClick={() => handleRemoveImage(i)} // Truyền chỉ mục i vào hàm xử lý
                                                        >
                                                            <i className="mdi mdi-archive-cancel"></i>{" "}
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </Row>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>

                            <Alert color="primary" className="border-0">
                                <strong> Thông báo </strong> Mẹo:{" "}
                                <b>Ctrl + V để dán ảnh.</b>{" "}
                            </Alert>

                            {/* {validation.errors.images && validation.touched.images ? (
                      <Alert color="danger">
                        <strong>Có lỗi xảy ra! </strong>
                        {validation.errors.images}
                      </Alert>
                    ) : null} */}
                        </div>
                    </CardBody>
                </Card>
                <Button
                    color="primary"
                    type="submit"
                //onClick={() => setmodal_scroll(false)}
                >
                    Gửi
                </Button>
            </Form>
        </>
    );
};

export default AddReviewDetail;
