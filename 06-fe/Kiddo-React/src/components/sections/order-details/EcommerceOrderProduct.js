import React from "react";
import { Link } from 'react-router-dom';
const EcommerceOrderProduct = (props) => {
  return (
    <React.Fragment>
      <tr>
        <td>
          <div className="d-flex">
            <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
              <img             
                src={
                  props.item.variant1 && props.item.variant1._id
                    ? (props.item.product.data.imagesVariant.find(img => img.name === props.item.variant1._id.imageName)?.url || props.item.product.data.images[0]?.url)
                    : props.item.product.data.images[0]?.url
                }

                alt=""
                className="img-fluid d-block"
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="fs-15">
                <Link
                  to={"/product-details-v2/" + props.item.product.data._id}
                  className="text-reset"
                  title={props.item.product.data.name}
                >
                  {props.item.product.data.name}
                </Link>
              </h5>

              {props.item.product.data.variantName1 ? (
                <p className="text-muted mb-0">
                  {props.item.variant1._id ? props.item.product.data.variantName1 + ": " : ""}
                  <span className="fw-medium">{props.item.variant1 ? props.item.variant1.name : ""}</span>
                </p>
              ) : ""}

              {props.item.product.data.variantName2 ? (
                <p className="text-muted mb-0">
                  {props.item.variant2._id ? props.item.product.data.variantName2 + ": " : ""}
                  <span className="fw-medium">{props.item.variant2 ? props.item.variant2.name : ""}</span>
                </p>
              ) : ""}
            </div>
          </div>
        </td>
        <td>
          {parseFloat(props.item.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </td>

        <td>{props.item.quantity}</td>
        <td className="fw-medium text-end">
          {(props.item.price * props.item.quantity).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default EcommerceOrderProduct;
