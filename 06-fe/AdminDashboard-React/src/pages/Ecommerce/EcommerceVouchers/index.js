import React, { useState, useEffect, useMemo } from "react";
import { Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getVouchers as onGetVouchers, deleteVoucher as onDeleteVoucher } from "../../../slices/thunks";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../../Components/Common/DeleteModal";
import imgBronze from "../../../assets/images/rank/bronze.png";
import imgSilver from "../../../assets/images/rank/silver.png";
import imgGold from "../../../assets/images/rank/gold.png";
import imgDiamond from "../../../assets/images/rank/diamond.png";
import imgVIP from "../../../assets/images/rank/VIP.png";
import imgVVIP from "../../../assets/images/rank/VVIP.png";

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

const getVoucherTypeImage = (type) => {
    switch (type) {
        case 'Bronze':
            return imgBronze;
        case 'Silver':
            return imgSilver;
        case 'Gold':
            return imgGold;
        case 'Diamond':
            return imgDiamond;
        case 'VIP':
            return imgVIP;
        case 'VVIP':
            return imgVVIP;
        default:
            return null;
    }
};

const EcommerceVouchers = () => {
    document.title = "Vouchers | Kiddo - Trang quản trị ";
    const dispatch = useDispatch();
    const { vouchers, error } = useSelector(state => state.Ecommerce);

    const [deleteModal, setDeleteModal] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVoucherType, setSelectedVoucherType] = useState("allUsers");
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 20;

    useEffect(() => {
        dispatch(onGetVouchers());
    }, [dispatch]);

    const handleDelete = (voucherId) => {
        setVoucherToDelete(voucherId);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (voucherToDelete) {
            dispatch(onDeleteVoucher({ _id: voucherToDelete }))
                .then(() => {
                    dispatch(onGetVouchers());
                    setDeleteModal(false);
                    setVoucherToDelete(null);
                    toast.success("Voucher đã xóa thành công!");
                })
                .catch(() => {
                    toast.error("Xóa voucher thất bại!");
                });
        }
    };

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleVoucherTypeChange = (event) => {
        setSelectedVoucherType(event.target.value);
        setCurrentPage(1);
    };

    const filteredVouchers = useMemo(() => {
        let vouchersToFilter = selectedVoucherType === "allUsers" ? vouchers : vouchers.filter(voucher => voucher.voucherType === selectedVoucherType);
        if (!searchTerm) return vouchersToFilter;
        return vouchersToFilter.filter(voucher => deepSearch(voucher, searchTerm));
    }, [vouchers, selectedVoucherType, searchTerm]);

    const indexOfLastVoucher = currentPage * pageSize;
    const indexOfFirstVoucher = indexOfLastVoucher - pageSize;
    const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    return (
        <React.Fragment>
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Vouchers" pageTitle="Thương mại điện tử" />
                    <Row className="g-4 mb-3">
                        <Col className="col-sm-auto">
                            <div>
                                <Link to="/apps-ecommerce-add-voucher" className="btn btn-secondary">
                                    <i className="ri-add-line align-bottom me-1"></i> Thêm Mới
                                </Link>
                            </div>
                        </Col>
                        <Col className="col-sm">
                            <div className="d-flex justify-content-sm-end gap-2">
                                <div className="search-box ms-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                                <select className="form-control" value={selectedVoucherType} onChange={handleVoucherTypeChange}>
                                    <option value="allUsers">All</option>
                                    <option value="Bronze">Bronze</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Diamond">Diamond</option>
                                    <option value="VIP">VIP</option>
                                    <option value="VVIP">VVIP</option>
                                </select>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        {currentVouchers.map((item, key) => (
                            <Col key={key} xl={3} lg={4} md={6}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <img src={item.imageVoucher[0]?.url} alt="" className="avatar-sm object-fit-cover rounded" />
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <Link to={`/apps-ecommerce-add-voucher/${item._id}`}>
                                                    <h5 className="mb-1">{item.code}</h5>
                                                </Link>
                                                <p className="text-muted mb-0">
                                                    {`${item.code} ${item.description} cho ${item.voucherType === "allUsers" ? "tất cả khách" : "khách hàng hạng " + item.voucherType}`}
                                                </p>


                                            </div>
                                            {getVoucherTypeImage(item.voucherType) && (
                                                <div className="flex-shrink-0 ms-3">
                                                    <img src={getVoucherTypeImage(item.voucherType)} alt={item.voucherType} className="avatar-sm object-fit-cover rounded" />
                                                </div>
                                            )}
                                            <div>
                                                <UncontrolledDropdown className="float-end">
                                                    <DropdownToggle tag="button" className="btn btn-ghost-primary btn-icon">
                                                        <i className="ri-more-fill align-middle fs-16"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end" end>
                                                        <DropdownItem tag={Link} to={`/apps-ecommerce-add-voucher/${item._id}`}>Chỉnh sửa</DropdownItem>
                                                        <DropdownItem onClick={() => handleDelete(item._id)}>Xóa</DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                        <Col sm={6}>
                            <div>
                                <p className="mb-sm-0 text-muted">Hiển thị <span className="fw-semibold">{indexOfFirstVoucher + 1}</span> đến <span className="fw-semibold">{Math.min(indexOfLastVoucher, filteredVouchers.length)}</span> trong tổng số <span className="fw-semibold text-decoration-underline">{filteredVouchers.length}</span> voucher</p>
                            </div>
                        </Col>

                        <Col sm={6}>
                            <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <Link to="#" className="page-link" onClick={() => changePage(currentPage - 1)}>Trước</Link>
                                </li>
                                {[...Array(Math.ceil(filteredVouchers.length / pageSize))].map((e, i) => (
                                    <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                        <Link to="#" className="page-link" onClick={() => changePage(i + 1)}>{i + 1}</Link>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === Math.ceil(filteredVouchers.length / pageSize) ? 'disabled' : ''}`}>
                                    <Link to="#" className="page-link" onClick={() => changePage(currentPage + 1)}>Tiếp</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={confirmDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default EcommerceVouchers;
