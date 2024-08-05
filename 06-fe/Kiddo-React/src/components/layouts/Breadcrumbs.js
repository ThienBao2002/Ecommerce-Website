import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../sections/home/Banner';

const Breadcrumbs = ({ breadcrumb, banner }) => {
    // Cung cấp một URL mặc định cho hình ảnh
    const defaultImageUrl = '';
    // Kiểm tra xem banner có phần tử hợp lệ không
    const imageUrl = banner && banner.length > 0 && banner[0].url ? banner[0].url : defaultImageUrl;
    return (
        <div style={{ marginTop: '0px' }}>
            {!imageUrl && (
            <Banner />
            )}
            <div className="hm-sub-header" style={{ marginTop: '0px' }}>
                <div className="container">
                    {imageUrl && (
                        <img
                            style={{width:"1600px", height:"600px"}}
                            src={imageUrl}
                            alt="Breadcrumb Banner"
                        />
                    )}
                    <div className="hm-sub-header-nav" style={{marginBottom:"-100px"}}>
                        <h1>{breadcrumb.pagename}</h1>
                        <Link to="/">Trang chủ <span className="hm-text-primary"><i className="fas fa-arrow-circle-right" /></span></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumbs;
