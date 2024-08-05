import React, { useState,useEffect  } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import PrivacyPolicy from "../../pages/Pages/PrivacyPolicy"
import Section from "./Section";
import StoreVisits from "./StoreVisits";
import NegativeProfit from "./NegativeProfit";
import { useSelector } from "react-redux";
const DashboardEcommerce = () => {
  const revenueData = useSelector((state) => state.DashboardEcommerce.revenueData);
  document.title = "Dashboard | Kiddo - Trang quản trị ";

  const [rightColumn, setRightColumn] = useState(false);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />

                <Row>
                  {revenueData && <Widget revenueData={revenueData} />}
                </Row>

                <Row>
                  <Col xl={8}>
                    {revenueData &&
                      revenueData.thirtyDayRevenueChart &&
                      revenueData.fifteenDayRevenueChart &&
                      revenueData.sevenDayRevenueChart &&
                      <Revenue revenueData={revenueData} />}
                  </Col>
                  {/* <SalesByLocations /> */}
                  <PrivacyPolicy />
                </Row>

                <Row>
                  {revenueData && <BestSellingProducts revenueData={revenueData} />}

                  {revenueData?.ordersWithNegativeProfitInTime && (
                    <NegativeProfit negativeProfitData={revenueData.ordersWithNegativeProfitInTime} />
                  )}
                </Row>

                <Row>
                  {revenueData?.donutChart && revenueData.donutChart.series?.length > 0 && (
                    <StoreVisits chartData={revenueData.donutChart} />
                  )}

                  {revenueData && <RecentOrders revenueData={revenueData} />}
                </Row>
              </div>
            </Col>

            <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} />
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
