import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Input,
  Label,
  Button,
  Row,
  Table,
  FormGroup,
} from "reactstrap";
import Dropzone from "react-dropzone";
import classnames from "classnames";
import DragAndDropGridVariant from "./DragAndDropGridVariant";
import DragAndDropGridVariant2 from "./DragAndDropGridVariant";

const ProductVariant = ({
  customActiveTab,
  toggleCustom,
  validation,
  setProductVariantResult,
  productFound,
  isEditMode,
}) => {
  const [variantClassCount, setVariantClassCount] = useState(0);
  const [variantName1, setVariantName1] = useState("Màu sắc");
  const [variantName2, setVariantName2] = useState("Kích thước");
  const [productListVariant1, setProductListVariant1] = useState([]); //dragAndDropGridVariant1
  const [productListVariant2, setProductListVariant2] = useState([]);
  const [productListVariant, setProductListVariant] = useState([]); //mảng sau khi gộp
  const [priceInput, setPriceInput] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [isUseDefault, setIsUseDefault] = useState(true);
  const defaultSortedList1 = [
    { _id: 1, name: "Đỏ", index: 0, position: 0, autoFocus: false },
    { _id: 2, name: "Cam", index: 1, position: 1, autoFocus: false },
    { _id: 3, name: "", index: 2, position: 2, autoFocus: true },
  ];
  
  const defaultSortedList2 = [
    { _id: 1, name: "1 tuổi _ 9-11kg", index: 0, position: 0, autoFocus: false },
    { _id: 2, name: "2 tuổi _ 11-12kg", index: 1, position: 1, autoFocus: false },
    { _id: 3, name: "3 tuổi _ 12-13kg", index: 2, position: 2, autoFocus: false },
    { _id: 4, name: "4 tuổi _ 14-16kg", index: 3, position: 3, autoFocus: false },
    { _id: 5, name: "", index: 4, position: 4, autoFocus: true },
  ];

  const handleSortedListChange1 = async (newSortedList) => {
    //console.log("setProductListVariant1: ", newSortedList);
    await setProductListVariant1(
      newSortedList.filter((item) => item.name.trim() !== "")
    );
  };

  const handleSortedListChange2 = async (newSortedList) => {
    //console.log("setProductListVariant2: ", newSortedList);
    await setProductListVariant2(
      newSortedList.filter((item) => item.name.trim() !== "")
    );
  };

  const merge2Arrays = (array1, array2) => {
    return array1.map((item1) => ({
      ...item1,
      variant2: array2.map((item2) => ({
        ...item2,
      })),
    }));
  };

  const handleMergeToVariant = (mergedArray) => {
    const updatedList = mergedArray.map((item1, index1) => {
      const existingVariant1 =
        productListVariant.find((pv) => pv._id === item1._id) || {};
      //console.log("existingVariant1",existingVariant1);
      return {
        ...existingVariant1,
        _id: existingVariant1._id||item1._id,
        name: item1.name, // từ mergedArray
        index: index1, // index dựa trên vị trí trong mergedArray
        position: item1.position,
        price: existingVariant1.price || item1.price,
        stock: existingVariant1.stock || item1.stock,
        imageName: existingVariant1.imageName || item1.imageName,
        image: existingVariant1.image || item1.image,
        variant2: item1.variant2.map((item2, index2) => {
          const existingVariant2 =
            (existingVariant1.variant2 || []).find(
              (pv2) => pv2.position === item2.position
            ) || {};
          return {
            ...existingVariant2,
            _id: existingVariant2._id, // từ mergedArray
            name: item2.name, // từ mergedArray
            index: index2,
            position: item2.position,
            price: existingVariant2.price,
            stock: existingVariant2.stock,
          };
        }),
      };
    });
    console.log("UpdateList", updatedList);
    setProductListVariant(updatedList);
  };
  const splitProductListVariant = (productFound) => {
    //("ProductFoundFromAPI: ", productFound);
    const variant1 = productFound.variant1.map((item) => {
      const imageVariant = productFound.imagesVariant.find(image => image.name === item.imageName);
      return imageVariant ? { ...item, image: imageVariant } : { ...item };
    });
    const variant2Temp = productFound.variant1
      .flatMap((item) => item.variant2) // Tạo một mảng mới với mọi variant2 từ mỗi item
      .filter(Boolean); // Loại bỏ các giá trị null hoặc undefined nếu có
    const variant2 = variant2Temp.reduce((acc, current) => {
      if (!acc.find(item => item.name === current.name)) {
        acc.push(current);
      }
      return acc;
    }, []);

    setProductListVariant(productFound.variant1);
    setProductListVariant1(variant1);
    setProductListVariant2(variant2);
    return { variant1, variant2 };
  };



  useEffect(() => {
    if (productListVariant1.length > 0 || productListVariant2.length > 0) {
      console.log("ProductListVariant1", productListVariant1);
      console.log("ProductListVariant2", productListVariant2);
      const merged = merge2Arrays(productListVariant1, productListVariant2);
      console.log("merged:", merged);
      handleMergeToVariant(merged);
    }
  }, [productListVariant1, productListVariant2]);

  const handlePriceChange = (e, indexVariant1, indexVariant2) => {
    const newPrice = e.target.value;
    if (!isNaN(newPrice) && newPrice >= 0) {
      const updatedList = productListVariant.map(
        (variantGroup, vIndex1) =>
          variantClassCount === 1 && vIndex1 === indexVariant1
            ? { ...variantGroup, price: newPrice } // Cập nhật giá cho variant 1
            : variantClassCount === 2
              ? {
                // Cập nhật giá cho variant 2
                ...variantGroup,
                variant2: variantGroup.variant2.map((item, vIndex2) =>
                  vIndex1 === indexVariant1 && vIndex2 === indexVariant2
                    ? { ...item, price: newPrice }
                    : item
                ),
              }
              : variantGroup // Nếu không phải indexVariant1 hoặc indexVariant2 tương ứng, giữ nguyên
      );
      setProductListVariant(updatedList);
    }
    else
      return 0;
  };

  const handleStockChange = (e, indexVariant1, indexVariant2) => {
    const newStock = e.target.value;
    if (!isNaN(newStock) && newStock >= 0) {
      const updatedList = productListVariant.map(
        (variantGroup, vIndex1) =>
          variantClassCount === 1 && vIndex1 === indexVariant1
            ? { ...variantGroup, stock: newStock } // Cập nhật stock cho variant 1
            : variantClassCount === 2
              ? {
                // Cập nhật stock cho variant 2
                ...variantGroup,
                variant2: variantGroup.variant2.map((item, vIndex2) =>
                  vIndex1 === indexVariant1 && vIndex2 === indexVariant2
                    ? { ...item, stock: newStock }
                    : item
                ),
              }
              : variantGroup // Nếu không phải indexVariant1 hoặc indexVariant2 tương ứng, giữ nguyên
      );
      setProductListVariant(updatedList);
    }
    else
      return 0;
  };

  // Hàm để áp dụng giá mới cho toàn bộ sản phẩm dựa trên variantClassCount
  const handleGlobalChange = (newPrice, newStock) => {
    if (!isNaN(newPrice) && !isNaN(newStock) && newStock > 0 && newPrice > 0) {
      // Thực hiện các hành động sau khi kiểm tra thành công
      const updatedList = productListVariant.map((variantGroup) =>
        variantClassCount === 1
          ? { ...variantGroup, price: newPrice, stock: newStock }
          : {
            ...variantGroup,
            variant2: variantGroup.variant2.map((item) => ({
              ...item,
              price: newPrice,
              stock: newStock,
            })),
          }
      );
      setProductListVariant(updatedList);
    }
    else
      return 0;
  };

  const calculatePrice = (price, profit, discount) => {
    // Chuyển đổi các giá trị thành số thực
    const parsedPrice = parseFloat(price) || 0;
    const parsedProfit = parseFloat(profit) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    // Tính toán giá trị
    const calculatedPrice = (parsedPrice + parsedPrice * (parsedProfit / 100)) * (1 - parsedDiscount / 100);
    // Định dạng giá trị thành tiền tệ
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(calculatedPrice);
  };


  const [showVariationForm, setShowVariationForm] = useState(false);
  const [columns, setColumns] = useState([
    { id: 0, value: "" }, // Ban đầu có một cột
  ]);
  const [inputFields, setInputFields] = useState([
    {
      name: "input1",
      placeholder: "Ví dụ: màu sắc",
      label: "Nhóm phân loại 1",
      value: "",
    },
    {
      name: "input2",
      placeholder: "Ví dụ: kích thước",
      label: "Nhóm phân loại 2",
      value: "",
    },
    // Thêm các ô input khác vào mảng inputFields
  ]);

  const handleAddVariationClick = () => {
    setShowVariationForm(true);
  };
  const handleCloseClick = async () => {
    setShowVariationForm(false);
    setShowVariationForm2(false);
    setColumns([{ id: 0, value: "" }]);
    setColumns2([{ id: 0, value: "" }]);
    setVariantName1("");
    setVariantName2("");
    await setProductListVariant1([]);
    await setProductListVariant2([]);
    await setProductListVariant([]);
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

  function handleAcceptedFiles(files, indexVariant1) {
    const file = files[0];
    if (file) {
      const randomFileName = generateRandomString(10); // Tạo tên file ngẫu nhiên
      const newFile = new File([file], `${randomFileName}.png`, {
        type: file.type,
      });

      const processedFile = Object.assign(file, {
        preview: URL.createObjectURL(file), // Tạo URL xem trước cho file
        formattedSize: formatBytes(file.size), // Định dạng kích thước file
      });

      // Chỉ cập nhật ảnh cho phần tử đầu tiên trong nhóm tương ứng với indexVariant1
      const updatedList = productListVariant.map((variantGroup, vIndex1) =>
        vIndex1 === indexVariant1
          ? { ...variantGroup, image: processedFile }
          : variantGroup
      );
      setProductListVariant(updatedList);
    }
  }

  const handleRemoveImage = (indexVariant1) => {
    // Chỉ loại bỏ ảnh cho phần tử đầu tiên trong nhóm tương ứng với indexVariant1
    const updatedList = productListVariant.map((variantGroup, vIndex1) =>
      vIndex1 === indexVariant1
        ? { ...variantGroup, image: undefined }
        : variantGroup
    );
    setProductListVariant(updatedList);
  };

  //PHÂN LOẠI 2
  const [showVariationForm2, setShowVariationForm2] = useState(false);
  const [columns2, setColumns2] = useState([{ id: 0, value: "" }]); // Ban đầu có một cột

  const handleAddVariationClick2 = () => {
    setShowVariationForm2(true);
  };

  const handleCloseClick2 = async () => {
    setShowVariationForm2(false);
    setColumns2([{ id: 0, value: "" }]);
    setVariantName2("");
    await setProductListVariant2([]);
  };

  //FOCUS

  const [isInputFocused1, setInputFocused1] = useState({}); // Một đối tượng để theo dõi trạng thái focus của các ô input
  // Giá trị outline cố định
  const outlineStyle = "2px solid #007bff";

  const handleInputFocus1 = (inputName) => {
    setInputFocused1((prev) => ({
      ...prev,
      [inputName]: true, // Đánh dấu ô input với tên `inputName` được focus
    }));
  };

  const handleInputBlur1 = (inputName) => {
    setInputFocused1((prev) => ({
      ...prev,
      [inputName]: false, // Đánh dấu ô input với tên `inputName` mất focus
    }));
  };

  const [isInputFocused2, setInputFocused2] = useState({}); // Một đối tượng để theo dõi trạng thái focus của các ô input
  // Giá trị outline cố định

  const handleInputFocus2 = (inputName) => {
    setInputFocused2((prev) => ({
      ...prev,
      [inputName]: true, // Đánh dấu ô input với tên `inputName` được focus
    }));
  };

  const handleInputBlur2 = (inputName) => {
    setInputFocused2((prev) => ({
      ...prev,
      [inputName]: false, // Đánh dấu ô input với tên `inputName` mất focus
    }));
  };
  //Chuyển đổi thành json
  function convertToProductJSON(
    productListVariant,
    variantName1,
    variantName2,
    variantClassCount
  ) {
    let productJSON = {
      imagesVariant: [],
      variant1: [],
      variantName1: variantName1 || null,
      variantName2: variantName2 || null,
      variantClassCount: variantClassCount || 0,
    };

    // Duyệt qua mỗi variant1 trong productListVariant mới
    productListVariant.forEach((variant1Item) => {
      let variant1Obj = {
        _id: variant1Item._id,
        name: variant1Item.name,
        imageName: variant1Item.image ? variant1Item.image.name : null,
        price: variant1Item.price,
        stock: variant1Item.stock,
        position: variant1Item.position,
        index: variant1Item.index,
        variant2: variant1Item.variant2.map((variant2Item) => ({
          _id: variant2Item._id,
          name: variant2Item.name,
          price: variant2Item.price,
          stock: variant2Item.stock,
          position: variant2Item.position,
          index: variant2Item.index,
          // Thêm bất kỳ thuộc tính chung nào từ variant2Item vào đây
        })),
      };

      // Thêm variant1Obj vào mảng variant1 của productJSON
      productJSON.variant1.push(variant1Obj);

      // Nếu variant1Item có image, thêm vào imagesVariant
      if (variant1Item.image) {
        productJSON.imagesVariant.push(variant1Item.image);
      }
    });

    return productJSON;
  }

  useEffect(() => {
    if (showVariationForm && !showVariationForm2) {
      setVariantClassCount(1);
    } else if (showVariationForm && showVariationForm2) {
      setVariantClassCount(2);
    } else {
      setVariantClassCount(0);
    }
  }, [showVariationForm, showVariationForm2]);

  useEffect(() => {
    const jsonResult = convertToProductJSON(
      productListVariant,
      variantName1,
      variantName2,
      variantClassCount
    );
    setProductVariantResult(jsonResult);
  }, [productListVariant, variantName1, variantName2, variantClassCount]); // Xóa productVariantResult khỏi mảng dependencies

  useEffect(() => {
    if (isEditMode && productFound.variantClassCount === 1) {
      setShowVariationForm(true);
      setShowVariationForm2(false);
      setVariantName1(productFound.variantName1)
      splitProductListVariant(productFound);
    }
    else if (isEditMode && productFound.variantClassCount === 2) {
      setShowVariationForm(true);
      setShowVariationForm2(true);
      setVariantName1(productFound.variantName1)
      setVariantName2(productFound.variantName2)
      splitProductListVariant(productFound);
    }

  }, [productFound, isEditMode])
  useEffect(() => {
    console.log("ProductListVariant: ", productListVariant);
  }), [productListVariant]

  const handleToggleChange = (event) => {
    setIsUseDefault(event.target.checked);
  };
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  useEffect(() => {
    const handleActions = async () => {
      if (variantClassCount === 1) {
        await handleCloseClick();
        await sleep(300); // Delay of 1 second
        await handleAddVariationClick();
      } else if (variantClassCount === 2) {
        await handleCloseClick();
        await sleep(300); // Delay of 1 second
        await handleAddVariationClick();
        await sleep(300); // Delay of 1 second
        await handleAddVariationClick2();
      } else if (!isUseDefault&&!isEditMode) {
        await handleCloseClick();
      }else if(isEditMode)
        setIsUseDefault(false);
    };
    handleActions();
  }, [isUseDefault,isEditMode]);
  return (
    <Card>
      <CardHeader>
        <Nav className="nav-tabs-custom card-header-tabs border-bottom-0">
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({
                active: customActiveTab === "1",
              })}
              onClick={() => {
                toggleCustom("1");
              }}
            >
              Thông tin bán hàng
            </NavLink>
          </NavItem>
        </Nav>
      </CardHeader>

      <CardBody>
        <Row>
          {/**BUTTON 1 */}
          {!isEditMode && (
            <Row>
              <Col md={4}>
                <div className="form-check form-switch form-switch-right form-switch-md">
                  <Label className="form-label text-muted">Giá trị mặc định cho nhóm phân loại</Label>
                  <Input
                    className="form-check-input code-switcher"
                    type="checkbox"
                    checked={isUseDefault}
                    onChange={handleToggleChange}
                  />
                </div>
              </Col>
            </Row>
          )}
          {!showVariationForm && (
            <Row style={{ marginBottom: "10px" }}>
              <div
                style={{
                  position: "relative",
                  //backgroundColor: "#f6f6f6",
                  padding: "16px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "15px",
                }}
              >
                <Col sm={6}>
                  <Button
                    className="primary-dash-button"
                    onClick={handleAddVariationClick}
                  >
                    <i className="shopee-icon">+</i> Thêm nhóm phân loại 1
                  </Button>
                </Col>
              </div>
            </Row>
          )}
          {/**Trang phân loại 1 */}
          {showVariationForm && (
            <Row style={{ marginBottom: "10px" }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#f6f6f6",
                  padding: "16px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "15px",
                }}
              >
          

                <Button
                  className="btn btn-soft-danger"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={handleCloseClick}
                >
                  <i className="ri-delete-bin-2-line"></i>
                </Button>
                <Row style={{ marginBottom: "10px" }}>
                  <Col sm={2}>
                    <Label>Nhóm phân loại 1</Label>
                  </Col>
                  <Col sm={6}>
                    <Input
                      type="text"
                      placeholder={inputFields[0].placeholder}
                      value={variantName1||"Màu sắc"}
                      onChange={(e) => setVariantName1(e.target.value)}
                      onFocus={() => handleInputFocus1(inputFields[0].name)}
                      onBlur={() => handleInputBlur1(inputFields[0].name)}
                      style={{
                        marginLeft: "10px",
                        width: "200px",
                        outline: isInputFocused1[inputFields[0].name]
                          ? outlineStyle
                          : "",
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <Label>Phân loại hàng</Label>
                  </Col>
                  <Col sm={10}>
                    <DragAndDropGridVariant
                      onSortedListChange={handleSortedListChange1}
                      defaultSortedList={defaultSortedList1}
                      isUseDefault={isUseDefault}
                      productListVariantChild={productListVariant1}
                      isEditMode={isEditMode}
                    />
                  </Col>
                  {/**Tự thêm cột y hệt để gõ tiếp tại đây */}
                </Row>
              </div>
            </Row>
          )}
          {/**BUTTON 2 */}
          {showVariationForm && !showVariationForm2 && (
            <Row style={{ marginBottom: "10px" }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#f6f6f6",
                  padding: "16px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "15px",
                }}
              >
                <Col sm={6}>
                  <Button
                    className="primary-dash-button"
                    onClick={handleAddVariationClick2}
                  >
                    <i className="shopee-icon">+</i> Thêm nhóm phân loại 2
                  </Button>
                </Col>
              </div>
            </Row>
          )}
          {/**Trang phân loại 2 */}
          {showVariationForm2 && (
            <Row style={{ marginBottom: "10px" }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#f6f6f6",
                  padding: "16px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "15px",
                }}
              >
                <Button
                  className="btn btn-soft-danger"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={handleCloseClick2}
                >
                  <i className="ri-delete-bin-2-line"></i>
                </Button>
                <Row style={{ marginBottom: "10px" }}>
                  <Col sm={2}>
                    <Label>Nhóm phân loại 2</Label>
                  </Col>
                  <Col sm={4}>
                    <Input
                      type="text"
                      placeholder={inputFields[1].placeholder}
                      value={variantName2||"Kích thước"}
                      onChange={(e) => setVariantName2(e.target.value)}
                      onFocus={() => handleInputFocus2(inputFields[1].name)}
                      onBlur={() => handleInputBlur2(inputFields[1].name)}
                      style={{
                        marginLeft: "10px",
                        width: "200px",
                        outline: isInputFocused2[inputFields[1].name]
                          ? outlineStyle
                          : "",
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <Label>Phân loại hàng</Label>
                  </Col>
                  <Col sm={10}>
                    <DragAndDropGridVariant2
                      onSortedListChange={handleSortedListChange2}
                      defaultSortedList={defaultSortedList2}
                      isUseDefault={isUseDefault}
                      productListVariantChild={productListVariant2}
                      isEditMode={isEditMode}
                    />
                  </Col>
                  {/**Tự thêm cột y hệt để gõ tiếp tại đây */}
                </Row>
              </div>
            </Row>
          )}
          {/**TABLE quản lý phân loai */}
          {showVariationForm && (
            <Row style={{ marginBottom: "10px" }}>
              <div className="table-responsive">
                <Label className="form-label" htmlFor="product-title-input">
                  Danh sách phân loại hàng
                </Label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <FormGroup>
                    <Label for="product-title-input1">Giá tiền</Label>
                    <Input
                      type="text"
                      style={{ width: "346px" }}
                      className="form-control"
                      id="product-title-input1"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="Giá tiền"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="product-title-input2">Số lượng</Label>
                    <Input
                      type="text"
                      style={{ width: "346px" }}
                      className="form-control"
                      id="product-title-input2"
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      placeholder="Số lượng"
                    />
                  </FormGroup>
                  <Button
                    className="primary-dash-button"
                    style={{ height: "38px" }}
                    onClick={() => {
                      handleGlobalChange(priceInput, stockInput);
                    }}
                  >
                    Áp dụng cho tất cả phân loại
                  </Button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <FormGroup>
                    <Label for="product-title-input3">Lợi nhuận (%)</Label>
                    <Input
                      type="text"
                      style={{ width: "346px" }}
                      className="form-control"
                      id="product-title-input3"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (!isNaN(newValue) && newValue >= 0) {
                          validation.setFieldValue("profit", newValue);
                        }
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.profit || ""}
                      placeholder="Lợi nhuận (đơn vị %)"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="product-title-input4">Giảm giá (%)</Label>
                    <Input
                      type="text"
                      style={{ width: "346px" }}
                      className="form-control"
                      id="product-title-input4"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (!isNaN(newValue) && newValue >= 0) {
                          validation.setFieldValue("discount", newValue);
                        }
                      }}
                      value={validation.values.discount || ""}
                      placeholder="Giảm giá (đơn vị %)"
                    />
                  </FormGroup>                
                </div>
                <div>
                <p><strong>Ví dụ minh họa cách tính giá:</strong></p>
                <ul>
                  <li>Giá nhập: 100,000 VND</li>
                  <li>Lợi nhuận: 20%</li>
                  <li>Giảm giá: 10%</li>
                  <li>--------------------------</li>
                  <li>
                    <strong>Công thức:</strong> Giá bán = Giá nhập * (1 + Lợi nhuận) * (1 - Giảm giá)
                  </li>
                  <li>
                    <strong>Giá bán: </strong> 100,000 * (1 + 20%) * (1 - 10%) = 108,000 VND
                  </li>
                </ul>
                </div>
                <Table
                  className="table-bordered border-secondary table-nowrap  mb-0"
                  style={{ fontSize: "20px", marginTop: "10px" }}
                >
                  <thead>
                    <tr>
                      <th scope="col">Hình ảnh</th>
                      <th
                        scope="col"
                        style={{
                          outline: isInputFocused1[inputFields[0].name]
                            ? outlineStyle
                            : "",
                          width: "150px",
                        }}
                      >
                        {variantName1
                          ? `${variantName1}`
                          : inputFields[0].label}
                      </th>
                      {showVariationForm2 && (
                        <th
                          scope="col"
                          style={{
                            outline: isInputFocused2[inputFields[1].name]
                              ? outlineStyle
                              : "",
                            width: "150px",
                          }}
                        >
                          {variantName2
                            ? `${variantName2}`
                            : inputFields[1].label}
                        </th>
                      )}
                      <th scope="col" style={{ width: "200px" }}>
                        Giá nhập
                      </th>
                      <th scope="col">Kho hàng</th>
                      <th scope="col">Lợi nhuận(%)</th>
                      <th scope="col">Giảm giá(%)</th>
                      <th scope="col">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productListVariant.map((itemVariant1, indexVariant1) => {
                      const rowspan = showVariationForm2
                        ? itemVariant1.variant2.length
                        : 1;
                      return (
                        <>
                          <tr key={itemVariant1._id || indexVariant1}>
                            {/* First row for each itemVariant1 */}
                            <td
                              rowSpan={rowspan}
                              style={{ verticalAlign: "top" }}
                            >
                              {/* ... your image or dropzone here ... */}
                              {itemVariant1.image ? (
                                <>
                                  <div
                                    style={{
                                      position: "relative",
                                      width: "100px", // You can adjust this width as needed
                                      height: "100px", // Adjust the height to make it proportional
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onBlur={validation.handleBlur}
                                      onClick={() =>
                                        handleRemoveImage(indexVariant1)
                                      }
                                      style={{
                                        position: "absolute",
                                        top: "5px", // Adjusted for smaller container
                                        right: "5px", // Adjusted for smaller container
                                        width: "25px", // Slightly smaller button
                                        height: "25px", // Slightly smaller button
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <i className="mdi mdi-archive-cancel"></i>
                                    </button>
                                    <img
                                      src={itemVariant1.image.preview || itemVariant1.image.url}
                                      alt="product"
                                      style={{
                                        maxWidth: "100%", // This will ensure it is fully contained within the parent div
                                        maxHeight: "100%", // This will ensure it is fully contained within the parent div
                                        display: "block", // This will remove any extra space below the image
                                        margin: "0 auto", // This will center the image within the div
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <CardBody>
                                  <div
                                    style={{
                                      width: "80px", // Set the width to 80px for a smaller square shape
                                      height: "80px", // Set the height to the same as the width for a square
                                      display: "flex", // Center the content inside the Dropzone
                                      alignItems: "center", // Center content vertically
                                      justifyContent: "center", // Center content horizontally
                                      border: "2px dashed #e9ecef", // Optional border
                                      borderRadius: "5px", // Optional rounded corners
                                      overflow: "hidden", // Prevents content from spilling outside the boundary
                                    }}
                                  >
                                    <Dropzone
                                      onDrop={(acceptedFiles) => {
                                        handleAcceptedFiles(
                                          acceptedFiles,
                                          indexVariant1
                                        );
                                      }}
                                    >
                                      {({ getRootProps, getInputProps }) => (
                                        <div
                                          className="dropzone dz-clickable"
                                          {...getRootProps()}
                                        >
                                          <input {...getInputProps()} />
                                          <div className="dz-message needsclick">
                                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                            <h5>Ảnh</h5>
                                          </div>
                                        </div>
                                      )}
                                    </Dropzone>
                                  </div>
                                </CardBody>
                              )}
                            </td>
                            <td
                              rowSpan={rowspan}
                              style={{ verticalAlign: "top" }}
                            >
                              {itemVariant1.name}
                            </td>
                            {!showVariationForm2 && (
                              <>
                                <td>
                                  <Input
                                    type="text"
                                    placeholder="Giá tiền"
                                    value={itemVariant1.price || ""}
                                    onChange={(e) =>
                                      handlePriceChange(e, indexVariant1, null)
                                    }
                                  />
                                </td>
                                <td>
                                  <Input
                                    type="text"
                                    placeholder="Số lượng"
                                    value={itemVariant1.stock || ""}
                                    onChange={(e) =>
                                      handleStockChange(e, indexVariant1, null)
                                    }
                                  />
                                </td>
                                <td>
                                  <span className="profit-display">{validation.values.profit + "%"}</span>
                                </td>
                                <td>
                                  <span className="discount-display">{validation.values.discount + "%"}</span>
                                </td>
                                <td>
                                  <span className="newPrice-display">
                                    {calculatePrice(itemVariant1.price, validation.values.profit, validation.values.discount)}
                                  </span>
                                </td>
                              </>
                            )}
                            {showVariationForm2 &&
                              itemVariant1.variant2.length > 0 && (
                                // Render the first variant2 for this itemVariant1
                                <>
                                  <td>{itemVariant1.variant2[0].name}</td>
                                  <td>
                                    <Input
                                      type="text"
                                      placeholder="Giá tiền"
                                      value={
                                        itemVariant1.variant2[0].price || ""
                                      }
                                      onChange={(e) =>
                                        handlePriceChange(e, indexVariant1, 0)
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      placeholder="Số lượng"
                                      value={
                                        itemVariant1.variant2[0].stock || ""
                                      }
                                      onChange={(e) =>
                                        handleStockChange(e, indexVariant1, 0)
                                      }
                                    />
                                  </td>
                                  <td>
                                    <span className="profit-display">{validation.values.profit + "%"}</span>
                                  </td>
                                  <td>
                                    <span className="discount-display">{validation.values.discount + "%"}</span>
                                  </td>
                                  <td>
                                  <span className="newPrice-display">
                                  {calculatePrice(itemVariant1.variant2[0].price, validation.values.profit, validation.values.discount)}                                  </span>
                                  </td>
                                </>
                              )}
                          </tr>
                          {showVariationForm2 &&
                            // Render the rest of variant2 for this itemVariant1
                            itemVariant1.variant2
                              .slice(1)
                              .map((itemVariant2, indexVariant2) => (
                                <tr key={`variant2-${indexVariant2}`}>
                                  <td>{itemVariant2.name}</td>
                                  <td>
                                    <Input
                                      type="text"
                                      placeholder="Giá tiền"
                                      value={itemVariant2.price || ""}
                                      onChange={(e) =>
                                        handlePriceChange(
                                          e,
                                          indexVariant1,
                                          indexVariant2 + 1
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      placeholder="Số lượng"
                                      value={itemVariant2.stock || ""}
                                      onChange={(e) =>
                                        handleStockChange(
                                          e,
                                          indexVariant1,
                                          indexVariant2 + 1
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <span className="profit-display">{validation.values.profit + "%"}</span>
                                  </td>
                                  <td>
                                    <span className="discount-display">{validation.values.discount + "%"}</span>
                                  </td>
                                  <td>
                                    <span className="newPrice-display">
                                    {calculatePrice(itemVariant2.price, validation.values.profit, validation.values.discount)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Row>
          )}
        </Row>
        {!showVariationForm && (
          <>
            <Row>
              <Col sm={6}>
                <div className="mb-3">
                  <label className="form-label">Giá nhập</label>
                  <Input
                    type="text"
                    placeholder="Nhập giá"
                    value={validation.values.price || ""}
                    onChange={validation.handleChange}
                    invalid={validation.errors.price && validation.touched.price}
                    name="price"
                  />
                  {validation.errors.price && validation.touched.price && (
                    <div className="invalid-feedback">
                      {validation.errors.price}
                    </div>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="mb-3">
                  <label className="form-label">Lợi nhuận(%)</label>
                  <Input
                    type="text"
                    placeholder="Nhập lợi nhuận"
                    value={validation.values.profit || ""}
                    onChange={validation.handleChange}
                    invalid={validation.errors.profit && validation.touched.profit}
                    name="profit"
                  />
                  {validation.errors.profit && validation.touched.profit && (
                    <div className="invalid-feedback">
                      {validation.errors.profit}
                    </div>
                  )}
                </div>

              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Row>
                <div className="mb-3">
                  <label className="form-label">Giảm giá(%)</label>
                  <Input
                    type="text"
                    placeholder="Nhập % giảm"
                    value={validation.values.discount || ""}
                    onChange={validation.handleChange}
                    invalid={
                      validation.errors.discount && validation.touched.discount
                    }
                    name="discount"
                  />
                  {validation.errors.discount && validation.touched.discount && (
                    <div className="invalid-feedback">
                      {validation.errors.discount}
                    </div>
                  )}
                </div>
                </Row>
                <Row>
                <div className="mb-3">
                  <label className="form-label">Kho hàng</label>
                  <Input
                    type="text"
                    placeholder="Nhập số lượng kho hàng"
                    value={validation.values.stock || ""}
                    onChange={validation.handleChange}
                    invalid={validation.errors.stock && validation.touched.stock}
                    name="stock"
                  />
                  {validation.errors.stock && validation.touched.stock && (
                    <div className="invalid-feedback">
                      {validation.errors.stock}
                    </div>
                  )}
                </div>
                </Row>

              </Col>
              <Col sm={6}>
                <p><strong>Ví dụ minh họa cách tính giá:</strong></p>
                <ul>
                  <li>Giá nhập: 100,000 VND</li>
                  <li>Lợi nhuận: 20%</li>
                  <li>Giảm giá: 10%</li>
                  <li>--------------------------</li>
                  <li>
                    <strong>Công thức:</strong> Giá bán = Giá nhập * (1 + Lợi nhuận) * (1 - Giảm giá)
                  </li>
                  <li>
                    <strong>Giá bán: </strong> 100,000 * (1 + 20%) * (1 - 10%) = 108,000 VND
                  </li>
                </ul>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <div className="mb-3">
                  <label className="form-label">Giá bán</label>
                  <div
                    className="text-danger"
                    readOnly={true}
                    name="newPrice"
                  >
                    {calculatePrice(validation.values.price,validation.values.profit,validation.values.discount)}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ProductVariant;
