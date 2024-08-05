import React, { useState } from "react";
import { Link } from "react-router-dom";
import shopblock from "../../../data/shop/shop.json";
import {
  getFilteredproducts,
  handleOutofStock,
} from "../../../helper/shopHelper";
import Pagination from "react-js-pagination";
import Quickview from "../../layouts/Quickview";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

function Content(props) {
  // eslint-disable-next-line
  const [data, setData] = useState(getProducts());
  const [activePage, setActivePage] = useState(1);
  const [itemPerpage] = useState(8);
  const [modalshow, setModalshow] = useState(false);
  const [lastActiveBox, setLastActiveBox] = useState(-1);

  function getProducts() {
    const cat = props.catId ? props.catId : "";
    const tag = props.tagId ? props.tagId : "";
    const minPrice = props.minPrice ? props.minPrice : "";
    const maxPrice = props.maxPrice ? props.maxPrice : "";
    const searchQuery = props.query ? props.query : "";
    const filteredItems = getFilteredproducts(shopblock, {
      cat,
      tag,
      priceFilter: [minPrice, maxPrice],
      searchQuery,
    });
    return filteredItems;
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
  }

  // Modal
  function modalShow(index) {
    setModalshow(true);
    setLastActiveBox(index);
  }

  function modalClose() {
    setModalshow(false);
  }
  const paginationData = data
    .slice((activePage - 1) * itemPerpage, activePage * itemPerpage)
    .map((item, i) => {
      return (
        <div key={i} className="col-lg-3 col-md-4 col-sm-6">
          <div className="hm-product">
            <Link
              to={"/product-details/" + item.id}
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
                src={process.env.PUBLIC_URL + "/" + item.image[0]}
                alt={item.title}
              />
            </Link>
            <div className="hm-product-content">
              <h3 className="hm-product-name">
                <Link to={"/product-details/" + item.id}>{item.title}</Link>
              </h3>
              <div className="hm-product-controls">
                <div className="hm-product-atc">
                  {/* Cart */}
                  {item.stock === true ? (
                    <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                      <i className="fas fa-shopping-cart hm-to-right" />
                    </span>
                  ) : (
                    <span
                      className="btn hm-favorite hm-product-icon hm-hoverable-icon"
                      onClick={handleOutofStock}
                    >
                      <i className="fas fa-shopping-cart hm-to-right" />
                    </span>
                  )}
                  {/* Wishlist */}
                  <span className="btn hm-favorite hm-product-icon hm-hoverable-icon">
                    <i className="fas fa-heart hm-to-right" />
                  </span>
                  <span
                    className="btn hm-favorite hm-product-icon hm-hoverable-icon has-quicklook"
                    onClick={(e) => modalShow(item.id)}
                  >
                    <i className="fas fa-eye hm-to-right" />
                  </span>
                </div>
              </div>
              <div className="hm-product-meta">
                <div className="hm-product-price">
                  <span className="hm-discounted-price hm-text-primary">
                    $
                    {new Intl.NumberFormat().format(
                      ((item.newPrice * (100 - item.discount)) / 100).toFixed(2)
                    )}
                  </span>
                  {item.discount > 0 || item.discount !== "" ? (
                    <span className="hm-actual-price has-discount">
                      ${new Intl.NumberFormat().format(item.newPrice.toFixed(2))}
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
      );
    });
  return (
    <div className="container">
      <div className="hm-section">
        <div className="hm-product-banner-bg">
          <div className="hm-product-banner-inner">
            <div className="hm-product-banner-price hm-round-border">
              <span>$99</span>
            </div>
            <p className="hm-product-banner-text">Kids Toy</p>
            <Link to="/shop" className="btn btn-shadow btn-border">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="hm-shop-filter py-3">
          <div className="hm-filter">
            <ul className="list-inline">
              <li className="list-inline-item hm-filter-border">
                <Link to="/shop" className="filter active">
                  <i className="fa fa-th-large" />
                </Link>
              </li>
              <li className="list-inline-item hm-filter-border">
                <Link to="/shop-list" className="filter">
                  <i className="fa fa-list" />
                </Link>
              </li>
            </ul>
            <form className="form-inline">
              <div className="form-group">
                <label htmlFor="sortby">Sort by:</label>
                <select className="form-control" id="sortby">
                  <option>Most Recent</option>
                  <option>Most Viewed</option>
                  <option>High Price</option>
                  <option>Low Price</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="showby">Show:</label>
                <select className="form-control" id="showby">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </form>
          </div>
          <div className="hm-pagination">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={itemPerpage}
              totalItemsCount={data.length}
              pageRangeDisplayed={data.length}
              onChange={handlePageChange.bind(this)}
              innerClass="pagination"
              activeClass="active"
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
        <div className="hm-products">
          <div className="row">
            {/* Product */}
            {paginationData}
            {/* Product */}
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
                <Quickview productId={lastActiveBox} />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
