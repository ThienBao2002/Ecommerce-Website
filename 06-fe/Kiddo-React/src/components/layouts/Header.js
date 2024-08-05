import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
// import NavHelper from "../../helper/NavHelper";
// import Offermodal from "./Offermodal";
// import Offerstrip from "./Offerstrip";
import Mobilemenu from "./Mobilemenu";
import MyCartDropdown from "./MyCartDropdown";
import ProfileDropdown from "./ProfileDropdown";
import SearchDropdown from "./SearchDropdown";
import navigation from "../../data/navigation.json";
import { Link } from "react-router-dom";
import {
  getCustomerById as onGetCustomerById,
  getCategories as onGetCategories,
  getBrands as onGetBrands,
} from "../../slices/thunks";


const Header = () => {
  // eslint-disable-next-line
  const [navMethod, setNavMethod] = useState(false);
  // eslint-disable-next-line
  const [searchMethod, setSearchMethod] = useState(false);

  const toggleNav = () => {
    setNavMethod((prevNavMethod) => !prevNavMethod);
    let element = document.getElementById("body");
    element.classList.add("hm-drawer-open");
  };


  const [stickyHeader, setStickyHeader] = useState(false);

  const handleScroll = async () => {
    const windowSize = window.scrollY;
    await setStickyHeader(windowSize > 100);
  };

  useEffect(() => {
    // Thêm các event listener khi component được mount
    window.addEventListener("load", handleScroll);
    window.addEventListener("scroll", handleScroll);
    // Loại bỏ event listener khi component bị unmount
    return () => {
      window.removeEventListener("load", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //** ======================== CheckSession========================
  const isSessionActive = useSelector((state) => state.Session.isSessionActive);
  const token = useSelector((state) => state.Session.decodedToken);

  //** ======================== Get customer by id ========================
  const dispatch = useDispatch();
  const categories = useSelector(state => state.Ecommerce.categories);
  const brands = useSelector(state => state.Ecommerce.brands);
  const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
    customers: ecom.customers,
    isCustomerSuccess: ecom.isCustomerSuccess,
    error: ecom.error,
  }));
  // Inside your component
  // eslint-disable-next-line
  const { customers: customer } = useSelector(
    ecomCustomerProperties
  );
  useEffect(() => {
    if (customer && !customer.length && token !== null) {
      dispatch(onGetCustomerById(token.userId));
    }
    if (!categories || categories.length === 0) {
      dispatch(onGetCategories());
    }
    if (!brands || brands.length === 0) {
      dispatch(onGetBrands());
    }
    // eslint-disable-next-line
  }, [dispatch, token,categories,brands]);

  const category = {
    "id": 4,
    "linkText": "Danh mục",
    "child": true,
    "submenu": [
      {
        "id": 4.1,
        "linkText": "Bé trai",
        "child": true,
        "submenu": []
      },
      {
        "id": 4.2,
        "linkText": "Bé gái",
        "child": true,
        "submenu": []
      },
      {
        "id": 4.3,
        "linkText": "Phụ kiện",
        "child": true,
        "submenu": []
      }
    ]
  };
  
  // Phân loại các danh mục vào các nhóm tương ứng
  categories.forEach(categoryItem => {
    if (categoryItem.name.toLowerCase().includes("trai")) {
      category.submenu[0].submenu.push({
        "id": categoryItem._id,
        "link": `/${categoryItem.name_slug}`,
        "linkText": categoryItem.name
      });
    } else if (categoryItem.name.toLowerCase().includes("gái")) {
      category.submenu[1].submenu.push({
        "id": categoryItem._id,
        "link": `/${categoryItem.name_slug}`,
        "linkText": categoryItem.name
      });
    } else {
      category.submenu[2].submenu.push({
        "id": categoryItem._id,
        "link": `/${categoryItem.name_slug}`,
        "linkText": categoryItem.name
      });
    }
  });
  const brandsCategory = {
    "id": 5,
    "linkText": "Thương hiệu",
    "child": true,
    "submenu": [
      // Assuming similar subcategories as needed
      {
        "id": 5.1,
        "linkText": "",
        "child": true,
        "submenu": []
      },
      // ... add more brand categories as needed
    ]
  };
  
  // Phân loại các thương hiệu vào danh mục "Thương hiệu"
  // This example assumes each brandItem will fit into one of the submenus like above.
  brands.forEach(brandItem => {
    // Adjust logic as per your categorization needs
    // Here we're just adding all brands to the first subcategory for simplicity
    brandsCategory.submenu[0].submenu.push({
      "id": brandItem._id,
      "link": `/${brandItem.name_slug}`,
      "linkText": brandItem.name
    });
  });
  
  






  return (
    <Fragment>
      {/* <Offermodal />
                <Offerstrip /> */}
      {/* Header */}
      <header
        className={`hm-header hm-header-absolute can-sticky ${stickyHeader ? " sticky" : ""
          }`}
      >
        <div className="container">
          <nav className="hm-navbar">
            <Link to="/" className="hm-navbar-brand">
              {" "}
              <img
                src={process.env.PUBLIC_URL + "/assets/img/logo.png"}
                alt="logo"
              />{" "}
            </Link>
            <button
              className="hm-nav-toggler"
              type="button"
              onClick={toggleNav}
            >
              <span />
              <span />
              <span />
            </button>
            {/* Desktop Menu */}
            <div className="d-none d-lg-block">
              <ul className="hm-nav">
                {/* /Mega Menu Home */}
                {navigation.slice(0, 2).map((item, i) => (
                  <li
                    key={i}
                    className={
                      item.child === true
                        ? "hm-nav-item hm-nav-item-has-children"
                        : "hm-nav-item"
                    }
                  >
                    {item.child === true ? (
                      <Link to="#" className="nav-link">
                        {item.linkText}
                      </Link>
                    ) : (
                      <Link to={item.link} className="nav-link">
                        {item.linkText}
                      </Link>
                    )}
                    {item.child === true ? (
                      <ul className="sub-menu">
                        {item.submenu.map((item, i) => (
                          <li
                            key={i}
                            className={
                              item.child === true
                                ? "hm-nav-item hm-nav-item-has-children"
                                : "hm-nav-item"
                            }
                          >
                            {item.child === true ? (
                              <Link to="#" className="nav-link">
                                {item.linkText}
                              </Link>
                            ) : (
                              <Link to={item.link} className="nav-link">
                                {item.linkText}
                              </Link>
                            )}
                            {item.child === true ? (
                              <ul className="sub-menu">
                                {item.submenu.map((item, i) => (
                                  <li className="hm-nav-item" key={i}>
                                    <Link to={item.link} className="nav-link">
                                      {item.linkText}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              ""
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
                {/**Category */}
                <li className="hm-nav-item hm-nav-item-has-children has-mega-menu hm-mega-menu--3-col">
                  <Link to="#" className="nav-link">{category.linkText}</Link>
                  <ul className="sub-menu">
                    <li className="hm-mega-menu-wrapper clearfix">
                      {category.submenu.map((item, i) => (
                        <ul className="hm-mega-menu" key={i}>
                          <li className="hm-nav-item hm-mega-menu-title"> {item.linkText} </li>
                          {item.submenu.map((subItem, j) => (
                            <li className="hm-nav-item" key={j}>
                              <Link to={`/shop-grid-left-category${subItem.link}`} className="nav-link">{subItem.linkText}</Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </li>
                  </ul>
                </li>
                {/** Brands */}
                <li className="hm-nav-item hm-nav-item-has-children">
                  <Link to="#" className="nav-link">{brandsCategory.linkText}</Link>
                  <ul className="sub-menu">
                    <li className="hm-mega-menu-wrapper clearfix">
                      {brandsCategory.submenu.map((item, i) => (
                        <ul className="hm-mega-menu" key={i}>
                          <li className="hm-nav-item hm-mega-menu-title">{item.linkText}</li>
                          {item.submenu.map((subItem, j) => (
                            <li className="hm-nav-item" key={j}>
                              <Link to={`/shop-grid-left-brand${subItem.link}`} className="nav-link">{subItem.linkText}</Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </li>
                  </ul>
                </li>

              </ul>
            </div>
            {/* /Desktop Menu */}
            {/* Mobile Menu */}
            <aside className="hm-drawer">
              <Mobilemenu />
            </aside>
            {/* /Mobile Menu */}
            <ul className="hm-nav-controls">
              <li>
                <div className="">
                  <SearchDropdown></SearchDropdown>
                </div>
              </li>
              {isSessionActive ? (
                <>
                  <li className="hm-trigger-cart hm-nav-item-has-children">
                    <MyCartDropdown />
                  </li>
                  <li className="hm-trigger-favorite hm-nav-item-has-children">
                    <ProfileDropdown />
                  </li>
                </>
              ) : (
                <li>
                  <a href="/kiddo/login">Đăng nhập</a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
