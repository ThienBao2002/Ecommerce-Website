import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Col, Dropdown, DropdownMenu, DropdownToggle, Input, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from 'lodash.debounce';
//SimpleBar
import SimpleBar from "simplebar-react";
const SearchDropdown = () => {
    const products = useSelector(state => state.Ecommerce.products);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchDropdown, setIsSearchDropdown] = useState(false);
    const toggleSearchDropdown = () => {
        setIsSearchDropdown(!isSearchDropdown);
        setSearchItemCount(searchData.length);
    };
    const ShowSearchDropdown = () => {
        setIsSearchDropdown(true);
        setSearchItemCount(searchData.length);
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    const deepSearch = (object, searchTerm) => {
        if (object === null || !searchTerm) return false;

        const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

        if (typeof object === 'string' || typeof object === 'number') {
            const normalizedValue = removeAccents(object.toString().toLowerCase());
            return normalizedValue.includes(normalizedSearchTerm);
        }

        if (Array.isArray(object) || typeof object === 'object') {
            return Object.values(object).some(value => deepSearch(value, searchTerm));
        }

        return false;
    };
    const filteredProducts = useMemo(() => {
        return products.filter(product => deepSearch(product, searchTerm));
        // eslint-disable-next-line 
      }, [searchTerm]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearchList = useCallback(debounce((nextValue) => {
        ShowSearchDropdown();
        setSearchTerm(nextValue);
    }, 300), []); // 300 ms delay


    const handleInputChange = (e) => {
        debouncedSearchList(e.target.value);
    };
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState([]);
    const [searchItemCount, setSearchItemCount] = useState(0);
    useEffect(() => {
        if (filteredProducts) {
            setSearchData(filteredProducts);
            setSearchItemCount(filteredProducts.length);
        }
    }, [filteredProducts,isSearchDropdown]);

    const handleItemClick = (item) => {
        navigate(`/product-details-v2/${item._id}`);
    };

    return (
        <React.Fragment>
            <Dropdown
                isOpen={isSearchDropdown}
                toggle={toggleSearchDropdown}
                className="topbar-head-dropdown ms-1 header-item"
            >
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"></DropdownToggle>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="ri-search-line search-icon"></i>
                    </span>
                    <Input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm"
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                    />
                </div>
                
                <DropdownMenu
                    className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart"
                    aria-labelledby="page-header-cart-dropdown"
                >
                    <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fs-16 fw-semibold"> Tìm kiếm</h6>
                            </Col>
                            <div className="col-auto">
                                <span className="badge bg-warning-subtle text-warning fs-13">
                                    <span className="cartitem-badge"> {searchItemCount} </span> sản phẩm
                                </span>
                            </div>
                        </Row>
                    </div>

                    <SimpleBar style={{ maxHeight: "400px" }}>
                        {isSearchDropdown && (
                            <div className="p-2">
                                {filteredProducts.map((item) => (
                                    <div
                                        className="d-block dropdown-item text-wrap dropdown-item-cart px-3 py-2"
                                        key={item._id}
                                        style={{ marginBottom: '60px' }}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <div className="d-flex">
                                            <img
                                                src={item?.images[0]?.url}
                                                alt=""
                                                className="me-3 rounded-circle avatar-sm p-2 bg-light"
                                            />
                                            <div className="flex-grow-1">
                                                <h5 className="mt-0 mb-1 fs-14">
                                                    <span className="text-reset">{item.name}</span>
                                                </h5>
                                                <span className="cart-item-price">
                                                    {isNaN(item.minPrice) ? "Giá không hợp lệ" : Number(item.minPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                    {" - "}
                                                    {isNaN(item.maxPrice) ? "Giá không hợp lệ" : Number(item.maxPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SimpleBar>
                </DropdownMenu>
            </Dropdown>

        </React.Fragment>
    );
};

export default SearchDropdown;
