import React, {  useState } from "react";
import { Link } from "react-router-dom";
//import {handleOutofStock } from "../../../helper/shopHelper";
import Quickview from "../../layouts/Quickview";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CardBody } from 'reactstrap';
import { ResponsiveExample } from '../home/UiImagesCode';


//Import actions
import {
  addNewCart as onAddNewCart,
  startSession,
  getCustomerById as onGetCustomerById,
} from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

const Featuredproducts = ({ imageFeaturedProduct, featuredProductList,title }) => {
  const [modalshow, setModalShow] = useState(false);
  const [modalBackdrop, setModalBackdrop] = useState(false);
  const [lastActiveBox, setLastActiveBox] = useState(-1);
  const [modal_backdrop, setmodal_backdrop] = useState(false);

  // Modal
  const modalShow = (index) => {
    setModalShow(true);
    setLastActiveBox(index);
  };

  const modalClose = () => {
    setModalShow(false);
  };
  function toggleBackdrop() {
    // Mở modal
    setModalBackdrop(true);

    // Đặt hẹn giờ để tắt modal sau 1 giây
    setTimeout(() => {
      setModalBackdrop(false);
    }, 1500);
  }

  //GetProductFromAPi
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function tog_backdrop() {
    // Mở modal
    setmodal_backdrop(true);
    //Đặt hẹn giờ để tắt modal sau 1 giây
    setTimeout(() => {
      setmodal_backdrop(false);
    }, 1500);
  }
  
    const [currentImageIndexes, setCurrentImageIndexes] = useState(0);
  
    const handleMouseEnter = (id) => {
      setCurrentImageIndexes(prevIndexes => ({
        ...prevIndexes,
        [id]: 1 // Gán index 1 cho hình ảnh khi di chuột vào sản phẩm cụ thể
      }));
    };
    
    const handleMouseLeave = (id) => {
      setCurrentImageIndexes(prevIndexes => ({
        ...prevIndexes,
        [id]: 0 // Trở lại hình ảnh ban đầu khi di chuột ra khỏi sản phẩm
      }));
    };
  //** ======================== CheckSession========================
  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken);
  const handleAddToCart = async (productId) => {
    await dispatch(startSession());
    if (isSessionActive) {
      const productToAdd = {
        userId: token.userId,
        productId: productId,
        quantity: 1,
      };
      await dispatch(onAddNewCart(productToAdd));
      await dispatch(onGetCustomerById(token.userId));
      tog_backdrop();
    } else {
      navigate("/login");
    }
    // Tạo một action Redux để thêm sản phẩm vào giỏ hàng (cần xác định action này trong ứng dụng của bạn)
  };
  
  
  return (
    <div className="hm-product-banner">
      <div className="container">
        <CardBody>
          <div className="live-preview">
            <div>
              <img src={imageFeaturedProduct} className="img-fluid" alt="Responsive" />
            </div>
          </div>
          <div className="d-none code-view">
            <pre className="language-markup">
              <code>
                <ResponsiveExample />
              </code>
            </pre>
          </div>
        </CardBody>
        <div className="hm-section-title2">
          <h2 >{title}</h2>
          <p></p>
        </div>
        <div className="hm-products">
          <div className="row">
            {/* Product */}
            {featuredProductList.slice(0, 4).map((item, i) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={item._id}>
                <div className="hm-product">
                  <Link
                    to={"/product-details-v2/" + item._id}
                    className="hm-product-img-wrapper p-0"
                  >
                    <div className="hm-product-badges">
                      {item.featured === true ? (
                        <span className="flaticon-fire hot" />
                      ) : (
                        ""
                      )}
                      {item.discount > 0 || item.discount !== "" ? (
                        <span className="sale">{item.discount}%</span>
                      ) : (
                        ""
                      )}
                    </div>
                    <img
                      src={item.images[currentImageIndexes[item._id] || 0].url}
                      alt={item.name}
                      onMouseEnter={() => handleMouseEnter(item._id)}
                      onMouseLeave={() => handleMouseLeave(item._id)}
                    />
                  </Link>
                  <div className="hm-product-content">
                     <h4 className="hm-product-name"  > 
                      <Link to={"/product-details/" + item._id}>
                        {item.name.length > 20
                          ? item.name.slice(0, 30) + "..."
                          : item.name}
                      </Link>
                    </h4>
                    <div className="hm-product-controls">
                      <div className="hm-product-atc">
                        {item.stock === true ? (
                          <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                            <i className="fas fa-shopping-cart hm-to-right" />
                            <i className="your-additional-icon-class">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-shopping-cart"
                              >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg>
                            </i>
                          </span>
                        ) : (
                          <span
                            className="btn hm-favorite hm-product-icon hm-hoverable-icon"
                            onClick={() => handleAddToCart(item._id)}
                          >
                            <i className="fas fa-shopping-cart hm-to-right" />
                            <i className="your-additional-icon-class">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-shopping-cart"
                              >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg>
                            </i>
                          </span>
                        )}
                        <span
                          className="btn hm-favorite hm-product-icon hm-hoverable-icon"
                          onClick={() => modalShow(item._id)}
                        >
                          <i className="fas fa-shopping-cart hm-to-right" />
                          <i className="your-additional-icon-class">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-info"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          </i>
                        </span>
                      </div>
                    </div>
                    <div className="hm-product-meta">
                      <div className="hm-product-price">
                        <span className="hm-discounted-price hm-text-primary">
                          {new Intl.NumberFormat().format(item.newPrice)}đ
                        </span>
                        {item.discount > 0 || item.discount !== "" ? (
                          <span className="hm-actual-price has-discount">
                            {new Intl.NumberFormat().format(item.price)}đ
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="hm-product-colors">
                        {/* Data */}
                        {item.colors.map((color, i) => (
                          <OverlayTrigger
                            key={i}
                            placement="top"
                            overlay={<Tooltip> {color.title} </Tooltip>}
                          >
                            <span className={"color-" + color.color} key={i} />
                          </OverlayTrigger>
                        ))}
                        {/* Data */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Product */}
            {/* Modal (Quick View) */}
            <Modal
              show={modalshow}
              className="hm-quicklook"
              onHide={modalClose}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body className="hm-quicklook-body p-0">
                <button
                  type="button"
                  className="close hm-close-quicklook"
                  onClick={modalClose}
                >
                  <span />
                  <span />
                </button>
                <Quickview
                  productId={lastActiveBox}
                  toggleBackdrop={toggleBackdrop}
                  test="test"
                />
              </Modal.Body>
            </Modal>
            <Modal
              show={modal_backdrop}
              className="hm-quicklook"
              onHide={modalClose}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body className="text-center p-5">
                <lord-icon
                  src="https://cdn.lordicon.com/lupuorrc.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#08a88a"
                  style={{ width: "120px", height: "120px" }}
                ></lord-icon>

                <div className="mt-4">
                  <h4 className="mb-3">Sản phẩm đã được thêm vào giỏ hàng!</h4>
                  <div className="hstack gap-2 justify-content-center">
                    <Link
                      to="/cart" // Đường dẫn đến trang giỏ hàng
                      className="btn btn-success"
                      onClick={() => {
                        setmodal_backdrop(false);
                        navigate("/cart");
                      }}
                    >
                      Đến giỏ hàng
                    </Link>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              isOpen={modalBackdrop}
              toggle={() => {
                toggleBackdrop();
              }}
              backdrop={"static"}
              id="staticBackdrop"
              centered
            >
              <Modal.Body className="text-center p-5">
                <lord-icon
                  src="https://cdn.lordicon.com/lupuorrc.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#08a88a"
                  style={{ width: "120px", height: "120px" }}
                ></lord-icon>

                <div className="mt-4">
                  <h4 className="mb-3">Sản phẩm đã được thêm vào giỏ hàng!</h4>
                  <div className="hstack gap-2 justify-content-center">
                    <Link
                      to="/cart" // Đường dẫn đến trang giỏ hàng
                      className="btn btn-success"
                      onClick={() => {
                        setModalBackdrop(false);
                        navigate("/cart");
                      }}
                    >
                      Đến giỏ hàng
                    </Link>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            style={{
              marginBottom: "3rem",
              backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "150px",
              height: "50px",
              borderRadius: "5px",
              border: "1px solid",
            }}
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featuredproducts;
