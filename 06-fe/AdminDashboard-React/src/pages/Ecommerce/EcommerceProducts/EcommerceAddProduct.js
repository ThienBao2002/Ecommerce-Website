import React, { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Input,
  Label,
  FormFeedback,
  Form,
  Row,
  Alert,
} from "reactstrap";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  getProducts as onGetProducts,
  addNewProduct as onAddNewProduct,
  updateProduct as onUpdateProduct,
} from "../../../slices/thunks";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dropzone from "react-dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createSelector } from "reselect";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import ProductVariant from "./ProductVariant";
import EcommerceCategory from "./EcommerceCategory";
import EcommerceBrand from "./EcommerceBrand";
import { ToastContainer } from "react-toastify";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddProduct = (props) => {
  document.title = "Thêm sản phẩm | Kiddo - Trang quản trị ";
  const history = useNavigate();
  const productId = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [productVariantResult, setProductVariantResult] = useState([]);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [productFound, setProductFound] = useState(null);
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const dispatch = useDispatch();
  const products = useSelector(state => state.Ecommerce.products);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(onGetProducts());
    }
  }, [dispatch, products]);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "Tên sản phẩm",
      stock: "100",
      price: "",
      newPrice: "",
      profit:"",
      categoryId: null,
      brandId: null,
      specification: "Thông số sản phẩm",
      description: "Mô tả sản phẩm",
      linkrv: "",
      discount: "",
      isPublish: { label: "Hiện", value: true },
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string() //check biến isEditMode == true thì không cần test unique
        .required("Vui lòng nhập tên sản phẩm")
        .max(500, "Vui lòng không nhập quá 500 ký tự")
        .test("is-unique", "Tên sản phẩm đã tồn tại", function (value) {
          // Chuẩn bị tên sản phẩm để kiểm tra
          if (isEditMode === true) {
            return true;
          }
          const trimmedLowerCaseValue = value.trim().toLowerCase();
          // Kiểm tra xem tên sản phẩm đã tồn tại trong danh sách products hay không
          return !products.some((product) => {
            const productLowerCaseName = product.name.trim().toLowerCase();
            return productLowerCaseName === trimmedLowerCaseValue;
          });
        }),
      price:
        productVariantResult.variantClassCount === 0
          ? Yup.number().required("Vui lòng nhập giá sản phẩm")
          : Yup.number().notRequired(),
      profit:
        productVariantResult.variantClassCount === 0
          ? Yup.number().required("Vui lòng nhập lợi nhuận")
          : Yup.number().notRequired(),
      stock:
        productVariantResult.variantClassCount === 0
          ? Yup.number().required("Vui lòng nhập số lượng kho hàng")
          : Yup.number().notRequired(),

      isPublish: Yup.object()
        .nullable(false)
        .required("Vui lòng chọn trạng thái hiển thị"),
      categoryId: Yup.object()
        .nullable(false)
        .required("Vui lòng chọn danh mục"),
      brandId: Yup.object()
        .nullable(false)
        .required("Vui lòng chọn thương hiệu"),
      description: Yup.string()
        .required("Vui lòng nhập mô tả sản phẩm")
        .max(3000, "Không được quá 3000 ký tự"),
      specification: Yup.string()
        .required("Vui lòng nhập thông số sản phẩm")
        .max(3000, "Không được quá 3000 ký tự"),
      images: Yup.array().test(
        "images-validation",
        "Vui lòng thêm tối thiểu 2 ảnh",
        function (value) {
          // Kiểm tra số lượng ảnh khi isEditMode là false
          return value && value.length >= 2;
        }
      ),
    }),
    onSubmit: async (values) => {
      // Xử lý dữ liệu khác
      const newProduct = new FormData();
      // Thêm dữ liệu sản phẩm
      newProduct.append("name", values.name);
      newProduct.append("price", values.price || 0);
      newProduct.append("stock", values.stock||null);
      newProduct.append("discount", values.discount);
      newProduct.append("categoryId", values.categoryId.value);
      newProduct.append("brandId", values.brandId.value);
      newProduct.append("isPublish", values.isPublish.value);
      newProduct.append("description", values.description);
      newProduct.append("specification", values.specification);
      newProduct.append("profit", values.profit);
      newProduct.append("variantClassCount", productVariantResult.variantClassCount);
      productVariantResult.imagesVariant.forEach((file) => {
        if (file instanceof File) {
          newProduct.append("imagesVariant", file);
        }
      });
      const fileNamesImage = values.images.map(file => file.name).join(', ');
      newProduct.append("nameImages", fileNamesImage);
      values.images.forEach((file) => {
        if (file instanceof File)
          newProduct.append("images", file);
      });
      // Giả sử `productVariantResult.variant1` là mảng bạn muốn lặp qua
      if (productVariantResult.variantClassCount === 2)
        productVariantResult.variant1.forEach((variant1, index1) => {
          if(isEditMode)
          newProduct.append(
            `variant1[${index1}][id]`,
            variant1._id
          );
          newProduct.append(
            `variant1[${index1}][imageName]`,
            variant1.imageName
          );
          newProduct.append(`variant1[${index1}][name]`, variant1.name);
          newProduct.append(`variant1[${index1}][index]`, variant1.index);

          variant1.variant2.map((variant2, index2) => {
            // Thêm index vào tên để phản ánh cấu trúc dữ liệu như trong hình ảnh bạn đã cung cấp
            if(isEditMode)
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][id]`,
              variant2._id
            );
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][name]`,
              variant2.name
            );
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][price]`,
              variant2.price
            );
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][stock]`,
              variant2.stock
            );
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][index]`,
              variant2.index
            );
            newProduct.append(
              `variant1[${index1}][variant2][${index2}][position]`,
              variant2.position
            );
          });
        });
      else if (productVariantResult.variantClassCount === 1) {
        productVariantResult.variant1.forEach((variant1, index1) => {
          if(isEditMode)
          newProduct.append(`variant1[${index1}][id]`, variant1._id);
          newProduct.append(
            `variant1[${index1}][imageName]`,
            variant1.imageName
          );
          newProduct.append(`variant1[${index1}][name]`, variant1.name);
          newProduct.append(`variant1[${index1}][price]`, variant1.price);
          newProduct.append(`variant1[${index1}][stock]`, variant1.stock);
          newProduct.append(`variant1[${index1}][index]`, variant1.index);
        });
      }
      newProduct.append("variantName1", productVariantResult.variantName1);
      newProduct.append("variantName2", productVariantResult.variantName2);
      if (isEditMode !== true) {
        try {
          const actionResult = await dispatch(onAddNewProduct(newProduct));
          if (onAddNewProduct.fulfilled.match(actionResult)) {
            // Xử lý khi thêm sản phẩm thành công
            console.log('Product added successfully:', actionResult.payload);
            // Có thể thêm mã để chuyển hướng người dùng hoặc hiển thị thông báo thành công
            await dispatch(onGetProducts());
            history("/apps-ecommerce-products");
            validation.resetForm();
          } else {
            // Xử lý khi thêm sản phẩm không thành công
            console.error('Failed to add the product:', actionResult.error);
            // Hiển thị thông báo lỗi hoặc ghi log lỗi
          }
        } catch (error) {
          // Xử lý lỗi không xác định từ hệ thống hoặc mạng
          console.error('Unexpected error when adding product:', error);
          // Hiển thị thông báo lỗi hoặc ghi log lỗi
        }
      } else {
        newProduct.append("id", productId._id);
        try {
         const actionResult = await dispatch(onUpdateProduct(newProduct));
          if (onUpdateProduct.fulfilled.match(actionResult)) {
            // Xử lý khi cập nhật sản phẩm thành công
            console.log('Product updated successfully:', actionResult.payload);
            // Có thể thêm mã để chuyển hướng người dùng hoặc hiển thị thông báo thành công
            await dispatch(onGetProducts());
            history("/apps-ecommerce-products");
            validation.resetForm();
          } else {
            // Xử lý khi cập nhật sản phẩm không thành công
            console.error('Failed to update the product:', actionResult.error);
            // Hiển thị thông báo lỗi hoặc ghi log lỗi
          }
        } catch (error) {
          // Xử lý lỗi không xác định từ hệ thống hoặc mạng
          console.error('Unexpected error when updating product:', error);
          // Hiển thị thông báo lỗi hoặc ghi log lỗi
        }
      }
      
      for (const [key, value] of newProduct.entries()) {
        console.log(`${key}:`, value);
      }

    },
  });

  useEffect(() => {
    // Tạo một async hàm bên trong useEffect
    const fetchData = async () => {
      const foundProduct = products.find(
        (product) => product._id === productId._id
      );
      // Cập nhật giá trị của selectedProduct khi tìm thấy sản phẩm
      if (foundProduct) {
        setIsEditMode(true);
        validation.setFieldValue("name", foundProduct.name);
        validation.setFieldValue("description", foundProduct.description);
        validation.setFieldValue("specification", foundProduct.specification);
        validation.setFieldValue("price", foundProduct.price);
        validation.setFieldValue("stock", foundProduct.stock);
        validation.setFieldValue("discount", foundProduct.discount);
        validation.setFieldValue("profit", foundProduct.profit);
        const isPublishOption = IsPublishOptions[0].options.find(
          (option) => option.value === foundProduct.isPublish
        );
        validation.setFieldValue("isPublish", isPublishOption);
        validation.setFieldValue("brandId", {
          value: foundProduct.brand._id,
          label: foundProduct.brand.name,
        });
        validation.setFieldValue("categoryId", {
          value: foundProduct.category._id,
          label: foundProduct.category.name,
        });
        await setSelectedFiles(foundProduct.images);
        validation.setFieldValue("images", selectedFiles);
        setProductFound(foundProduct);
      }
    };
    // Gọi async hàm
    fetchData();
  }, [productId, products, isEditMode]);

  // thêm hình ảnh
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

  const [selectedFiles, setSelectedFiles] = useState([]);
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
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    validation.setFieldValue("images", updatedFiles);
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
    if(isHovered)
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [selectedFiles,isHovered]);
  useEffect(() => {
    validation.setFieldValue("images", selectedFiles);
  }, [selectedFiles]);

  const IsPublishOptions = [
    {
      options: [
        { label: "Ẩn", value: false },
        { label: "Hiện", value: true },
      ],
    },
  ];
  const handleCategoryChange = (categoryId) => {
    validation.setFieldValue("categoryId", categoryId);
  };
  const handleCategoryBlur = () => {
    validation.handleBlur;
  };
  const handleBrandChange = (brandId) => {
    validation.setFieldValue("brandId", brandId);
  };
  const handleBrandBlur = () => {
    validation.handleBlur;
  };
  //json gửi đi
 
  // Sử dụng state để quản lý dữ liệu CKEditor
  const [editorDesData, setEditorDesData] = useState(
    validation.values.description
  );
  const [editorSpecData, setEditorSpecData] = useState(
    validation.values.description
  );
  useEffect(() => {
    // Theo dõi sự thay đổi của validation.values.description
    // và cập nhật state CKEditor khi có sự thay đổi
    setEditorDesData(validation.values.description);
    setEditorSpecData(validation.values.specification);
  }, [validation.values.description, validation.values.specification]);
  // useEffect(() => {
  //   console.log("send Result: ",productVariantResult);
  // }, [productVariantResult]);

  return (
    <div className="page-content">
      {/* <ToastContainer autoClose={2000} limit={1} /> */}
      <Container fluid>
        <BreadCrumb title="Thêm/Sửa sản phẩm" pageTitle="Thương mại điện tử" />
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Tên sản phẩm
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      placeholder="Nhập tên sản phẩm"
                      name="name"
                      value={validation.values.name || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.name && validation.touched.name
                          ? true
                          : false
                      }
                    />
                    {validation.errors.name && validation.touched.name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.name}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div>
                    <Label>Mô tả sản phẩm</Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorDesData} // Sử dụng state để cung cấp dữ liệu cho CKEditor
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditorDesData(data); // Cập nhật state khi dữ liệu thay đổi
                        validation.setFieldValue("description", data);
                      }}
                    />
                    {validation.errors.description && (
                      <Alert color="danger">
                        <strong>Có lỗi xảy ra! </strong>
                        {validation.errors.description}
                      </Alert>
                    )}
                    <Label>Thông số chi tiết</Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={editorSpecData} // Sử dụng state để cung cấp dữ liệu cho CKEditor
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditorSpecData(data); // Cập nhật state khi dữ liệu thay đổi
                        validation.setFieldValue("specification", data);
                      }}
                    />
                    {validation.errors.specification && (
                      <Alert color="danger">
                        <strong>Có lỗi xảy ra! </strong>
                        {validation.errors.specification}
                      </Alert>
                    )}
                  </div>
                </CardBody>
              </Card>
              <div>
                <ProductVariant
                  customActiveTab={customActiveTab}
                  toggleCustom={toggleCustom}
                  validation={validation}
                  setProductVariantResult={setProductVariantResult}
                  productFound={productFound}
                  isEditMode={isEditMode}
                />
                {/* other components */}
              </div>

              <div className="text-end mb-3">
                {isEditMode ? (
                  <button type="submit" className="btn btn-primary w-sm">
                    Lưu chỉnh sửa
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-sm">
                    Thêm sản phẩm
                  </button>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Trạng thái</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <Label
                      htmlFor="choices-publish-visibility-input"
                      className="form-label"
                    >
                      Ẩn/Hiện
                    </Label>

                    <Select
                      name="isPublish"
                      options={IsPublishOptions[0].options}
                      value={IsPublishOptions[0].options.find(option => option.value === validation.values.isPublish)}
                      onBlur={validation.handleBlur}
                      onChange={(selectedOption) => {
                        console.log(selectedOption);
                        validation.setFieldValue("isPublish", selectedOption);
                      }}
                    />



                    {validation.touched.isPublish &&
                      validation.errors.isPublish ? (
                      <Alert color="danger">
                        <strong>Có lỗi xảy ra! </strong>
                        {validation.errors.isPublish}
                      </Alert>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
              {/*Quản lý danh mục*/}
              <EcommerceCategory
                categoryId={validation.values.categoryId}
                errors={validation.errors.categoryId}
                blur={validation.touched.categoryId}
                handleCategoryBlur={handleCategoryBlur}
                handleCategoryChange={handleCategoryChange}
              />

              {/*Quản lý thương hiệu */}
              <EcommerceBrand
                brandId={validation.values.brandId}
                errors={validation.errors.brandId}
                blur={validation.touched.brandId}
                handleBrandBlur={handleBrandBlur}
                handleBrandChange={handleBrandChange}
              />

              <Card
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                className={`mb-3 ${isHovered ? "active" : ""}`}
              >
                <CardHeader>
                  <h5 className="card-title mb-0">Ảnh bìa</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <h5 className="fs-14 mb-1">Một số ảnh khác</h5>
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
                              Kéo thả hoặc click vào để đăng ảnh (tối thiểu 2
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
                    {isHovered && (
                      <Alert color="primary" className="border-0">
                        <strong> Thông báo </strong> Mẹo:{" "}
                        <b>Ctrl + V để dán ảnh.</b>{" "}
                      </Alert>
                    )}
                    {validation.errors.images && validation.touched.images ? (
                      <Alert color="danger">
                        <strong>Có lỗi xảy ra! </strong>
                        {validation.errors.images}
                      </Alert>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;
