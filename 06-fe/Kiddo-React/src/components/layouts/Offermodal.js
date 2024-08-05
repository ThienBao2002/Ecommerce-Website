import React, { useState } from 'react';
import NavHelper from "../../helper/NavHelper";
import { Link } from "react-router-dom";

const Offermodal = () => {
    const [offerModal, setOfferModal] = useState(false);
    const [offerComponent, setOfferComponent] = useState(false);

    const offerModalBtn = () => {
        setOfferModal(!offerModal);
    };

    const offerComponentHandler = () => {
        const windowSize = window.scrollY;
        setOfferComponent(windowSize > 100);
    };

    window.addEventListener("scroll", offerComponentHandler);

    return (
        <div className={"hm-promo-offer-window" + (offerComponent ? ' hm-visible-promo' : '')}>
            <div className={offerModal === true ? 'hm-promo-offer-inner d-none' : 'hm-promo-offer-inner'}>
                <button type="button" className="close hm-close-container hm-close-offer" onClick={offerModalBtn}>
                    <span />
                    <span />
                </button>
                <div className="hm-promo-offer-wrapper">
                    <div className="hm-promo-description mb-4">
                        <h3 className="hm-promo-title">Siêu Sale ngập tràn</h3>
                        <p className="hm-promo-subtitle">Giảm giá lên đến 80% (áp dụng cho một số sản phẩm)</p>
                    </div>
                    <Link to="/shop-grid-left" className="btn btn-secondary">Đến mục sản phẩm</Link>
                </div>
            </div>
        </div>
    );
};

export default Offermodal;
