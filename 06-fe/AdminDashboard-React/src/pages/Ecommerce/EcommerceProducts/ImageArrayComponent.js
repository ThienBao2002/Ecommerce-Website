import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Alert,Row,Col   } from 'reactstrap'; // Thay thế 'reactstrap' bằng thư viện UI bạn đang sử dụng
import Dropzone from 'react-dropzone';
import { Link } from 'react-router-dom';

const ImageArrayComponent = ({nameComponent,nameField,selectedFiles,setSelectedFiles,validation }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleCardMouseEnter = () => {
        setIsHovered(true);
    };
    const handleCardMouseLeave = () => {
        setIsHovered(false);
    };
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
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function handleAcceptedFiles(files, fromClipboard = false) {
        const processedFiles = files.map((file) => {
            const randomFileName = generateRandomString(10); // Tạo tên file ngẫu nhiên
            const newFile = new File([file], `${randomFileName}.png`, {
                type: file.type,
            });
    
            return Object.assign(newFile, {
                preview: URL.createObjectURL(newFile), // Tạo URL xem trước cho newFile
                formattedSize: formatBytes(file.size), // Định dạng kích thước file
            });
        });
    
        if (fromClipboard) {
            // Nếu từ clipboard, chỉ thêm file đầu tiên trong mảng processedFiles
            setSelectedFiles((prevFiles) => [...prevFiles, processedFiles[0]]);
        } else {
            if (selectedFiles.length === 0) {
                setSelectedFiles(processedFiles);
            } else if (selectedFiles.length === 1) {
                const newFiles = processedFiles.slice(0, 2);
                setSelectedFiles([...selectedFiles, ...newFiles]);
            } else {
                setSelectedFiles([...selectedFiles, ...processedFiles]);
            }
        }
    }
    

    function handleRemoveImage(index) {
        // Tạo một bản sao của danh sách ảnh đã chọn
        const updatedFiles = [...selectedFiles];
        // Loại bỏ ảnh tại chỉ mục index
        updatedFiles.splice(index, 1);
        // Cập nhật danh sách ảnh
        setSelectedFiles(updatedFiles);
        // Cập nhật trường images trong Formik với danh sách ảnh mới
        validation.setFieldValue(`${nameField}`, updatedFiles);
    }
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
    }, [selectedFiles]);
    useEffect(() => {
        validation.setFieldValue(`${nameField}`, selectedFiles);
    }, [selectedFiles]);

    return (
        <Card
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            className={`mb-3 ${isHovered ? "active" : ""}`}
        >
            <CardHeader>
                <h5 className="card-title mb-0">Hình ảnh {nameComponent}</h5>
            </CardHeader>
            <CardBody>
                <div>
                    <h5 className="fs-14 mb-1">Một số ảnh khác</h5>
                    <p className="text-muted">Thêm ảnh {nameComponent}</p>

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
                                        Kéo thả hoặc click vào để đăng ảnh
                                    </h5>
                                </div>
                            </div>
                        )}
                    </Dropzone>

                    <div className="list-unstyled mb-0" id="file-previews">
                        {selectedFiles?.map((f, i) => {
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
                                                    onBlur={validation.handleBlur}
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
                    {validation.errors[nameField] && validation.touched[nameField] ? (
                        <Alert color="danger">
                            <strong>Có lỗi xảy ra! </strong>
                            {validation.errors[nameField]}
                        </Alert>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
};

export default ImageArrayComponent;
