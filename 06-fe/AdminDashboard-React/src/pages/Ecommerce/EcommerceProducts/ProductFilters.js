import React, { useState, useEffect } from "react";
import { Card, Button, UncontrolledCollapse, CardBody } from "reactstrap";
import Select from "react-select";
import Nouislider from "nouislider-react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
    getProducts as onGetProducts,
    getCategories as onGetCategories,
    getBrands as onGetBrands,
    getPromotions as onGetPromotion,
} from "../../../slices/thunks";
const ProductFilters = ({
    productList,
    promotionId,
    setProductList,
    setIsFiltering,
    isAddProductToPromotion
}) => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.Ecommerce.products);
    const categories = useSelector(state => state.Ecommerce.categories);
    const brands = useSelector(state => state.Ecommerce.brands);
    const promotions = useSelector(state => state.Ecommerce.promotions);
    //slider
    const [minProductPrice, setMinProductPrice] = useState(0);
    const [maxProductPrice, setMaxProductPrice] = useState(10000);
    const [sliderValues, setSliderValues] = useState([minProductPrice, maxProductPrice]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedPromotions, setSelectedPromotions] = useState([]);
    const [promotionChecks, setPromotionChecks] = useState({});

    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: "default", label: "Tất cả sản phẩm" },
        { value: "newest", label: "Sản phẩm mới ra" },
        { value: "mostViewed", label: "Sản phẩm bán chạy" },
        { value: "highPrice", label: "Giá cao" },
        { value: "lowPrice", label: "Giá thấp" },
    ];

    const initialDiscounts = {
        50: false,
        40: false,
        30: false,
        20: false,
        10: false,
        'Less than 10%': false
    };
    const [discountChecks, setDiscountChecks] = useState(initialDiscounts);
    const initialRatings = {
        5: false,
        4: false,
        3: false,
        2: false,
        1: false,
        0: false
    };
    const [ratingChecks, setRatingChecks] = useState(initialRatings);
    const [brandChecks, setBrandChecks] = useState({});

    const [cate, setCate] = useState("all");

    const handleSelectedCategory = (category) => {
        setSelectedCategory(category.name);
    }
    const handleSelectedBrand = (brand, isChecked) => {
        if (isChecked) {
            // Add the brand to the array if checked
            setSelectedBrands(prevBrands => [...prevBrands, brand]);
        } else {
            // Remove the brand from the array if unchecked
            setSelectedBrands(prevBrands =>
                prevBrands.filter(b => b !== brand)
            );
        }
        setBrandChecks(prev => ({ ...prev, [brand]: isChecked }));
    };
    const handleSelectedDiscount = (discount, isChecked) => {
        if (isChecked) {
            setSelectedDiscounts(prevDiscounts => [...prevDiscounts, discount]);
        } else {
            setSelectedDiscounts(prevDiscounts =>
                prevDiscounts.filter(d => d !== discount)
            );
        }
        setDiscountChecks(prev => ({ ...prev, [discount]: isChecked }));
    };
    const handleSelectedRating = async (rating, isChecked) => {
        if (isChecked) {
            // Thêm rating vào mảng nếu checkbox được chọn
            await setSelectedRatings(prev => [...prev, rating]);
        } else {
            // Loại bỏ rating khỏi mảng nếu checkbox không còn được chọn
            await setSelectedRatings(prev => prev.filter(r => r !== rating));
        }
        setRatingChecks(prev => ({ ...prev, [rating]: isChecked }));
    };
    const handleSelectedPromotion = async (promotionId, isChecked) => {
        if (isChecked) {
            // Thêm promotionId vào mảng nếu checkbox được chọn
            await setSelectedPromotions(prev => [...prev, promotionId]);
        } else {
            // Loại bỏ promotionId khỏi mảng nếu checkbox không còn được chọn
            await setSelectedPromotions(prev => prev.filter(p => p !== promotionId));
        }
        setPromotionChecks(prev => ({ ...prev, [promotionId]: isChecked }));
    };

    const handleCostChange = (e, index) => {
        const value = parseInt(e.target.value) || 0; // Sử dụng 0 nếu giá trị không hợp lệ
        let updatedValues = [...sliderValues];
        updatedValues[index] = value;
        setSliderValues(updatedValues);
    };

    const onPriceChange = (values) => {
        const [minCost, maxCost] = values.map(value => parseInt(value));

        // Cập nhật giá trị vào các input để người dùng thấy
        document.getElementById("minCost").value = minCost;
        document.getElementById("maxCost").value = maxCost;

        // Lọc sản phẩm dựa trên giá
        const filteredProducts = products.filter(product =>
            product.newPrice >= minCost && product.newPrice <= maxCost
        );
        setProductList(filteredProducts);
    };
    const handleResetFilters = () => {
        // Reset all filter states
        setSelectedRatings([]);
        setSelectedDiscounts([]);
        setSelectedBrands([]);
        setSelectedCategory('all');
        setSliderValues([minProductPrice, maxProductPrice]); // Reset slider values
        setCate('all');
        setPromotionChecks({});
        setSelectedPromotions([]);
        setSelectedOption(null);

        // Reset checkbox states
        const resetState = {};
        Object.keys(brandChecks).forEach(key => { resetState[key] = false; });
        setBrandChecks(resetState);

        const resetDiscountState = {};
        Object.keys(discountChecks).forEach(key => { resetDiscountState[key] = false; });
        setDiscountChecks(resetDiscountState);

        const resetRatingState = {};
        Object.keys(ratingChecks).forEach(key => { resetRatingState[key] = false; });
        setRatingChecks(resetRatingState);

        const resetPromotionState = {};
        Object.keys(promotionChecks).forEach(key => {
            resetPromotionState[key] = false;
        });
        setPromotionChecks(resetPromotionState);
    };
    function parseDateFromString(dateString) {
        // Tách chuỗi thành giờ, phút, ngày, tháng, năm
        const [timeString, datePart] = dateString.split(" ");
        const [hours, minutes] = timeString.split(":");
        const [day, month, year] = datePart.split("/");
      
        // Xử lý năm dạng rút gọn (ví dụ: 202 -> 2022)
        const fullYear = year.length === 2 ? `20${year}` : year;
      
        // Trả về đối tượng Date
        return new Date(fullYear, month - 1, day, hours, minutes);
      }

    useEffect(() => {
        // Gửi yêu cầu lấy sản phẩm, danh mục, và thương hiệu nếu chúng chưa được tải
        if (!products || products.length === 0) {
            dispatch(onGetProducts());
        }
        if (!categories || categories.length === 0) {
            dispatch(onGetCategories());
        }
        if (!brands || brands.length === 0) {
            dispatch(onGetBrands());
        }
        if (!promotions || promotions.length === 0) {
            dispatch(onGetPromotion());
        }
        if (promotionId) {
            handleSelectedPromotion(promotionId,true);
        }
        if(isAddProductToPromotion)
            handleSelectedPromotion("no_promotion",true)
        if (products && products.length > 0) {
            const prices = products.map(product => product.newPrice);
            const newMinPrice = Math.min(...prices);
            const newMaxPrice = Math.max(...prices);
            // Chỉ cập nhật nếu giá trị mới khác với giá trị hiện tại
            if (newMinPrice !== minProductPrice) {
                setMinProductPrice(newMinPrice);
            }
            if (newMaxPrice !== maxProductPrice) {
                setMaxProductPrice(newMaxPrice);
            }
        }
    }, [products, categories, brands, minProductPrice, maxProductPrice,promotions,isAddProductToPromotion]);


    useEffect(() => {
        // Stage 1: Filter based on category, brand, and promotions
        let filteredProducts = products.filter(product => {
            const categoryCheck = selectedCategory === 'all' || (product.category && product.category.name === selectedCategory);
            setCate(selectedCategory);
            const brandCheck = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand.name));
            const promotionCheck = selectedPromotions.length === 0 ||
                (selectedPromotions.includes('no_promotion') && !product.promotion) ||
                (product.promotion && selectedPromotions.includes(product.promotion._id));
            return categoryCheck && brandCheck && promotionCheck;
        });
    
        // Stage 2: Further filter based on rating, discount, and price
        filteredProducts = filteredProducts.filter(product => {
            const ratingCheck = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.averageRating));
            const discountCheck = selectedDiscounts.length === 0 || selectedDiscounts.some(discountBase => {
                const discountRangeStart = discountBase;
                const discountRangeEnd = discountBase + 10;
                return product.discount >= discountRangeStart && product.discount < discountRangeEnd;
            });
            const priceCheck = product.newPrice >= sliderValues[0] && product.newPrice <= sliderValues[1];
            return ratingCheck && discountCheck && priceCheck;
        });
    
        // Apply sorting based on the selected option
        switch (selectedOption?.value) {
            case 'newest':
                filteredProducts.sort((a, b) => parseDateFromString(b.publishedDate) - parseDateFromString(a.publishedDate));
                break;
            case 'mostViewed':
                filteredProducts.sort((a, b) => b.ordersCount - a.ordersCount);
                break;
            case 'highPrice':
                filteredProducts.sort((a, b) => b.newPrice - a.newPrice);
                break;
            case 'lowPrice':
                filteredProducts.sort((a, b) => a.newPrice - b.newPrice);
                break;
            default:
            // No additional sorting applied
                break;
        }
        // Update the productList state to trigger UI updates
        setProductList(filteredProducts);
        // eslint-disable-next-line
    }, [products, selectedRatings, selectedCategory, selectedBrands, selectedPromotions, sliderValues, selectedDiscounts, selectedOption]);  // Note addition of selectedOption in the dependency array
    

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
    }, [sliderValues[0], sliderValues[1]]);

    // useEffect(() => {
    //     console.log("Danh sách sản phẩm: ", productList);
    //     console.log("Các đánh giá đã chọn: ", selectedRatings);
    //     console.log("Các giảm giá đã chọn: ", selectedDiscounts);
    //     console.log("Danh mục đã chọn: ", selectedCategory);
    //     console.log("Thương hiệu đã chọn: ", selectedBrands);
    //     console.log("Khuyến mãi đã chọn: ", selectedPromotions);
    //     //console.log("Tất cả sản phẩm: ", products);
    // }, [productList, selectedRatings, selectedDiscounts, selectedCategory, selectedBrands, products,selectedPromotions]);


    useEffect(() => {
        const checkIsFiltering = () => {
            const isDefaultCategory = selectedCategory === 'all';
            const isDefaultBrands = selectedBrands.length === 0;
            const isDefaultRatings = selectedRatings.length === 0;
            const isDefaultDiscounts = selectedDiscounts.length === 0;
            const isDefaultSliderValues = sliderValues[0] === minProductPrice && sliderValues[1] === maxProductPrice;

            return !(isDefaultCategory && isDefaultBrands && isDefaultRatings && isDefaultDiscounts && isDefaultSliderValues);
        };
        setIsFiltering(checkIsFiltering());
        // eslint-disable-next-line
    }, [selectedCategory, selectedBrands, selectedRatings, selectedDiscounts, sliderValues, minProductPrice, maxProductPrice]);
    const customStyles = {
        multiValue: (styles, { data }) => {
            return {
                ...styles,
                backgroundColor: "#3762ea",
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            backgroundColor: "#687cfe",
            color: "white",
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: "white",
            backgroundColor: "#687cfe",
            ":hover": {
                backgroundColor: "#687cfe",
                color: "white",
            },
        }),
    };
    const handleSortByChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        // Thực hiện logic lọc sản phẩm dựa trên selectedOption.value
    };
    return (
        <Card>
            <CardBody>
                <div className="d-flex mb-3">
                    <div className="flex-grow-1">
                        <h5 className="fs-16">Bộ lọc: {productList.length}</h5>
                    </div>
                    <div className="flex-shrink-0">

                        <Button
                            to="#"
                            className="text-decoration-underline"
                            onClick={handleResetFilters}
                        >
                            Xóa tất cả
                        </Button>
                    </div>
                </div>

                <div className="filter-choices-input">
                    <Select
                        value={selectedOption}
                        isMulti={false} // Chỉ cho phép chọn một tùy chọn
                        onChange={handleSortByChange}
                        options={options}
                        styles={customStyles}
                    />
                </div>
            </CardBody>

            <div className="accordion accordion-flush">
                <div className="card-body border-bottom">
                    <div>
                        <p className="text-muted text-uppercase fs-12 fw-medium mb-2">
                            Danh mục
                        </p>

                        <ul className="list-unstyled mb-0 filter-list">
                            {categories.map((category) => {
                                const isActive = cate === category.name ? "active" : "";
                                return (
                                    <li key={category._id}>
                                        <Link
                                            to="#"
                                            className={`d-flex py-1 align-items-center ${isActive}`}
                                            onClick={() =>
                                                handleSelectedCategory(category)
                                            }
                                        >
                                            <div className="flex-grow-1">
                                                <h5 className="fs-13 mb-0 listname">
                                                    {category.name}
                                                </h5>
                                            </div>
                                            <div className="flex-shrink-0 ms-2">
                                                <span className="badge bg-light text-muted">
                                                    {category.products.length}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="card-body border-bottom">
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-4">
                        Giá
                    </p>
                    {/** */}
                    <>
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
                                onChange={(e) => handleCostChange(e, 0)}
                            />
                            <span className="fw-semibold text-muted">to</span>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                id="maxCost"
                                value={sliderValues[1]}
                                onChange={(e) => handleCostChange(e, 1)}
                            />
                        </div>
                    </>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button
                            className="accordion-button bg-transparent shadow-none"
                            type="button"
                            id="flush-headingBrands"
                        >
                            <span className="text-muted text-uppercase fs-12 fw-medium">
                                Thương hiệu
                            </span>{" "}
                            <span className="badge bg-success rounded-pill align-middle ms-1">
                                {brands.length}
                            </span>
                        </button>
                    </h2>
                    <UncontrolledCollapse toggler="#flush-headingBrands" defaultOpen>
                        <div
                            id="flush-collapseBrands"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingBrands"
                        >
                            <div className="accordion-body text-body pt-0">
                                <div className="d-flex flex-column gap-2 mt-3">
                                    {/**Form check brand */}
                                    {brands.map((brand, index) => (
                                        <div className="form-check" key={brand._id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`productBrandRadio${brand.id}`}
                                                checked={brandChecks[brand.name] || false}
                                                onChange={(e) => handleSelectedBrand(brand.name, e.target.checked)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`productBrandRadio${brand.id}`}
                                            >
                                                {brand.name}
                                                <span className="badge bg-light text-muted">
                                                    {brand.products.length}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                        >
                                            Xem thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UncontrolledCollapse>

                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button
                            className="accordion-button bg-transparent shadow-none collapsed"
                            type="button"
                            id="flush-headingDiscount"
                        >
                            <span className="text-muted text-uppercase fs-12 fw-medium">
                                Giảm giá
                            </span>{" "}
                            <span className="badge bg-success rounded-pill align-middle ms-1">
                                1
                            </span>
                        </button>
                    </h2>
                    <UncontrolledCollapse toggler="#flush-headingDiscount">
                        <div
                            id="flush-collapseDiscount"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body text-body pt-1">
                                <div className="d-flex flex-column gap-2">
                                    {/**Form check discount */}
                                    {['Hơn 50%', 40, 30, 20, 10, 'Dưới 10%'].map((discount, index) => (
                                        <div className="form-check" key={`discount-${index}`}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`productdiscountRadio${index}`}
                                                checked={discountChecks[discount] || false}
                                                onChange={(e) => handleSelectedDiscount(discount, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={`productdiscountRadio${index}`}>
                                                {typeof discount === 'number' ? `${discount}% or more` : discount}
                                            </label>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </UncontrolledCollapse>

                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button
                            className="accordion-button bg-transparent shadow-none collapsed"
                            type="button"
                            id="flush-headingRating"
                        >
                            <span className="text-muted text-uppercase fs-12 fw-medium">
                                Đánh giá
                            </span>{" "}
                        </button>
                    </h2>

                    <UncontrolledCollapse toggler="#flush-headingRating">
                        <div
                            id="flush-collapseRating"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingRating"
                        >
                            <div className="accordion-body text-body">
                                <div className="d-flex flex-column gap-2">
                                    {/**Form check rating */}
                                    {[5, 4, 3, 2, 1, 0].map((rating) => (
                                        <div className="form-check" key={rating}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`productratingRadio${rating}`}
                                                checked={ratingChecks[rating] || false}
                                                onChange={(e) => handleSelectedRating(rating, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={`productratingRadio${rating}`}>
                                                <span className="text-muted">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <i key={i} className={`mdi mdi-star ${i < rating ? 'text-warning' : ''}`}></i>
                                                    ))}
                                                </span>{" "}
                                                {rating}
                                            </label>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </UncontrolledCollapse>

                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button
                            className="accordion-button bg-transparent shadow-none collapsed"
                            type="button"
                            id="flush-headingPromotion"
                        >
                            <span className="text-muted text-uppercase fs-12 fw-medium">
                                Chương trình khuyến mãi
                            </span>{" "}
                        </button>
                    </h2>

                    <UncontrolledCollapse toggler="#flush-headingPromotion" defaultOpen>
                        <div
                            id="flush-collapsePromotion"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingPromotion"
                        >
                            <div className="accordion-body text-body">
                                <div className="d-flex flex-column gap-2">
                                    {/**Form check rating */}

                                    {[{ _id: 'no_promotion', name: 'Không có chương trình khuyến mãi', products: [] }, ...promotions].map((promotion) => (
                                        <div className="form-check" key={promotion._id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`promotionCheck${promotion._id}`}
                                                checked={promotionChecks[promotion._id] || false}
                                                onChange={(e) => handleSelectedPromotion(promotion._id, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={`promotionCheck${promotion._id}`}>
                                                {promotion.name}
                                            </label>
                                            <span className="badge bg-success rounded-pill align-middle ms-1">
                                                {promotion.products.length}
                                            </span>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </UncontrolledCollapse>

                </div>
            </div>
        </Card>
    );
};

export default ProductFilters;