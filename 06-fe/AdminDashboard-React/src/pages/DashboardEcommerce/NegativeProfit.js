import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const NegativeProfit = ({ negativeProfitData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [maxPages, setMaxPages] = useState(0);

    useEffect(() => {
        if (negativeProfitData) {
            const orderCount = negativeProfitData.length;
            const calculatedMaxPages = Math.ceil(orderCount / itemsPerPage);
            setMaxPages(calculatedMaxPages);
        } else {
            setMaxPages(0); // Đặt maxPages về 0 nếu không có dữ liệu
        }
    }, [negativeProfitData, itemsPerPage]); // Thêm itemsPerPage vào dependency nếu nó có thể thay đổi

    // Lấy các đơn hàng cho trang hiện tại
    const currentOrders = negativeProfitData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > maxPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <React.Fragment>
            <Col xl={6}>
                <Card className="card-height-100">
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Đơn hàng bán lỗ</h4>
                        {/* <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown">
                                <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                    <span className="text-muted">Report<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-end" end>
                                    <DropdownItem>Download Report</DropdownItem>
                                    <DropdownItem>Export</DropdownItem>
                                    <DropdownItem>Import</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div> */}
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                                <tbody>
                                    {currentOrders?.map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <img src={item.items[0].product.data.images[0].url || 'default-avatar.png'} alt="" className="avatar-sm p-2" />
                                                    </div>
                                                    <div>
                                                        <h5 className="fs-14 my-1 fw-medium">
                                                            <Link to={`/apps-ecommerce-orders?orderCode=${item.orderCode}`} className="text-reset">
                                                                {item.user.name}
                                                            </Link>
                                                        </h5>
                                                        <span className="text-muted">{item.user.email.slice(0, 21)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">{item.items[0].product.data.name.slice(0,20)}</span>
                                            </td>
                                            <td>
                                                <p className="mb-0">{item.items[0].quantity}</p>
                                                <span className="text-muted">Số lượng</span>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="text-muted">{new Intl.NumberFormat().format(
                                                        item.items[0].price
                                                    )}đ</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted">Giá bán</span></div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 mb-0">{new Intl.NumberFormat().format(
                                                    item.totalNetProfit
                                                )}đ<i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2"></i></h5>
                                                <span className="text-muted">Lỗ</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
                            <div className="col-sm">
                                <div className="text-muted">Hiển thị <span className="fw-semibold">{currentPage}</span> trên <span className="fw-semibold">{maxPages}</span> Trang
                                </div>
                            </div>
                            <div className="col-sm-auto mt-3 mt-sm-0">
                                <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center">
                                    <li className="page-item"><Link to="#" className="page-link" onClick={() => goToPage(currentPage - 1)}>←</Link></li>
                                    {[...Array(maxPages).keys()].map(n => (
                                        <li key={n + 1} className={`page-item ${n + 1 === currentPage ? 'active' : ''}`}><Link to="#" className="page-link" onClick={() => goToPage(n + 1)}>{n + 1}</Link></li>
                                    ))}
                                    <li className="page-item"><Link to="#" className="page-link" onClick={() => goToPage(currentPage + 1)}>→</Link></li>
                                </ul>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default NegativeProfit;
