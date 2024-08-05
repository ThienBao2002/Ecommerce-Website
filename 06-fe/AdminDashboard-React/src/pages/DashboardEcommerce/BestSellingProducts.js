import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
//import { bestSellingProducts } from "../../common/data";

const BestSellingProducts = ({revenueData}) => {
  const [currentPeriod, setCurrentPeriod] = useState('15days');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [maxPages, setMaxPages] = useState(0);

  let bestSellingProducts = [];
  switch (currentPeriod) {
    case '7days':
      bestSellingProducts = revenueData.topSellingLast7Days;
      break;
    case '15days':
      bestSellingProducts = revenueData.topSellingLast15Days;
      break;
    case '30days':
      bestSellingProducts = revenueData.topSellingLast30Days;
      break;
    default:
      bestSellingProducts = revenueData.topSellingLast7Days;
  }

  useEffect(() => {
    if (revenueData && revenueData.topSellingLast7Days) {
      const productCount = revenueData.topSellingLast7Days.length;
      const calculatedMaxPages = Math.ceil(productCount / itemsPerPage);
      setMaxPages(calculatedMaxPages);
    } else {
      setMaxPages(0); // Đặt maxPages về 0 nếu không có dữ liệu
    }
  }, [revenueData, itemsPerPage]);  // Thêm itemsPerPage vào dependency nếu nó có thể thay đổi



  // Lấy các sản phẩm cho trang hiện tại
  const currentProducts = bestSellingProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
    setCurrentPage(1); // Quay về trang đầu tiên mỗi khi thay đổi khoảng thời gian
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > maxPages) return;
    setCurrentPage(pageNumber);
  };
  const periodLabels = {
    '7days': '7 ngày',
    '15days': '15 ngày',
    '30days': '30 ngày',
  };
  
  const currentPeriodLabel = periodLabels[currentPeriod] || currentPeriod; // Nếu không tìm thấy, giữ nguyên giá trị gốc
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Sản phẩm bán chạy</h4>
            <div className="flex-shrink-0">
              <UncontrolledDropdown className="card-header-dropdown">
                <DropdownToggle tag="a" className="text-reset" role="button">
                  <span className="fw-semibold text-uppercase fs-12">Sắp xếp theo:</span>
                  <span className="text-muted"> {currentPeriodLabel} <i className="mdi mdi-chevron-down ms-1"></i></span>                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end" end>
                  <DropdownItem onClick={() => handlePeriodChange('7days')}>7 ngày gần đây</DropdownItem>
                  <DropdownItem onClick={() => handlePeriodChange('15days')}>15 ngày gần đây</DropdownItem>
                  <DropdownItem onClick={() => handlePeriodChange('30days')}>30 ngày gần đây</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                <tbody>
                  {currentProducts?.map((item, key) => (
                    <tr key={key}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded p-1 me-2">
                            <img
                              src={item.product.images[0].url}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </div>
                          <div>
                            <h5 className="fs-14 my-1">
                              <Link
                                to={`/apps-ecommerce-product-details/${item.product._id}`}
                                className="text-reset"
                              >
                                {item.product.name.slice(0, 40) + "..."}
                              </Link>
                            </h5>
                            <div>
                              <span className="text-muted">
                                {item.createdAt}
                              </span>
                              <span className="text-muted">
                                {console.log("test category, brand",item)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted">
                                {item.variant1?.name ? `${item.variant1.name} ` : ''}
                              </span>
                              <span className="text-muted">
                                {item?.variant2?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.product.newPrice)}
                        </h5>
                        <span className="text-muted">Giá</span>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">{item.totalQuantity}</h5>
                        <span className="text-muted">Số lượt đặt</span>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          {item.stock ? (
                            item.stock
                          ) : (
                            <span className="badge bg-danger-subtle text-danger">
                              Hết hàng
                            </span>
                          )}{" "}
                        </h5>
                        <span className="text-muted">Trong kho</span>
                      </td>
                      <td>

                        <h5 className="fs-14 my-1 fw-normal">{new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.totalNetProfit)}</h5>
                        <span className="text-muted">Tổng tiền lời</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <div className="text-muted">Hiển thị <span className="fw-semibold">{currentPage}</span> trên <span className="fw-semibold">{maxPages}</span> Trang</div>
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

export default BestSellingProducts;