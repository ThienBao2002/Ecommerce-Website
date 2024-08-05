import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Tooltip,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  ButtonGroup,
  Button,
} from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";


import { productDetailsWidgets } from "../../../common/data/ecommerce";
// Ecommerce > Product Details

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import classnames from "classnames";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ProductReview from "./ProductReview";
import { ToastContainer } from "react-toastify";
import { Link, useParams,useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductById as onGetProductById,
  getReviewsByProductId as onGetReviewsByProductId,

} from "../../../slices/thunks";
import Loader from "../../../Components/Common/Loader";
import Rating from "react-rating";
SwiperCore.use([FreeMode, Navigation, Thumbs]);

function changeLabelDetailInPlace(array, productDetails) {
  array.forEach((item, index) => {
    switch (index) {
      case 0: //price
        item.labelDetail = productDetails
          ? productDetails.price + " / " + (productDetails.newPrice || "N/A")
          : "N/A";
        break;
      case 1: // No. of Orders :
        item.labelDetail = productDetails ? productDetails.ordersCount : "N/A"; // Kiểm tra productDetails trước khi truy cập thuộc tính ordersCount
        break;
      case 2: // Available Stocks :
        item.labelDetail = productDetails ? productDetails.stock : "N/A"; // Kiểm tra productDetails trước khi truy cập thuộc tính stock
        break;
      case 3: //Total Revenue :
        item.labelDetail = "New Value 3";
        break;
      default:
      // Không làm gì nếu index không khớp
    }
  });
}

