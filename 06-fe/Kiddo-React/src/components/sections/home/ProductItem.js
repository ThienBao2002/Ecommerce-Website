import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge } from "reactstrap";

const ProductItem = ({ item, tog_ShowQuickView }) => {
    const [currentImageIndexes, setCurrentImageIndexes] = useState(0);
    const handleMouseEnter = (id) => {
        setCurrentImageIndexes(prevIndexes => ({
            ...prevIndexes,
            [id]: 1 // Gán index 1 cho hình ảnh khi di chuột vào sản phẩm cụ thể
        }));
    };
    const handleMouseLeave = (id) => {
        setCurrentImageIndexes(prevIndexes => ({
            ...prevIndexes,
            [id]: 0 // Trở lại hình ảnh ban đầu khi di chuột ra khỏi sản phẩm
        }));
    };
    const handleAddToCart = async (productId) => {
        navigate(`/product-details-v2/${productId}`);
    };



    const navigate = useNavigate();
    return (
        <div className="hm-product">
            <Link to={"/product-details-v2/" + item._id} className="hm-product-img-wrapper p-0">
                <div
                    style={{
                        width: '100%', // Hoặc một giá trị cố định nào đó
                        height: '450px', // Điều chỉnh theo nhu cầu
                        borderRadius: '20px', // Góc bo tròn
                        overflow: 'hidden', // Chỉ để khi scale ảnh không bị tràn ra ngoài khung
                        transition: 'transform 0.3s ease' // Thêm hiệu ứng chuyển động 0.3 giây
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'; // Scale lớn hơn khi rê vào
                        handleMouseEnter(item._id);
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'; // Trở về kích thước ban đầu khi rê ra
                        handleMouseLeave(item._id);
                    }}
                >
                    <div // Background image div
                        style={{
                            position: 'absolute', // Đặt background image ở vị trí absolute
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: item.frameStyle.length!==0 ? `url(${item.frameStyle[0].url})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '20px'
                        }}
                    />
                    <div className="hm-product-badges">
                        {item.featured && <span className="flaticon-fire hot" />}
                        {item.discount > 0 && <span className="sale">{item.discount}%</span>}
                    </div>
                    <div>
                        <img
                            src={item.images[currentImageIndexes[item._id] || 0]?.url}
                            alt={item.name}
                            className="img-cover"
                            onMouseEnter={() => handleMouseEnter(item._id)}
                            onMouseLeave={() => handleMouseLeave(item._id)}
                        />
                    </div>
                </div>
            </Link>
            <div className="hm-product-content">
                <h3 className="hm-product-name">
                    <Link to={"/product-details-v2/" + item._id}>
                        {item.name.length <= 35 ? item.name : item.name.slice(0, 30) + "..."}
                    </Link>
                </h3>
                <div className="hm-product-controls">
                    <div className="hm-product-atc">
                        {item.stock > 0 ? (
                            <Button color="warning" className="rounded-pill" onClick={() => handleAddToCart(item._id)}>
                                <i className="las la-shopping-cart"></i>
                            </Button>
                        ) : (
                            <Button color="dark" className="rounded-pill" disabled>
                                <Badge className="badge-gradient-dark">Hết hàng</Badge>
                            </Button>
                        )}
                        <Button color="info" className="rounded-pill" onClick={() => tog_ShowQuickView(item._id)}>
                            <i className="las la-info-circle"></i>
                        </Button>
                    </div>
                </div>
                <div className="hm-product-meta">

                    <div className="hm-product-price">

                        <span className="hm-discounted-price hm-text-primary">
                            {item.newPrice
                                ? new Intl.NumberFormat().format(item.newPrice)
                                : `${new Intl.NumberFormat().format(item.minPrice)}-${new Intl.NumberFormat().format(item.maxPrice)}đ`}
                        </span>

                        <span className="hm-actual-price has-discount">
                            {new Intl.NumberFormat().format(item.minPrice / (1 - item.discount / 100))}đ
                        </span>

                    </div>
                </div>
                <div className="hm-product-meta1">
                    <span className="hm-product-price">
                        <Badge className="badge-gradient-primary">Đã bán :{item.totalSold}</Badge>
                        <Badge className="badge-gradient-success">{item.category.name}</Badge>
                        <Badge className="badge-gradient-warning">{item.brand.name}</Badge>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;