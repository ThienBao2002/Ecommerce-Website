import React from 'react';
import NavHelper from "../../helper/NavHelper";

class Offerstrip extends NavHelper {
    render() {
        return (
            <div className={this.state.offerStrip === true ? 'hm-promo-offer-strip' : 'hm-promo-offer-strip hm-visible-promo'}>
                <p className="mb-0">Chúng tôi gửi hàng đi toàn cầu, với giá trị hóa đơn từ 150.000 đ. Vui lòng liên hệ 
                <b className="hm-promo-code"> +123 456 789 </b>
                    để biết thêm thông tin chi tiết</p>
                <button type="button" className="close hm-close-container hm-close-code" onClick={this.offerStripBtn}>
                    <span />
                    <span />
                </button>
            </div>
        );
    }
}

export default Offerstrip;