const PricingWidgetList = ({ pricingDetails, infoDisplay }) => {
  let value = "";
  switch (pricingDetails.label) {
    case "Giá cũ - Giá mới":
      value = infoDisplay.newPrice + "đ";
      break;
    case "Kho hàng":
      value = infoDisplay.stock;
      break;
    case "Original Price":
      value = infoDisplay.originalPrice;
      break;
    default:
      value = "N/A";
  }

  return (
    <React.Fragment>
      <Col lg={3} sm={6}>
        <div className="p-2 border border-dashed rounded">
          <div className="d-flex align-items-center">
            <div className="avatar-sm me-2">
              <div className="avatar-title rounded bg-transparent text-secondary fs-24">
                <i className={pricingDetails.icon}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <p className="text-muted mb-1">{pricingDetails.label}:</p>
              <h5 className="mb-0">{value}</h5>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};


function EcommerceProductDetail(props) {
  const idObject = useParams();
  const idProduct = idObject._id;

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.Ecommerce.productDetails);
  const reviews = useSelector(state => state.Ecommerce.reviews);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (productDetails && !productDetails.length) {
      dispatch(onGetProductById(idProduct));
      dispatch(onGetReviewsByProductId(idProduct))
    }
  }, [idProduct, dispatch]);
  changeLabelDetailInPlace(productDetailsWidgets, productDetails);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [ttop, setttop] = useState(false);

  const [customActiveTab, setcustomActiveTab] = useState("1");

  const [selectedVariant1, setSelectedVariant1] = useState(null);
  const [selectedVariant2, setSelectedVariant2] = useState(null);
  const [selectedVariant1Id, setSelectedVariant1Id] = useState(null);
  const [selectedVariant2Id, setSelectedVariant2Id] = useState(null);
  const [infoDisplay, setInfoDisplay] = useState({ newPrice: null, stock: null, originalPrice: null });
  const [selectedFilter, setSelectedFilter] = useState(null);


  const [uniqueVariantNames, setUniqueVariantNames] = useState([]);

  // Sử dụng useEffect để theo dõi thay đổi của productDetails.variant1
  useEffect(() => {
    // Kiểm tra nếu productDetails.variant1 tồn tại
    if (productDetails.variant1) {
      const flattenedVariantNames = productDetails.variant1.flatMap((variant) =>
        variant.variant2.map((variant2) => variant2.name)
      );

      // Sử dụng Set để lọc ra các tên duy nhất
      const uniqueNames = Array.from(new Set(flattenedVariantNames));

      // Cập nhật giá trị của uniqueVariantNames
      setUniqueVariantNames(uniqueNames);
    } else {
      console.error("productDetails.variant1 is undefined or null.");
    }
  }, [productDetails.variant1]);


  const [selectedImageUrl, setSelectedImageUrl] = useState(''); // Thêm state này ở đầu component của bạn

  const handleChangeImage = (variantId, variantImageName, variantName) => {
    setSelectedVariant1(variantName);
  };
  // Đảm bảo bạn đã import useState từ React
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

    if (productDetails.variantClassCount === 1) {
      // Trả về thông tin giá và số lượng của variant 1
      if (!selectedVariant1) {
        return { newPrice: `${new Intl.NumberFormat().format(productDetails.minPrice)}-${new Intl.NumberFormat().format(productDetails.maxPrice)}`, stock: null }
      }
      setSelectedVariant1Id(variant1._id);
      return { newPrice: new Intl.NumberFormat().format(variant1.newVariant1Price), stock: variant1.stock, originalPrice: new Intl.NumberFormat().format(variant1.originalPrice) };
    }
    // Trường hợp có 2 lớp phân loại
    if (productDetails.variantClassCount === 2) {
      // Kiểm tra variant2 trong variant1
      if (!selectedVariant1 || !selectedVariant2)
        return { newPrice: `${new Intl.NumberFormat().format(productDetails.minPrice)}-${new Intl.NumberFormat().format(productDetails.maxPrice)}`, stock: null, originalPrice: null }

      else {
        // Trả về thông tin giá và số lượng của variant 2
        const variant2 = variant1.variant2.find(v2 => v2.name === selectedVariant2);
        setSelectedVariant1Id(variant1._id);
        setSelectedVariant2Id(variant2._id);
        return { newPrice: new Intl.NumberFormat().format(variant2.newVariant2Price), stock: variant2.stock, originalPrice: new Intl.NumberFormat().format(variant2.originalPrice) };

      }
    }
    return { newPrice: null, stock: null, originalPrice: null };
  }


  useEffect(() => {
    const info = fetchPriceAndStock(selectedVariant1, selectedVariant2, productDetails);
    setInfoDisplay(info);
    // eslint-disable-next-line
  }, [selectedVariant1, selectedVariant2, productDetails]);


  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  //Ngắt trang Review
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const pageCount = productDetails && reviews ? Math.ceil(reviews.length / itemsPerPage) : 0;
  const [currentReviews, setCurrentReviews] = useState([]);
  const reviewId = searchParams.get('reviewId'); // Lấy reviewId từ URL
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    if (reviewId) {
      // Find and set the single review based on reviewId
      const review = reviews.find(r => r._id === reviewId);
      if (review) {
        // Lọc review này ra khỏi mảng reviews ban đầu
        const filteredReviews = reviews.filter(r => r._id !== reviewId);
        // Đặt review tìm thấy lên đầu danh sách
        setCurrentReviews([review, ...filteredReviews]);
      } else {
        setCurrentReviews([]);
      }
    } else {
      // Paginate normally
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setCurrentReviews(reviews.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [reviewId, reviews, currentPage]);

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

  document.title =
    "Product Details | Kiddo - Trang quản trị ";
  if (productDetails.length === 0) {
    return <Loader />; // Hoặc bất kỳ thông báo nào bạn muốn
  }
  return (
    <div className="page-content">
          <ToastContainer closeButton={false} limit={1} />
      <Container fluid>
        <BreadCrumb title="Chi tiết sản phẩm" pageTitle="Thương mại điện tử" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row className="gx-lg-5">
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="product-img-slider sticky-side-div">
                      <Swiper

                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="swiper product-thumbnail-slider p-2 rounded bg-light"
                      >
                        <div className="swiper-wrapper">
                          {productDetails.imagesVariant.map((image, index) => (
                            <SwiperSlide>
                              <img
                                src={image.url}
                                key={index}
                                alt=""
                                className="img-fluid d-block"
                              />
                            </SwiperSlide>
                          ))}
                          {productDetails.images.map((image, index) => (
                            <SwiperSlide >

                              <img
                                src={image.url}
                                key={index}
                                alt=""
                                className="img-fluid d-block"
                              />
                            </SwiperSlide>
                          ))}
                          <div>
                            {selectedImageUrl && <img src={selectedImageUrl} alt="Selected variant" />}
                            {/* Các thành phần khác của bạn */}
                          </div>
                        </div>
                      </Swiper>

                      {productDetails.images.length > 0 && (
                        <div className="product-nav-slider mt-2">
                          <Swiper
                            onSwiper={setThumbsSwiper}
                            slidesPerView={productDetails.images.length}
                            freeMode={true}
                            watchSlidesProgress={true}
                            spaceBetween={10}
                            className="swiper product-nav-slider mt-2 overflow-hidden"
                          >
                            <div className="swiper-wrapper">
                              {productDetails.imagesVariant.map((image, index) => (
                                <SwiperSlide className="rounded">
                                  <div className="nav-slide-item">
                                    <img
                                      src={image.url}
                                      key={index}
                                      alt=""
                                      className="img-fluid d-block rounded"
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                              {productDetails.images.map((image, index) => (
                                <SwiperSlide className="rounded">
                                  <div className="nav-slide-item">
                                    <img
                                      src={image.url}
                                      key={index}
                                      alt=""
                                      className="img-fluid d-block rounded"
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </div>
                          </Swiper>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h5>{productDetails.name}</h5>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              <Link to="#" className="text-primary d-block">
                                {productDetails.brand.name}
                              </Link>
                            </div>
                            <div className="text-muted">
                              Thêm vào :{" "}
                              <span className="text-body fw-medium">
                                {productDetails.publishedDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div>
                            <Tooltip
                              placement="top"
                              isOpen={ttop}
                              target="TooltipTop"
                              toggle={() => {
                                setttop(!ttop);
                              }}
                            >
                              Chỉnh sửa
                            </Tooltip>
                            <Link
                              id="TooltipTop"
                              to={`/apps-ecommerce-add-product/${productDetails._id}`}
                              className="text-body"
                            >
                              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                              Chỉnh sửa
                            </Link>
                          </div>
                        </div>
                      </div>

                      <Row className="mt-4">
                        {productDetailsWidgets.map((pricingDetails, key) => (
                          <PricingWidgetList
                            pricingDetails={pricingDetails}
                            infoDisplay={infoDisplay}
                            key={key}
                          />
                        ))}
                      </Row>

                      {productDetails.variantClassCount === 2 && (
                        <div>
                          <div className=" mt-4">
                            <h5 className="fs-14">{productDetails.variantName1}</h5>
                            <div style={{ flex: 6, display: "flex", flexDirection: "row" }}>
                              <ButtonGroup>
                                {productDetails.variant1.map((variant1, index) => (
                                  <React.Fragment key={index}>
                                    <Input
                                      type="radio"//phần này là bộ nút của variant 1
                                      className="btn-check"
                                      name="btnradio1"
                                      id={`btnradio${index}`} // Tạo ID duy nhất cho mỗi radio button dựa vào index
                                      onChange={() => handleChangeImage(variant1._id, variant1.imageName, variant1.name)}
                                    />
                                    <label
                                      className="btn btn-outline-secondary mb-0"
                                      htmlFor={`btnradio${index}`} // Sử dụng htmlFor tương ứng với ID của input
                                    >
                                      {variant1.name}
                                    </label>
                                  </React.Fragment>
                                ))}
                              </ButtonGroup>
                            </div>
                          </div>


                          <div className=" mt-4">
                            <h5 className="fs-14">{productDetails.variantName2}</h5>
                            <div style={{ flex: 6, display: "flex", flexDirection: "row" }}>
                              <ButtonGroup>
                                {uniqueVariantNames.map((variant2Name, index) => (
                                  <React.Fragment key={index}>
                                    <Input
                                      type="radio"//phần này là bộ nút của variant 2
                                      className="btn-check"
                                      name="btnradio2"
                                      id={`btnradio-unique-${index}`} // Tạo ID duy nhất cho mỗi radio button
                                      onChange={() => handleSelectVariant2(variant2Name)} // Thay đổi hình ảnh dựa trên tên
                                    />
                                    <label
                                      className="btn btn-outline-secondary mb-0"
                                      htmlFor={`btnradio-unique-${index}`} // Liên kết label với input thông qua htmlFor
                                    >
                                      {variant2Name}
                                    </label>
                                  </React.Fragment>
                                ))}
                              </ButtonGroup>
                            </div>
                          </div>
                        </div>
                      )}

                      {productDetails.variantClassCount === 1 && (
                        <Row>
                          <Col xl={6}>
                            <div className=" mt-4">
                              <h5 className="fs-14">{productDetails.variantName1}</h5>
                              <div style={{ flex: 6, display: "flex", flexDirection: "row" }}>
                                <ButtonGroup>
                                  {productDetails.variant1.map((variant1, index) => (
                                    <React.Fragment key={index}>
                                      <Input
                                        type="radio"//phần này là bộ nút của variant 1
                                        className="btn-check"
                                        name="btnradio1"
                                        id={`btnradio${index}`} // Tạo ID duy nhất cho mỗi radio button dựa vào index
                                        onClick={() => handleChangeImage(variant1._id, variant1.imageName, variant1.name)}
                                      />
                                      <label
                                        className="btn btn-outline-secondary mb-0"
                                        htmlFor={`btnradio${index}`} // Sử dụng htmlFor tương ứng với ID của input
                                      >
                                        {variant1.name}
                                      </label>
                                    </React.Fragment>
                                  ))}
                                </ButtonGroup>

                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                      <div className="mt-4 text-muted">

                        <div>Còn {infoDisplay.stock} sản phẩm</div>
                      </div>

                      <div className="mt-4 text-muted">
                        <h5 className="fs-14">Mô tả :</h5>
                        <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
                      </div>


                      <div className="product-content mt-5">
                        <h5 className="fs-14 mb-3">Thông tin sản phẩm :</h5>
                        <Nav tabs className="nav-tabs-custom nav-success">
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
                              Chi tiết sản phẩm
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTab === "2",
                              })}
                              onClick={() => {
                                toggleCustom("2");
                              }}
                            >
                              Mô tả sản phẩm
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent
                          activeTab={customActiveTab}
                          className="border border-top-0 p-4"
                          id="nav-tabContent"
                        >
                          <TabPane id="nav-speci" tabId="1">
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>
                                      Danh mục
                                    </th>
                                    <td>{productDetails.category.name}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Thương hiệu</th>
                                    <td>{productDetails.brand.name}</td>
                                  </tr>                      
                                </tbody>
                              </table>
                            </div>
                          </TabPane>
                          <TabPane id="nav-detail" tabId="2">
                            <div className="table-responsive">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: productDetails.specification,
                                }}
                              />
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>

                      <div className="mt-5">
                        <div>
                          <h5 className="fs-14 mb-3">Đánh giá: </h5>
                        </div>
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
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EcommerceProductDetail;
