import React from "react";
import { handleOutofStock } from "../../helper/shopHelper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {useNavigate } from "react-router-dom";
import {
  getProductById as onGetProductById,
} from "../../slices/thunks";

const Quickview =(props)=> {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productId = props.productId;
  const productDetails = useSelector((state) => state.Ecommerce.productDetails);
  useEffect(() => {
    if (productDetails && !productDetails.length) {
      dispatch(onGetProductById(productId));
    }
    // eslint-disable-next-line
  }, [productId, dispatch]);

  //** ======================== CheckSession========================
  const handleAddToCart =  (productId) => {
    navigate(`/product-details-v2/${productId}`);
   
  };
  if (productDetails.length===0) {
    return <div>Không có sản phẩm nào để hiển thị.</div>; // Hoặc bất kỳ thông báo nào bạn muốn
  }

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="hm-quicklook-img-wrapper">
          <img src={productDetails.images[0].url} alt={productDetails.name} />
        </div>
      </div>
      <div className="col-md-7">
        <div className="hm-product-content">
          <h3 className="hm-product-title">{productDetails.name}</h3>
          <div className="hm-product-topbar">
            {productDetails.stock !== 0 ? (
              <span className="stock in-stock">Còn hàng</span>
            ) : (
              <span className="stock in-stock text-danger">Hết hàng</span>
            )}
          </div>
          <p className="hm-product-description">
            <span
              style={{ fontSize: "20px" }}
              dangerouslySetInnerHTML={{
                __html: productDetails.description.slice(0, 300),
              }}
            />
          </p>
          <div className="hm-product-variants">
          </div>
          <div className="hm-product-price">
            <span className="hm-discounted-price hm-text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(productDetails.newPrice)}
            </span>{" "}
            {productDetails.discount > 0 || productDetails.discount !== "" ? (
              <span className="hm-actual-price has-discount">
                {new Intl.NumberFormat("vi-VN").format(productDetails.newPrice)}
              </span>
            ) : (
              ""
            )}
          </div>
          {productDetails.stock !== 0 ? (
            <button
              type="button"
              className="btn hm-add-to-cart btn-lg btn btn-primary my-3"
              onClick={() => handleAddToCart(productDetails._id)}
            >
              <i className="flaticon-shopping-cart" /> Thêm vào giỏ hàng
            </button>
          ) : (
            <button
              type="button"
              className="btn hm-add-to-cart btn-lg btn btn-primary my-3"
              onClick={handleOutofStock}
              disabled
            >
              <i className="flaticon-shopping-cart" /> Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quickview;
