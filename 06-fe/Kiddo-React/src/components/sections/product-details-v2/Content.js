import React, { Fragment, useState, useEffect, useRef } from "react";
import { handleOutofStock } from "../../../helper/shopHelper";
import Slider from "react-slick";
import { Input, ButtonGroup, Row, Col, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { Tab, Nav } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import ProductReview from "./ProductReview"
import {
  getProducts as onGetProducts,
  addNewCart as onAddNewCart,
  startSession,
  getCustomerById as onGetCustomerById,
  getProductById as onGetProductById,
  getReviewsByProductId as onGetReviewsByProductId,
} from "../../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toast } from 'react-toastify';

import Quickview from "../../layouts/Quickview";
import ProductSwiper from "./ProductSwiper";
import Rating from "react-rating";
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: false
};
const settingsThumb = {
  slidesToShow: 4,
  slidesToScroll: 1,
  dots: false,
  infinite: false,
  focusOnSelect: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

function PrevArrow(props) {
  const { onClick } = props;
  return <i className="fas fa-chevron-left slick-arrow" onClick={onClick} />;
}
function NextArrow(props) {
  const { onClick } = props;
  return <i className="fas fa-chevron-right slick-arrow" onClick={onClick} />;
}
function Content(props) {
  const [qty, setQty] = useState(1);
  const [newPrice, setNewPrice] = useState(1);
  // eslint-disable-next-line
  const [nav1, setNav1] = useState(null);
  // eslint-disable-next-line
  const [nav2, setNav2] = useState(null);
  const slider1Ref = useRef(null)
  const slider2Ref = useRef(null);
  const productDetails = useSelector((state) => state.Ecommerce.productDetails);
  //
  const [selectedVariant1, setSelectedVariant1] = useState(null);
  const [selectedVariant2, setSelectedVariant2] = useState(null);
  const [selectedVariant1Id, setSelectedVariant1Id] = useState(null);
  const [selectedVariant2Id, setSelectedVariant2Id] = useState(null);
  const [infoDisplay, setInfoDisplay] = useState({ newPrice: null, stock: null, originalPrice: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //get productDetail
  const products = useSelector(state => state.Ecommerce.products);
  //get reviews
  const reviews = useSelector(state => state.Ecommerce.reviews);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    setNav1(slider1Ref.current);
    setNav2(slider2Ref.current);
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
    // eslint-disable-next-line 
  }, [products]);
  const idProduct = props.detailId;


  const [uniqueVariantNames, setUniqueVariantNames] = useState([]);
  const [productId, setProductId] = useState(null);
  const [modal_showQuickView, setmodal_ShowQuickView] = useState(false);
  function tog_ShowQuickView(index) {
    setProductId(index);
    setmodal_ShowQuickView(!modal_showQuickView);
  }

  // Sử dụng useEffect để theo dõi thay đổi của productDetails.variant1
  useEffect(() => {
    if (productDetails.variant1) {
      // Thu thập tất cả tên từ variant2
      const variantNames = productDetails.variant1.flatMap(variant =>
        variant.variant2.map(variant2 => variant2.name)
      );
      // Sử dụng Set để lọc ra các tên duy nhất
      const uniqueNames = Array.from(new Set(variantNames));

      // Cập nhật giá trị của uniqueVariantNames
      setUniqueVariantNames(uniqueNames);
    } else {
      console.log("productDetails.variant1 is undefined or null.");
    }
  }, [productDetails.variant1]); // Phụ thuộc vào variant1 trong productDetails



  useEffect(() => {
    if (productDetails && !productDetails.length) {
      dispatch(onGetProductById(idProduct));
      dispatch(onGetReviewsByProductId(idProduct))
    }
    // eslint-disable-next-line
  }, [idProduct]);
  const increment = () => {
    if (qty < productDetails.stock) {
      setQty(qty + 1);
    }
  };

  const decrement = () => {
    setQty(qty > 1 ? qty - 1 : 1);
  };

  const handleChangeQty = (event) => {
    let stock;
    if (productDetails.variantClassCount === 0) {
      stock = productDetails.stock;
    } else if (selectedVariant1 && productDetails.variantClassCount === 1) {
      const variant1 = productDetails.variant1.find(v => v.name === selectedVariant1);
      stock = variant1 ? variant1.stock : null;
    } else if (selectedVariant1 && selectedVariant2 && productDetails.variantClassCount === 2) {
      const variant1 = productDetails.variant1.find(v => v.name === selectedVariant1);
      const variant2 = variant1 ? variant1.variant2.find(v2 => v2.name === selectedVariant2) : null;
      stock = variant2 ? variant2.stock : null;
    }

    let newQuantity = parseInt(event.target.value, 10);
    if (newQuantity > stock) {
      newQuantity = stock; // Giới hạn số lượng tối đa là số lượng trong kho
    } else if (isNaN(newQuantity) || newQuantity <= 0) {
      newQuantity = 1; // Đặt lại số lượng tối thiểu nếu không hợp lệ
    }
    setQty(newQuantity);
  };

  const handleBlurQty = (event) => {
    let stock;
    if (productDetails.variantClassCount === 0) {
      stock = productDetails.stock;
    } else if (selectedVariant1 && productDetails.variantClassCount === 1) {
      const variant1 = productDetails.variant1.find(v => v.name === selectedVariant1);
      stock = variant1 ? variant1.stock : null;
    } else if (selectedVariant1 && selectedVariant2 && productDetails.variantClassCount === 2) {
      const variant1 = productDetails.variant1.find(v => v.name === selectedVariant1);
      const variant2 = variant1 ? variant1.variant2.find(v2 => v2.name === selectedVariant2) : null;
      stock = variant2 ? variant2.stock : null;
    }

    let newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity > stock) {
      newQuantity = 1; // Đặt lại số lượng tối thiểu nếu không hợp lệ
    }
    setQty(newQuantity);
  };

  useEffect(() => {
    let stock = infoDisplay.stock || 1;
    if (qty > stock) {
      setQty(stock);
    } else if (qty <= 0) {
      setQty(1);
    }
    // eslint-disable-next-line
  }, [qty, infoDisplay.stock]);

  const handleChangeImage = (variantId, variantImageName, variantName) => {
    setSelectedVariant1(variantName);
    // Tìm vị trí của variant trong mảng productDetails.variant1
    const variantIndex = productDetails.imagesVariant.findIndex(
      (img) => img.name === variantImageName
    );

    // Nếu không tìm thấy variant hoặc không có slider, thoát khỏi hàm
    if (variantIndex === -1 || !slider1Ref.current) return;
    // Chuyển slider đến vị trí của variant tương ứng
    slider1Ref.current.slickGoTo(variantIndex);

  };
  const handleSelectVariant2 = (variantName) => {
    setSelectedVariant2(variantName);
  };


  function fetchPriceAndStock(selectedVariant1, selectedVariant2, productDetails) {
    // Đầu tiên, tìm variant1 dựa trên variant1Name
    if (!productDetails || !productDetails.variant1) {
      return { newPrice: null, stock: null, originalPrice: null };
    }
    const variant1 = productDetails.variant1.find(v => v.name === selectedVariant1);

    // Trường hợp chỉ có 1 lớp phân loại

    if (productDetails.variantClassCount === 0) {
      return { stock: productDetails.stock }
    }
    if (productDetails.variantClassCount === 1) {
      // Trả về thông tin giá và số lượng của variant 1
      if (!selectedVariant1) {
        return { newPrice: `${new Intl.NumberFormat().format(productDetails.minPrice)}-${new Intl.NumberFormat().format(productDetails.maxPrice)}`, stock: null }
      }
      setSelectedVariant1Id(variant1?._id);
      return { newPrice: new Intl.NumberFormat().format(variant1?.newVariant1Price), stock: variant1?.stock, originalPrice: new Intl.NumberFormat().format(variant1?.originalPrice) };
    }
    // Trường hợp có 2 lớp phân loại
    if (productDetails.variantClassCount === 2) {
      // Kiểm tra variant2 trong variant1
      if (!selectedVariant1 || !selectedVariant2)
        return { newPrice: `${new Intl.NumberFormat().format(productDetails.minPrice)}-${new Intl.NumberFormat().format(productDetails.maxPrice)}`, stock: null, originalPrice: null }

      else {
        // Trả về thông tin giá và số lượng của variant 2
        const variant2 = variant1?.variant2?.find(v2 => v2.name === selectedVariant2);
        setSelectedVariant1Id(variant1?._id);
        setSelectedVariant2Id(variant2?._id);
        return { newPrice: new Intl.NumberFormat().format(variant2?.newVariant2Price), stock: variant2?.stock, originalPrice: new Intl.NumberFormat().format(variant2?.originalPrice) };
      }
    }
    return { newPrice: null, stock: null, originalPrice: null };
  }


  useEffect(() => {
    const info = fetchPriceAndStock(selectedVariant1, selectedVariant2, productDetails);
    setInfoDisplay(info);
    // eslint-disable-next-line
  }, [selectedVariant1, selectedVariant2, productDetails]);


  useEffect(() => {
    if (
      productDetails &&
      productDetails.newPrice &&
      productDetails.discount !== undefined
    ) {
      setNewPrice(productDetails.newPrice);
    }
  }, [productDetails]);
  // Gọi useEffect mà không điều kiện


  //Mua ngay

  const handleBuyNow = async () => {
    try {
      const variant1 = productDetails.variant1.find((v) => v.name === selectedVariant1);
      const variant2 = variant1?.variant2.find((v2) => v2.name === selectedVariant2);
      console.log(variant1);
      console.log(variant2);
      let items = [];

      if (productDetails.variantClassCount === 0) {
        items = [
          {
            _id: productDetails._id,
            product: productDetails,
            price: newPrice,
            quantity: qty,
          },
        ];
      } else if (productDetails.variantClassCount === 1) {
        if (selectedVariant1) {
          items = [
            {
              _id: productDetails._id,
              product: productDetails,
              variant1: variant1,
              price: variant1.newVariant1Price,
              quantity: qty,
            },
          ];
        }
      } else if (productDetails.variantClassCount === 2) {
        if (selectedVariant1 && selectedVariant2) {
          items = [
            {
              _id: productDetails._id,
              product: productDetails,
              variant1: variant1,
              variant2: variant2,
              price: variant2.newVariant2Price,
              quantity: qty,
            },
          ];
        }
      }
      console.log(productDetails);
      console.log(items);
      if (items.length === 0) {
        throw new Error("Vui lòng chọn đầy đủ biến thể");
      }
      // Chuyển đến trang checkout và truyền dữ liệu thông qua props
      navigate("/checkout-v2", { state: { items, products } });
      toast.success("Cảm ơn quý khách", { autoClose: 3000 });
    } catch (error) {
      console.error("Error during buy now:", error);
      toast.error(error.message, { autoClose: 3000 });
    }
  };

  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken);
  const handleAddToCart = async () => {
    await dispatch(startSession());

    if (isSessionActive) {
      // Cấu trúc cơ bản của đối tượng productToAdd
      let productToAdd = {};
      if (productDetails.variantClassCount === 0) {
        productToAdd = {
          userId: token.userId,
          productId: productDetails._id,
          quantity: qty,
        };
      }
      else if (productDetails.variantClassCount === 1) {
        if (selectedVariant1)
          productToAdd = {
            userId: token.userId,
            productId: productDetails._id,
            variant1Id: selectedVariant1Id,
            quantity: qty,

          };
      }
      else if (productDetails.variantClassCount === 2) {
        if (selectedVariant1 && selectedVariant2)
          productToAdd = {
            userId: token.userId,
            productId: productDetails._id,
            variant1Id: selectedVariant1Id,
            variant2Id: selectedVariant2Id,
            quantity: qty,
          };
      }
      try {
        // Gửi action để thêm sản phẩm vào giỏ hàng
        const actionResult = await dispatch(onAddNewCart(productToAdd));

        // Kiểm tra xem action đã hoàn thành thành công hay không
        if (onAddNewCart.fulfilled.match(actionResult)) {
          // Xử lý khi thêm sản phẩm thành công
          console.log("Sản phẩm đã được thêm vào giỏ hàng thành công:", actionResult.payload);
          // Có thể cập nhật UI, hiển thị thông báo thành công, chuyển hướng người dùng, v.v...
          await dispatch(onGetCustomerById(token.userId));
        } else {
          // Xử lý khi thêm sản phẩm không thành công
          console.error("Không thể thêm sản phẩm vào giỏ hàng:", actionResult.error.message);
          // Hiển thị thông báo lỗi hoặc ghi log lỗi tại đây
        }
      } catch (error) {
        // Xử lý các lỗi không xác định phát sinh trong quá trình dispatch action
        console.error("Lỗi không xác định khi thêm sản phẩm vào giỏ hàng:", error);
        // Hiển thị thông báo lỗi hoặc thực hiện các xử lý lỗi khác
      }


    } else {
      navigate("/login");
    }
    // Tiếp tục với các bước cần thiết khác sau khi thêm vào giỏ hàng...
  };
  //Ngắt trang Review
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // Tính toán số lượng trang
  const pageCount = productDetails && reviews ? Math.ceil(reviews.length / itemsPerPage) : 0;
  // Lấy các reviews cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews ? reviews.slice(indexOfFirstItem, indexOfLastItem) : [];


  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalRatings = productDetails && productDetails.ratingCounts
    ? Object.values(productDetails.ratingCounts).reduce((sum, count) => sum + count, 0)
    : 0;
  const getPercentage = (count) => {
    return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  };
  const handleFilterChange = (rating) => {
    setSelectedFilter(rating);
  };

  const filteredReviews = selectedFilter
    ? currentReviews.filter(review => review.rating === selectedFilter)
    : currentReviews;
  if (productDetails.length === 0) {
    return <div>Không có sản phẩm nào để hiển thị.</div>; // Hoặc bất kỳ thông báo nào bạn muốn
  }

  return (
    <Fragment>
      <div className="row hm-product-details">
        <ToastContainer closeButton={false} limit={1} />
        <div className="col-xl-5 col-md-6">
          <div>
            <Slider
              asNavFor={slider2Ref.current}
              ref={slider1Ref}
              {...settings}
              className="hm-product-img-wrapper hm-focused-product"
            >
              {/* Data */}
              {productDetails &&
                productDetails.images &&
                productDetails.imagesVariant.map((image, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      marginRight: "20px",
                      width: '100%', // Adjust width as needed
                      height: '450px', // Adjust height as needed
                      borderRadius: '20px', // Rounded corners
                      overflow: 'hidden', // Prevent image overflow when zooming
                    }}
                  // onMouseEnter={(e) => {
                  //   e.currentTarget.style.transform = 'scale(1.05)'; // Zoom in effect
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.currentTarget.style.transform = 'scale(1)'; // Zoom out effect
                  // }}
                  >
                    <div // Background image div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${productDetails.frameStyle.length !== 0 ? productDetails.frameStyle[0].url : ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '20px',

                      }}
                    />
                    <img src={image.url} alt={productDetails.name}

                    />
                  </div>
                ))}
              {productDetails &&
                productDetails.images &&
                productDetails.images.map((image, i) => (
                  <div key={i}
                    style={{
                      position: 'relative',
                      width: '100%', // Adjust width as needed
                      height: '450px', // Adjust height as needed
                      borderRadius: '20px', // Rounded corners
                      overflow: 'hidden', // Prevent image overflow when zooming
                    }}
                  >
                    <div // No background image here, just normal image
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <img src={image.url} alt={productDetails.name} />
                    </div>
                  </div>
                ))}

              {/* Data */}
            </Slider>
          </div>
          <Slider
            asNavFor={slider1Ref.current} // Thay đổi thành slider1Ref
            ref={slider2Ref}
            {...settingsThumb}
            focusOnSelect={true}
            className="hm-product-img-slider hm-product-slider"
          >
            {/* Data */}

            {productDetails.imagesVariant.map((image, i) => (
              <img key={i} src={image.url} alt={productDetails.name} />
            ))}
            {productDetails.images.map((image, i) => (
              <img key={i} src={image.url} alt={productDetails.name} />
            ))}
            {/* Data */}
          </Slider>
        </div>
        <div className="col-xl-7 col-md-6">
          <div className="hm-product-content">
            <h1 className="hm-product-title">{productDetails.name}</h1>
            <div style={{ display: 'flex' }}>
              <h4 style={{ marginRight: "20px", color: "blue" }}>{productDetails.category.name}</h4>
              <h4 style={{ marginRight: "20px", color: "green" }}>{productDetails.brand.name}</h4>
            </div>
            <h4
              className={`stock in-stock ${productDetails.stock !== 0 ? "" : "text-danger"
                }`}
            >
              {productDetails.stock !== 0
                ? `Còn hàng: ${productDetails.stock}`
                : "Hết hàng"}
            </h4>
            <p className="hm-product-description">
              <span
                style={{ fontSize: "20px" }}
                dangerouslySetInnerHTML={{
                  __html: productDetails.description.slice(0, 1000),
                }}
              />
            </p>
            <div>
              {productDetails.variantClassCount === 2 && (
                <div className="hm-product-variants">
                  <div
                    className="hm-variant-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div>{productDetails.variantName1}</div>
                    </div>
                    <div
                      style={{ flex: 6, display: "flex", flexDirection: "row" }}
                    >

                      <ButtonGroup>
                        {productDetails.variant1.map((variant1, index) => (
                          <React.Fragment key={index}>
                            <Input
                              type="radio"
                              className="btn-check"
                              name="btnradio1"
                              id={`btnradio${index}`}
                              onChange={() => handleChangeImage(variant1._id, variant1.imageName, variant1.name)}
                            />
                            <label
                              className="btn btn-outline-secondary mb-0"
                              htmlFor={`btnradio${index}`}
                            >
                              {variant1.name}
                            </label>
                          </React.Fragment>
                        ))}
                      </ButtonGroup>

                    </div>
                  </div>
                  <div
                    className="hm-variant-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div>{productDetails.variantName2}</div>
                    </div>
                    <div
                      style={{ flex: 6, display: "flex", flexDirection: "row" }}
                    >
                      {uniqueVariantNames.map((variant2Name, index) => (
                        <React.Fragment key={index}>
                          <Input
                            type="radio"
                            className="btn-check"
                            name="btnradio2"
                            id={`btnradio-unique-${index}`}
                            onChange={() => handleSelectVariant2(variant2Name)}
                          />
                          <label
                            className="btn btn-outline-secondary mb-0"
                            htmlFor={`btnradio-unique-${index}`}
                          >
                            {variant2Name}
                          </label>
                        </React.Fragment>
                      ))}

                    </div>
                  </div>
                </div>
              )}

              {productDetails.variantClassCount === 1 && (
                <div className="hm-product-variants">
                  <div
                    className="hm-variant-container"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div>{productDetails.variantName1}</div>
                    </div>
                    <div
                      style={{ flex: 6, display: "flex", flexDirection: "row" }}
                    >
                      {productDetails.variant1.map((variant1, i) => (
                        <div key={i} className="variant">
                          <Input
                            type="radio"
                            className="btn-check"
                            name="btnradio"
                            id={`btnradio${i}`} // Đảm bảo id duy nhất cho mỗi radio button
                            onClick={() => handleChangeImage(variant1._id, variant1.imageName, variant1.name)}
                          />
                          <label
                            className="btn btn-outline-secondary mb-0"
                            htmlFor={`btnradio${i}`} // Sử dụng htmlFor phù hợp với id của radio button
                          >
                            {variant1.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div
              className="quantity hm-variant-container"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <div style={{ flex: 1 }}>Số lượng </div>
              <div
                className="hm-variant-selection"
                style={{ flex: 6, display: "flex", flexDirection: "row" }}
              >
                <input
                  type="button"
                  defaultValue="-"
                  className="minus btn btn-outline-secondary hm-qty-btn"
                  onClick={decrement}
                />
                <input
                  type="number"
                  className="product-quantity"
                  value={qty}
                  name="quantity"
                  onChange={handleChangeQty}
                  onBlur={handleBlurQty}
                  style={{ textAlign: "center", margin: "0 5px" }} // Căn giữa số lượng và thêm khoảng cách
                />
                <input
                  type="button"
                  defaultValue="+"
                  className="plus btn btn-outline-secondary hm-qty-btn"
                  onClick={increment}
                />
                {productDetails.variantClassCount >= 0 && (
                  <div style={{ marginLeft: "10px", marginTop: "5px", flex: 1 }}>
                    Còn {infoDisplay.stock} sản phẩm
                  </div>
                )}
              </div>
            </div>

            <div className="hm-product-price">
              <span className="hm-discounted-price hm-text-primary">
                {infoDisplay.newPrice || new Intl.NumberFormat().format(productDetails.newPrice)}đ
              </span>
              {productDetails.discount > 0 || productDetails.discount !== "" ? (
                <span className="hm-actual-price has-discount">
                  {infoDisplay.originalPrice || new Intl.NumberFormat().format(productDetails.price)} đ
                </span>
              ) : (
                ""
              )}
            </div>
            {/* Add To Cart */}
            {infoDisplay.stock !== 0 ? (
              <div className="row">
                <div>
                  <button
                    type="button"
                    className="btn hm-add-to-cart btn-lg btn btn-primary my-3 btn-length"
                    onClick={handleBuyNow}
                    style={{ marginRight: "10px" }}
                  >
                    <i className="custom" /> Mua ngay
                  </button>

                  <button
                    type="button"
                    className="btn hm-add-to-cart btn-lg btn btn-primary my-3 btn-length"
                    style={{ marginRight: "10px" }}
                    onClick={handleAddToCart}
                  >
                    <i className="flaticon-shopping-cart" /> Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn hm-add-to-cart btn-lg btn btn-primary my-3"
                onClick={handleOutofStock}
                disabled
              >
                <i className="flaticon-shopping-cart" /> Hết hàng{" "}
              </button>
            )}
            <div>
              <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                <i className="fas fa-rss hm-to-right" />
              </span>
              {/* Wishlist */}
              <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                <i className="fas fa-heart hm-to-right" />
              </span>
            </div>
            {/* <Countdown date={Date.now() + 31622400000} renderer={renderer} /> */}
          </div>
        </div>
      </div>
      <div className="hm-product-info">
        <Tab.Container defaultActiveKey="tab1">
          <Nav as="ul" varient="tabs" className="nav nav-tabs">
            <Nav.Item as="li">
              <Nav.Link eventKey="tab1">Mô tả</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="tab2">Thông tin sản phẩm</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="tab3">
                Đánh giá ({reviews.length})

              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="tab1">
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <div
                        style={{ fontSize: "20px" }}
                        dangerouslySetInnerHTML={{ __html: productDetails.description }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Tab.Pane>

            <Tab.Pane eventKey="tab2">
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: productDetails.specification,
                        }}
                      />
                    </td>
                  </tr>
                  {/* Nếu bạn muốn hiển thị thêm thông tin, bạn có thể bỏ comment và chỉnh sửa phần này */}
                  {/* {item.addinfo.map((info, i) => (
        <tr key={i}>
          <td>{info.title}</td>
          <td>{info.text}</td>
        </tr>
      ))} */}
                </tbody>
              </table>
            </Tab.Pane>

            <Tab.Pane eventKey="tab3">
              <Row className="gy-4 gx-0">
                <Col lg={6}>
                  <div>
                    <div className="pb-3">
                      <div className="bg-light px-3 py-2 rounded-2 mb-2">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <div className="fs-16 align-middle text-warning">
                              <Rating
                                initialRating={productDetails.averageRating}
                                fractions={2}
                                emptySymbol="mdi mdi-star-outline text-muted "
                                fullSymbol="mdi mdi-star text-warning "
                                readonly
                              />
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <h6 className="mb-0">{productDetails.averageRating}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">
                          Tổng số{" "}
                          <span className="fw-medium">{reviews.length}</span>{" "}
                          đánh giá
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      {["fiveStar", "fourStar", "threeStar", "twoStar", "oneStar"].map((key, index) => {
                        const star = 5 - index;
                        const count = productDetails && productDetails.ratingCounts ? productDetails.ratingCounts[key] : 0;
                        const percentage = getPercentage(count);
                        const colorClass = ["bg-success", "bg-primary", "bg-success", "bg-warning", "bg-danger"][index];

                        return (
                          <Row className="align-items-center g-2" key={key}>
                            <div className="col-auto">
                              <div className="p-2">
                                <h6 className="mb-0">{star} Sao</h6>
                              </div>
                            </div>
                            <div className="col">
                              <div className="p-2">
                                <div className="progress animated-progess progress-sm">
                                  <div
                                    className={`progress-bar ${colorClass}`}
                                    role="progressbar"
                                    style={{ width: `${percentage}%` }}
                                    aria-valuenow={percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="p-2">
                                <h6 className="mb-0 text-muted">{count}</h6>
                              </div>
                            </div>
                          </Row>
                        );
                      })}
                    </div>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="ps-lg-4">
                    <div className="d-flex flex-wrap align-items-start gap-3">
                      <h5 className="fs-14">Đánh giá:  </h5>
                    </div>

                    <SimpleBar
                      className="me-lg-n3 pe-lg-4"

                    >
                      <ButtonGroup>
                        <Button
                          color={selectedFilter === null ? 'primary' : 'secondary'}
                          onClick={() => handleFilterChange(null)}
                        >
                          Tất cả
                        </Button>
                        {[5, 4, 3, 2, 1].map(rating => (
                          <Button
                            key={rating}
                            color={selectedFilter === rating ? 'primary' : 'secondary'}
                            onClick={() => handleFilterChange(rating)}
                          >
                            {rating} Sao
                          </Button>
                        ))}
                      </ButtonGroup>
                      <ul className="list-unstyled mb-0">
                        <div>
                          {filteredReviews.map((review, key) => (
                            <React.Fragment key={key}>
                              <ProductReview review={review} />
                            </React.Fragment>
                          ))}

                          {/* Hiển thị phân trang */}
                          <nav>
                            <ul className='pagination'>
                              {Array.from({ length: pageCount }, (_, i) => (
                                <li key={i} className='page-item'>
                                  <button onClick={() => paginate(i + 1)} className='page-link'>
                                    {i + 1}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </nav>
                        </div>
                      </ul>
                    </SimpleBar>
                  </div>
                </Col>
              </Row>
              {/* <ul className="hm-reviews">
                {item.reviews.map((review, i) => (
                  <li key={i}>
                    {getAuthor(review.user).map((author, i) => (
                      <p className="hm-reviewer" key={i}>
                        {author.name}
                      </p>
                    ))}
                    <ul className="hm-product-rating">
                      {Rating(review.rating)}
                    </ul>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>*/}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <ProductSwiper
        nameTitle={"Sản phẩm phối cùng"}
        products={productDetails.relatedProducts}
        tog_ShowQuickView={tog_ShowQuickView}
      ></ProductSwiper>

      <Modal
        size="xl"
        isOpen={modal_showQuickView}
        toggle={() => {
          tog_ShowQuickView();
        }}
      >
        <ModalHeader className="modal-title"
          id="myExtraLargeModalLabel" toggle={() => {
            tog_ShowQuickView();
          }}>
          Xem nhanh
        </ModalHeader>
        <ModalBody>
          <Quickview
            productId={productId}
            test="test"
          />
        </ModalBody>
      </Modal>

    </Fragment>
  );
}

export default Content;
