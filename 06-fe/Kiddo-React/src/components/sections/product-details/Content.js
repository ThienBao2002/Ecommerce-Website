import React, { Fragment,useState, useEffect,useRef  } from "react";
import { Link } from "react-router-dom";
import { handleOutofStock } from "../../../helper/shopHelper";
import { Rating } from "../../../helper/helper";
import offers from "../../../data/offers.json";
import { Tab, Nav } from "react-bootstrap";
import Slider from "react-slick";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Countdown from "react-countdown";
import {
  getProducts as onGetProducts,
  // getCategories as onGetCategories,
  // getBrands as onGetBrands,
} from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div className="hm-product-countdown" id="countdown-duration">
        <p>
          <span id="days">{days}</span> days{" "}
        </p>
        <p>
          <span id="hours">{hours}</span> hours{" "}
        </p>
        <p>
          <span id="minutes">{minutes}</span> mins{" "}
        </p>
        <p>
          <span id="seconds">{seconds}</span> secs{" "}
        </p>
      </div>
    );
  }
};

function PrevArrow(props) {
  const { onClick } = props;
  return <i className="fas fa-chevron-left slick-arrow" onClick={onClick} />;
}
function NextArrow(props) {
  const { onClick } = props;
  return <i className="fas fa-chevron-right slick-arrow" onClick={onClick} />;
}

const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
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

function Content(props) {
  const [qty, setQty] = useState(1);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  const increment = () => {
    setQty(qty + 1);
  };

  const decrement = () => {
    setQty(qty > 1 ? qty - 1 : 1);
  };

  const handleChange = (event) => {
    setQty(event.target.value);
  };
  const dispatch = useDispatch();

  const selectDashboardData = createSelector(
    (state) => state.Ecommerce.products,
    (products) => products
  );
  const products = useSelector(selectDashboardData);

  useEffect(() => {
    setNav1(slider1Ref.current);
    setNav2(slider2Ref.current);
    console.log(products);
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
  }, [dispatch,products]);
  const detailId = props.detailId;
  const item = products.find((product) => product._id === detailId);

  return (
    <Fragment>
      <div className="row hm-product-details">
        <div className="col-xl-5 col-md-6">
            {console.log(nav1,nav2)}
          <Slider
            asNavFor={slider2Ref.current}
            ref={slider1Ref}
            {...settings}
            className="hm-product-img-wrapper hm-focused-product"
          >
            {/* Data */}
            {item.images.map((image, i) => (
              <img key={i} src={image.url} alt={item.name} />
            ))}
            {/* Data */}
          </Slider>
          <Slider
            asNavFor={slider1Ref.current} // Thay đổi thành slider1Ref
            ref={slider2Ref}
            {...settingsThumb}
            focusOnSelect={true}
            className="hm-product-img-slider hm-product-slider"
          >
            {/* Data */}
            {item.images.map((image, i) => (
              <img key={i} src={image.url} alt={item.name} />
            ))}
            {/* Data */}
          </Slider>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="hm-product-content">
            <h3 className="hm-product-title">{item.name}</h3>
            <div className="hm-product-topbar">
              {item.stock === true ? (
                <span className="stock in-stock">In Stock</span>
              ) : (
                <span className="stock in-stock text-danger">In Stock</span>
              )}
              <span className="sku">
                SKU: <b>{item.sku}</b>{" "}
              </span>
              <div className="hm-product-rating-container">
                <ul className="hm-product-rating">{Rating(item.rating)}</ul>
                <span>{} Reviews</span>
              </div>
            </div>
            <p className="hm-product-description">
              {item.description.slice(0, 130)}
            </p>
            <div className="hm-product-variants">
              <div className="hm-variant-container">
                <span>Color: </span>
                <div className="hm-product-colors hm-variant-selection">
                  {/* Data */}
                  {item.colors.map((color, i) => (
                    <OverlayTrigger
                      key={i}
                      placement="top"
                      overlay={<Tooltip> {color.title} </Tooltip>}
                    >
                      <label>
                        <input
                          type="radio"
                          name="color"
                          defaultValue={color.color}
                        />
                        <span className={"color-" + color.color} />
                      </label>
                    </OverlayTrigger>
                  ))}
                  {/* Data */}
                </div>
              </div>
              <div className="hm-variant-container">
                <span>Size: </span>
                <div className="hm-product-size hm-variant-selection">
                  {/* {item.size.map((size, i) => (
                    <label
                      className="btn btn-outline-secondary hm-icon-btn"
                      key={i}
                    >
                      <input type="radio" name="size" defaultValue={size} />
                      <span>{size}</span>
                    </label>
                  ))} */}
                </div>
              </div>
              <div className="quantity hm-variant-container">
                <span>Qty: </span>
                <div className="hm-variant-selection">
                  <input
                    type="button"
                    defaultValue="-"
                    className="minus btn btn-outline-secondary hm-qty-btn"
                    onClick={decrement}
                  />
                  <input
                    type="text"
                    id="quantity1"
                    className="input-text qty text"
                    name="quantity"
                    value={qty}
                    onChange={handleChange}
                    readOnly
                  />
                  <input
                    type="button"
                    defaultValue="+"
                    className="plus btn btn-outline-secondary hm-qty-btn"
                    onClick={increment}
                  />
                </div>
              </div>
            </div>
            <div className="hm-product-price">
              <span className="hm-discounted-price hm-text-primary">          
                {new Intl.NumberFormat().format(
                  ((item.newPrice * (100 - item.discount)) / 100)
                )}
                đ
              </span>
              {item.discount > 0 || item.discount !== "" ? (
                <span className="hm-actual-price has-discount">
                  {new Intl.NumberFormat().format(item.newPrice)} đ
                </span>
              ) : (
                ""
              )}
            </div>
            {/* Add To Cart */}
            {item.stock === true ? (
              <button
                type="button"
                className="btn hm-add-to-cart btn-lg btn btn-primary my-3"
              >
                <i className="flaticon-shopping-cart" /> Add to cart
              </button>
            ) : (
              <button
                type="button"
                className="btn hm-add-to-cart btn-lg btn btn-primary my-3"
                onClick={handleOutofStock}
                disabled
              >
                <i className="flaticon-shopping-cart" /> Add to cart
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
            <Countdown date={Date.now() + 31622400000} renderer={renderer} />
          </div>
        </div>
        <div className="col-xl-3">
          <ul className="hm-product-perks">
            {/* Data */}
            {offers.map((offer, i) => (
              <li key={i}>
                <h6>{offer.title}</h6>
                {offer.text > 0 || offer.text !== "" ? <p>{offer.text}</p> : ""}
                {offer.image > 0 || offer.image !== "" ? (
                  <div className="hm-next-product">
                    <img
                      src={process.env.PUBLIC_URL + "/" + offer.image}
                      alt={offer.caption}
                    />
                    <div className="hm-next-product-desc">
                      <Link to="/shop" className="btn btn-secondary">
                        {offer.caption}
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </li>
            ))}
            {/* Data */}
          </ul>
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
                {/* Đánh giá ({item.reviews.length}) */}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="tab1">
              <div dangerouslySetInnerHTML={{ __html: item.htmltext }} />
            </Tab.Pane>
            <Tab.Pane eventKey="tab2">
              <table className="table table-striped">
                <tbody>
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
              <ul className="hm-reviews">
                {/* {item.reviews.map((review, i) => (
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
                ))} */}
              </ul>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Fragment>
  );
}

export default Content;
