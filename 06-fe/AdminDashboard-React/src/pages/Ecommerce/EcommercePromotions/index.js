import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown,
    Button
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import {ToastContainer } from "react-toastify";
import "nouislider/distribute/nouislider.css";
import { useSelector, useDispatch } from "react-redux";
import {
    getPromotions as onGetPromotions,
    deletePromotion as onDeletePromotion,
    getProducts as onGetProducts

  } from "../../../slices/thunks";
import DeleteModal from "../../../Components/Common/DeleteModal";
const EcommercePromotions = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const dispatch = useDispatch();
    const promotions = useSelector(state => state.Ecommerce.promotions);
    const [promotion, setPromotion] = useState(null);
    useEffect(() => {
        // Kiểm tra số lần useEffect đã chạy
        if (!promotions || promotions.length === 0) {
            dispatch(onGetPromotions());
        }
    }, [promotions]); // Dependency là promotions

    document.title = "Khuyến mãi | Kiddo - Trang quản trị ";
    const onClickDelete = async (promotion) => {
        setPromotion(promotion);
        setDeleteModal(true);
    };
    const handleDeletePromotion = async () => {
        try {
            if (promotions.length > 1) {
                const actionResult = await dispatch(onDeletePromotion(promotion));
                if (onDeletePromotion.fulfilled.match(actionResult)) {
                    dispatch(onGetProducts());
                    console.log('Promotion deleted successfully:', actionResult.payload);
                    setDeleteModal(false);
                } else {
                    console.error('Failed to delete the promotion:', actionResult.error);
                    setDeleteModal(false);
                }
            }
        } catch (error) {
            console.error('Unexpected error when deleting promotion:', error);
            setDeleteModal(false);
        }
    };




    const favouriteBtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };


    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeletePromotion}
                onCloseClick={() => setDeleteModal(false)}
            />
            <ToastContainer closeButton={false} limit={1} />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Khuyến mãi" pageTitle="Thương mại điện tử" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">
                                            Quản lý khuyến mãi
                                        </h5>
                                        <div>
                                            {/* <Link
                                                className="btn btn-primary"
                                                id="filter-collapse"
                                                data-bs-toggle="collapse"
                                                to="#collapseExample"
                                            >
                                                <i className="ri-filter-2-line align-bottom"></i>
                                                Filters
                                            </Link> */}
                                            <Link
                                                className="btn btn-primary"
                                                id="add-promotion"

                                                to="/apps-ecommerce-add-promotion"
                                            >
                                                <i className="ri-filter-2-line align-bottom"></i>
                                                Thêm khuyến mãi
                                            </Link>
                                        </div>
                                    </div>                             
                                </CardHeader>
                            </Card>
                        </Col>
                        <Col lg={12}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="flex-grow-1">
                                    <p className="text-muted fs-14 mb-0">Kết quả: {promotions?.length}</p>
                                </div>
                                {/* <div className="flex-shrink-0">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="a"
                                            className="text-muted fs-14"
                                            role="button"
                                        >
                                            All View <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem to="#">Action</DropdownItem>
                                            <DropdownItem to="#">Another action</DropdownItem>
                                            <DropdownItem to="#">Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                    <Row
                        // className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
                        // id="explorecard-list"
                    >

                        {promotions.map((item, key) => (
                            

                        <Col lg={6} className="list-element" key={key}>
                            <Card className="explore-box card-animate">
                                <div className="explore-place-bid-img">
                                    <input type="hidden" className="form-control" id="1" />
                                    <div className="d-none">undefined</div>
                                    <img
                                        src={item?.banner[0]?.url}
                                        alt=""
                                        className="card-img-top explore-img"
                                    />
                                    <div className="bg-overlay"></div>
                                    <div className="place-bid-btn">

                                        <Link to={`/apps-ecommerce-add-promotion/${item._id}`} className="btn btn-success">
                                            <i className="ri-auction-fill align-bottom me-1"></i> Xem chi tiết                                 
                                        </Link>                                
                                    </div>
                                </div>
                                <div className="bookmark-icon position-absolute top-0 end-0 p-2">

                                    <button
                                        type="button"
                                        className={item.isStart ? "btn btn-icon active" : "btn btn-icon"}
                                        data-bs-toggle="button"
                                        aria-pressed="true"
                                        onClick={(e) => favouriteBtn(e.target)}
                                    >
                                        <i className="mdi mdi-cards-heart fs-16"></i>
                                    </button>
                                </div>
                                    <CardBody>

                                        <p className="fw-medium mb-0 float-end">
                                            <div>
                                                Ngày bắt đầu: {item.startDate}
                                            </div>
                                            <div>
                                                Ngày kết thúc: {item.endDate}
                                            </div>
                                        </p>
                                    <h5 className="mb-1">
                                    <Link to={`/apps-ecommerce-add-promotion/${item._id}`}>{item.name}</Link>
                                    </h5>
                                    <p className="text-muted mb-0">Giảm giá {item.discount}%</p>
                                    <p className="text-muted mb-0">Số lượng: {item.products.length} sản phẩm</p>
                                    </CardBody>
                                    <div className="card-footer border-top border-top-dashed">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 fs-14">
                                            </div>
                                            <Button
                                                onClick={() =>onClickDelete(item)}>
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                        </Col>))}
                    </Row>
                    <div
                        className="py-4 text-center"
                        id="noresult"
                        style={{ display: "none" }}
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                        <h5 className="mt-4">Sorry! No Result Found</h5>
                    </div>
                    {/* <div className="text-center mb-3">
                        <button className="btn btn-link text-secondary mt-2" id="loadmore">
                            <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                            Load More
                        </button>
                    </div> */}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EcommercePromotions;
