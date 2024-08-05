import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col } from 'reactstrap';

const RecentOrders = ({ revenueData }) => {
    const [recentOrders, setRecentOrders] = useState([]);
    useEffect(() => {
        if (!(!revenueData || revenueData.length === 0))
            setRecentOrders(revenueData.existingRevenueRecord.recentOrders);

    }, [revenueData])

    return (
        <React.Fragment>
            <Col xl={8}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Đơn hàng gần đây</h4>
                        <div className="flex-shrink-0">
                            {/* <button type="button" className="btn btn-soft-secondary btn-sm">
                                <i className="ri-file-list-3-line align-middle"></i> Generate Report
                            </button> */}
                        </div>
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted table-light">
                                    <tr>
                                        <th scope="col">Mã đơn hàng</th>
                                        <th scope="col">Khách hàng</th>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Tổng hóa đơn</th>
                                        <th scope="col">Trạng thái</th>
                                        <th scope="col">Thanh toán</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Link to={`/apps-ecommerce-order-details/${order._id}`} className="fw-medium text-reset">
                                                    {order.orderCode}
                                                </Link>
                                                <div>
                                                    <span className='text-muted'>
                                                        {order.createDate}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={"http://localhost:3005/static/media/avatar-9.a3a12013136643ae35e2.jpg"} alt="" className="avatar-xs rounded-circle me-2" />
                                                    {order?.user?.name}
                                                </div>
                                            </td>
                                            <td>

                                                <div className="d-flex align-items-center">
                                                    {order?.items[0]?.product?.data?.name?.slice(0, 20) + "..."}
                                                    <img src={order?.items[0]?.product?.data?.images[0]?.url} alt="" className="avatar-xs rounded-circle me-2" />
                                                </div>

                                            </td>



                                            <td>{order?.items[0]?.quantity}</td>
                                            <td> {(order?.totalItem).toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</td>
                                            <td>
                                                {order?.status === "Pending" ? (
                                                    <span className="badge bg-warning-subtle text-warning text-uppercase">Đang xử lý</span>
                                                ) : order.status === "Cancelled" ? (
                                                    <span className="badge bg-danger-subtle text-danger text-uppercase">Đã hủy</span>
                                                ) : order.status === "Inprogress" ? (
                                                    <span className="badge bg-secondary-subtle text-secondary text-uppercase">Đang tiến hành</span>
                                                ) : order.status === "Pickups" ? (
                                                    <span className="badge bg-info-subtle text-info text-uppercase">Lấy hàng</span>
                                                ) : order.status === "Returns" ? (
                                                    <span className="badge bg-primary-subtle text-primary text-uppercase">Trả hàng</span>
                                                ) : order.status === "Delivered" ? (
                                                    <span className="badge bg-success-subtle text-success text-uppercase">Đã giao</span>
                                                ) : (
                                                    <span className="badge bg-warning-subtle text-warning text-uppercase">{order.status}</span>
                                                )}
                                            </td>
                                            <td>
                                                {order?.paymentStatus === "Fail" ? (
                                                    <Badge className="badge-gradient-danger text-uppercase">Thất bại</Badge>
                                                ) : order.paymentStatus === "Paid" ? (
                                                    <Badge className="badge-gradient-success text-uppercase">Đã thanh toán</Badge>
                                                ) : order.paymentStatus === "Pending" ? (
                                                    <Badge className="badge-gradient-warning text-uppercase">Đang xử lý</Badge>
                                                ) : (
                                                    <Badge className="badge-gradient-info text-uppercase">{order.paymentStatus}</Badge>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RecentOrders;