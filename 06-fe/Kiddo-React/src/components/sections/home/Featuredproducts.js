import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {  CardBody, Modal,ModalBody,ModalHeader } from 'reactstrap';
import { ResponsiveExample } from '../home/UiImagesCode';
import Quickview from "../../layouts/Quickview";
import ProductItem from "./ProductItem";

const Featuredproducts = ({ imageFeaturedProduct, featuredProductList, title, idPromotion }) => {

  const [productId, setProductId] = useState(null);
  const [modal_showQuickView, setmodal_ShowQuickView] = useState(false);
  function tog_ShowQuickView(index) {
    setProductId(index);
    setmodal_ShowQuickView(!modal_showQuickView);
  }
  const navigate = useNavigate();
  const handleMoreProducts = (idPromotion) => {
    navigate("/shop-grid-left-promotion/" + idPromotion);  // Changed to include the ID in the URL path
  };

  return (
    <div className="hm-product-banner">
      <div className="container">
        <CardBody>
          <div className="live-preview">
            <div style={{ textAlign: "center", maxWidth: "auto" }}>
              <Link to={"/shop-grid-left-promotion/" + idPromotion}>
                <img src={imageFeaturedProduct} className="img-fluid" alt="Responsive" style={{ width: '100%', maxWidth: '100%', height: 'auto' }} />
              </Link>
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
            {featuredProductList.slice(0, 8).map((item) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={item._id}>
                <ProductItem
                  item={item}
                  tog_ShowQuickView={tog_ShowQuickView}>
                </ProductItem>
              </div>
            ))}
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
            onClick={() => handleMoreProducts(idPromotion)}
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featuredproducts;
