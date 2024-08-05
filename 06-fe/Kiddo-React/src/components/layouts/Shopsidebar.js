import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { Link } from 'react-router-dom';
import Nouislider from "nouislider-react";
import {
  getCategories as onGetCategories,
  getBrands as onGetBrands,
} from "../../slices/thunks";

function Shopsidebar(props) {
    // const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line
    const [minProductPrice, setMinProductPrice] = useState(0);
    const [maxProductPrice, setMaxProductPrice] = useState(1);
    // const history = useNavigate();

    const dispatch = useDispatch();
    const selectLayoutState = (state) => state.Ecommerce;
    const ecomCategoriesProperties = createSelector(selectLayoutState, (ecom) => ({
      categories: ecom.categories,
      brands:ecom.brands,
      error: ecom.error,
    }));
    // Inside your component
    const { categories,brands} = useSelector(
      ecomCategoriesProperties
    );
    useEffect(() => {
      if (!categories || categories.length === 0) {
        dispatch(onGetCategories());
      }
      if (!brands || brands.length === 0) {
        dispatch(onGetBrands());
      }
      if (props.productList && props.productList.length > 1) {
        const newMinPrice = Math.min(
          ...props.productList.map((product) => product.newPrice)
        );
        const newMaxPrice = Math.max(
          ...props.productList.map((product) => product.newPrice)
        );
        if (newMinPrice < newMaxPrice) {
          setMinProductPrice(newMinPrice);
          setMaxProductPrice(newMaxPrice);
        }
      }
    }, [dispatch, categories,brands,props.productList]);
    const getProductsByCategory = (category) => {
      let filteredProducts = props.productList;
      if (category !== "all") {
        filteredProducts = props.productList.filter(
          (product) => product.category.name === category
        );
      }
      props.setProductListFilter(filteredProducts);
    };
    const getProductsByBrand = (brand) => {
      let filteredProducts = props.productList;
      if (brand !== "all") {
        filteredProducts = props.productList.filter(
          (product) => product.brand.name === brand
        );
      }
      props.setProductListFilter(filteredProducts);
    };
    


  
    // Search Filter
    // const handleSubmit = (e) => {
    //   e.preventDefault();
    //   if (searchText === "") {
    //     return;
    //   } else {
    //     history.push("/shop/search/" + searchText);
    //   }
    // }
  
    const onPriceChange = (value) => {
      // Lấy giá trị min và max từ value
      value = value.map((value) => parseInt(value));
      const minCost = value[0];
      const maxCost = value[1];
  
      // Gán giá trị min và max cho các phần tử DOM
      document.getElementById("minCost").value = minCost;
      document.getElementById("maxCost").value = maxCost;
  
      // Sử dụng giá trị min và max để lọc danh sách sản phẩm
      const filteredProducts = props.productList.filter(
        (product) => product.newPrice >= minCost && product.newPrice <= maxCost
      );
  
      // Cập nhật danh sách sản phẩm
      props.setProductListFilter(filteredProducts);
    };
    const [sliderValues, setSliderValues] = useState([minProductPrice, maxProductPrice]);
    useEffect(() => {
      const slider = document.getElementById("product-price-range");
      if (slider) {
        slider.noUiSlider.on("update", (values, handle) => {
          // Chuyển đổi các giá trị trong values thành số nguyên
          const intValues = values.map((value) => parseInt(value));
          setSliderValues(intValues);
        });
      }
      // eslint-disable-next-line
    }, [sliderValues[0],sliderValues[1]]);
    useEffect(() => {
      onPriceChange([minProductPrice, maxProductPrice]);
      // eslint-disable-next-line
    }, [minProductPrice,maxProductPrice]);
    const handleMinCostChange = (e) => {
      const newValue = parseInt(e.target.value); // Chuyển đổi giá trị thành số nguyên
      setSliderValues([newValue, sliderValues[1]]);
      onPriceChange([newValue, sliderValues[1]]);
    };
    
    const handleMaxCostChange = (e) => {
      const newValue = parseInt(e.target.value); // Chuyển đổi giá trị thành số nguyên
      setSliderValues([sliderValues[0], newValue]);
      onPriceChange([sliderValues[0], newValue]);
    };

  
    return (
      <React.Fragment>
        {/* <div className="hm-widget hm-widget-search">
          <div className="hm-widget-title">
            <h3>Tìm kiếm</h3>
          </div>
          <div className="hm-sidebar-content">
            <form onSubmit={handleSubmit} method="Get">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Tìm kiếm bất kì thứ gì"
                  name="searchText"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  required
                />
                <button type="submit">
                  {" "}
                  <i className="fas fa-search" />{" "}
                </button>
              </div>
            </form>
          </div>
        </div> */}
        <div className="hm-widget hm-widget-categories">
          <div className="hm-widget-title">
            <h3>Tất cả danh mục</h3>
          </div>
          <div className="hm-sidebar-content">
            <ul className="hm-sidebar-list">
              {/* Data */}
              <li>
                <Link to="#" onClick={() => getProductsByCategory("all")}>
                  {"Tất cả"} <span>({props.productList.length})</span>
                </Link>
              </li>
              {categories.map((category, i) => (
                <li key={i}>
                  <Link
                    to="#"
                    onClick={() => getProductsByCategory(category.name)}
                  >
                    {category.name} <span>({category.products.length})</span>
                  </Link>
                </li>
              ))}
              {/* Data */}
            </ul>
          </div>
        </div>
        <div className="hm-widget hm-widget-filter">
          <div className="hm-widget-title">
            <h3>Bộ lọc</h3>
          </div>
          <div className="hm-sidebar-content">
            <label htmlFor="price_range" className="hm-bold-8">
              Giá
            </label>
            <div className="ms-range-slider mb-3">
              <Nouislider
                range={{
                  min: minProductPrice,
                  max: maxProductPrice,
                }}
                start={[minProductPrice, maxProductPrice]}
                connect
                step={500}
                data-slider-color="primary"
                id="product-price-range"
                onSlide={(values, handle) => {
                  // Gọi hàm onUpdate khi giá trị trên thanh trượt thay đổi
                  onPriceChange(values);
                }}
              />
              <div className="formCost d-flex gap-2 align-items-center mt-3">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  id="minCost"
                  value={sliderValues[0]}
                  onChange={(e) => handleMinCostChange(e)}
                />
                <span className="fw-semibold text-muted">to</span>
                <input
                  className="form-control form-control-sm"
                  type="text"
                  id="maxCost"
                  value={sliderValues[1]}
                  onChange={(e) => handleMaxCostChange(e)}
                />
              </div>
            </div>
            {/* <ul>
              <li className=" form-group">
                <label className="hm-bold-8">Kích thước</label>
                <div className="hm-product-size hm-variant-selection">
                </div>
              </li>
              <li className="form-group">
                <label className="hm-bold-8">Màu sắc</label>
                <div className="hm-product-colors">
                </div>
              </li>
            </ul> */}
          </div>
        </div>
        <div className="hm-widget hm-widget-tags">
          <div className="hm-widget-title">
            <h3>Thương hiệu</h3>
          </div>
          <div className="hm-sidebar-content">
            <ul className="list-inline mb-0">
              {/* Data */}
              {brands.map((item, i) => (
                <li className="list-inline-item" key={i}>
                  <Link to="#">
                    <span
                      className="badge hm-tag"
                      onClick={() => getProductsByBrand(item.name)} // Gọi hàm khi người dùng nhấp vào
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
              {/* Data */}
            </ul>
          </div>
        </div>
        {/* <div className="hm-widget hm-widget-posts">
          <div className="hm-widget-title">
            <h3>Sản phẩm nổi bật</h3>
          </div>
          <div className="hm-sidebar-content">
            <ul>
              {props.productList
                .sort((a, b) => b.ordersCount - a.ordersCount)
                .slice(0, 3)
                .map((item, i) => (
                  <li key={i}>
                    <Link
                      to={"/product-details-v2/" + item._id}
                      className="hm-product-img-wrapper"
                    >
                      <img src={item.images[0].url} alt={item.name} />
                    </Link>
                    <div className="hm-widget-post-container">
                      <p>
                        <Link to={"/product-details-v2/" + item._id}>
                          {item.name.slice(0, 20)}
                        </Link>
                      </p>
                      <p className="hm-widget-post-author">
                        {getTags(item.tags)
                          .slice(0, 3)
                          .map((tag, i) => (
                            <span key={i}>{tag.title}, </span>
                          ))}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div> */}
      </React.Fragment>
    );
  }

export default Shopsidebar;