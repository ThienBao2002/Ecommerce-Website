import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation } from "swiper/modules";
import { Card, CardBody, Button, Badge } from 'reactstrap';
import { createSelector } from "reselect";
import imgBronze from "../../../assets/img/rank/bronze.png";
import imgSilver from "../../../assets/img/rank/silver.png";
import imgGold from "../../../assets/img/rank/gold.png";
import imgDiamond from "../../../assets/img/rank/diamond.png";
import imgVIP from "../../../assets/img/rank/VIP.png";
import imgVVIP from "../../../assets/img/rank/VVIP.png";
import {
  addToCartVoucher as onAddToCartVoucher,
  getCustomerById as onGetCustomerById
} from "../../../slices/thunks";

// Mapping object for voucher types
const voucherTypeMapping = {
  'Bronze': { name: 'Đồng', img: imgBronze },
  'Silver': { name: 'Bạc', img: imgSilver },
  'Gold': { name: 'Vàng', img: imgGold },
  'Diamond': { name: 'Kim cương', img: imgDiamond },
  'VIP': { name: 'VIP', img: imgVIP },
  'VVIP': { name: 'VVIP', img: imgVVIP },
  'allUsers': { name: 'tất cả khách', img: null }
};

// Hàm để nhóm các voucher thành các nhóm nhỏ hơn
const groupVouchers = (vouchersFilter, itemsPerGroup) => {
  const groups = [];
  for (let i = 0; i < vouchersFilter.length; i += itemsPerGroup) {
    groups.push(vouchersFilter.slice(i, i + itemsPerGroup));
  }
  return groups;
};

const VoucherSwiper = ({ nameTitleVoucher, vouchersFilter, isHomePage, isProfilePage, isCheckoutPage, handleVoucherApply }) => {
  const swiperRef = useRef(null);
  const groupedVouchers = groupVouchers(vouchersFilter, 8); // 4 items per row, 2 rows per slide
  const dispatch = useDispatch();

  const token = useSelector((state) => state.Session.decodedToken);

  // Selector để lấy thông tin khách hàng
  const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
    customers: ecom.customers,
    isCustomerSuccess: ecom.isCustomerSuccess,
    error: ecom.error,
  }));

  // Lấy thông tin khách hàng từ state
  const { customers: customer } = useSelector(ecomCustomerProperties);

  useEffect(() => {
    if(token===null)
      return;
    if (customer || !customer.length || token !== null) {
      dispatch(onGetCustomerById(token.userId));
    }
    console.log("customer",customer);
    // eslint-disable-next-line
  }, [dispatch, token]);

  // Hàm xử lý khi nhấn nút "Lưu"
  const handleSave = async (voucherCode) => {
    console.log(voucherCode);
    try {
      const actionResult = await dispatch(onAddToCartVoucher({
        voucherCode: voucherCode,
        userId: token.userId
      }));

      if (onAddToCartVoucher.fulfilled.match(actionResult)) {
        console.log("Voucher đã được thêm thành công:", actionResult.payload);
        // Có thể cập nhật UI, hiển thị thông báo thành công, chuyển hướng người dùng, v.v...
        await dispatch(onGetCustomerById(token.userId));
      } else {
        console.error("Không thể thêm voucher:", actionResult.error.message);
        // Hiển thị thông báo lỗi hoặc ghi log lỗi tại đây
      }
    } catch (error) {
      console.error("Lỗi không xác định khi thêm voucher:", error);
      // Hiển thị thông báo lỗi hoặc thực hiện các xử lý lỗi khác
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="container">
        <Card>
          <h4 className="card-title mb-0">{nameTitleVoucher}</h4>
          <CardBody>
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation={{
                nextEl: `.swiper-button-next-${nameTitleVoucher.replace(/\s+/g, '-')}`,
                prevEl: `.swiper-button-prev-${nameTitleVoucher.replace(/\s+/g, '-')}`,
                clickable: true,
              }}
              pagination={{
                el: `.swiper-pagination-${nameTitleVoucher.replace(/\s+/g, '-')}`,
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 1,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 50,
                },
              }}
              loop={false}
              modules={[Pagination, Navigation]}
              className={`mySwiper swiper responsive-swiper rounded gallery-light pb-4 swiper-${nameTitleVoucher.replace(/\s+/g, '-')}`}
              onSwiper={(swiper) => {
                console.log("Swiper instance:", swiper);
                swiperRef.current = swiper;
              }}
            >
              {groupedVouchers.map((group,groupedVouchers) => (
                <SwiperSlide key={groupedVouchers}>
                  <div className="row">
                    {group.map((voucher,indexVoucher) => (
                      <div className="col-md-6 col-lg-3 mb-4" key={voucher.id}>
                        <Card className="h-100">
                          <CardBody className="d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                              {voucher.imageVoucher[0]?.url && (
                                <img src={voucher.imageVoucher[0].url} alt="Voucher" className="img-fluid mr-2" style={{ width: "50px", height: "50px" }} />
                              )}

                              <div className="flex-grow-1 mx-2">
                                <div className="d-flex align-items-center justify-content-between">
                                  <h5 className="fs-14 text-truncate">{voucher.code}</h5>
                                  {indexVoucher === 0 && isCheckoutPage && (
                                    <Badge className="badge-gradient-success">Tốt nhất</Badge>
                                  )}
                                </div>
                                <p className="card-text text-muted">
                                  {`${voucher.description} cho ${voucher.voucherType === "allUsers" ? "tất cả khách" : "khách hàng hạng " + voucherTypeMapping[voucher.voucherType].name}`}
                                </p>
                              </div>

                              {voucherTypeMapping[voucher.voucherType].img && (
                                <img src={voucherTypeMapping[voucher.voucherType].img} alt={voucher.voucherType} className="img-fluid" style={{ width: "30px", height: "30px" }} />
                              )}
                            </div>

                            <div className="mt-3">
                              {isHomePage ? (
                                <Button color="primary" onClick={() => handleSave(voucher.code)}>
                                  Lưu
                                </Button>
                              ) : isCheckoutPage && (
                                <Button color="primary" onClick={() => handleVoucherApply(voucher.code)}>
                                  Áp dụng voucher
                                </Button>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={`swiper-pagination swiper-pagination-${nameTitleVoucher.replace(/\s+/g, '-')}`}></div>
            <div className={`swiper-button-next swiper-button-next-${nameTitleVoucher.replace(/\s+/g, '-')}`}></div>
            <div className={`swiper-button-prev swiper-button-prev-${nameTitleVoucher.replace(/\s+/g, '-')}`}></div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VoucherSwiper;
