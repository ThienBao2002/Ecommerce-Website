import React from "react";
import { Link } from 'react-router-dom';
const ProductRow = (props) => {
  return (
    <React.Fragment>
      <tr>
        <td>
          <div className="d-flex">
            <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
              <img
                src={props.item.images && props.item.images.length > 0 ? props.item.images[0].url : ''}
                alt=""
                className="img-fluid d-block"
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="fs-15">
                <Link
                  to={"/product-details-v2/" + props.item._id}
                  className="text-reset"
                  title={props.item.name}
                >
                  {props.item.name && props.item.name.substring(0, 44) + "..."}
                </Link>

              </h5>
            </div>
          </div>
        </td>

        <td>{props.item.category && props.item.category.name}</td>
        <td>{props.item.brand && props.item.brand.name}</td>

      </tr>
    </React.Fragment>
  );
};

export default ProductRow;
