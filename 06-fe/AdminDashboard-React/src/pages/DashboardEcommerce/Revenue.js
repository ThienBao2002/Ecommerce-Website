import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { getRevenueChartsData } from "../../slices/thunks";
import { createSelector } from "reselect";
import {
  allRevenueData
} from "../../common/data/dashboardEcommerce";
const Revenue = ({ revenueData }) => {
  const [chartData, setChartData] = useState([]);
  const [labelData, setlabelData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState('all');

  useEffect(() => {
    if (revenueData) {
      switch (currentPeriod) {
        case 'all':
          setChartData(revenueData.thirtyDayRevenueChart.chart || []);
          setlabelData(revenueData.thirtyDayRevenueChart.data || {})
          setCategories(revenueData.thirtyDayRevenueChart.chart[3].data );
          break;
        case '7days':
          setChartData(revenueData.sevenDayRevenueChart.chart || []);
          setlabelData(revenueData.sevenDayRevenueChart.data || {})
          setCategories(revenueData.sevenDayRevenueChart.chart[3].data );
          break;
        case '15days':
          setChartData(revenueData.fifteenDayRevenueChart.chart || []);
          setlabelData(revenueData.fifteenDayRevenueChart.data || {})
          setCategories(revenueData.fifteenDayRevenueChart.chart[3].data );
          break;
        case '30days':
          setChartData(revenueData.thirtyDayRevenueChart.chart || []);
          setlabelData(revenueData.thirtyDayRevenueChart.data || {})
          setCategories(revenueData.thirtyDayRevenueChart.chart[3].data );
          break;
        default:
          console.error(`Unknown period type: ${currentPeriod}`);
          setChartData([]);
          setlabelData({});
          setCategories([]);
      }
    } else {
      console.error('revenueData is undefined');
      setChartData([]);
      setCategories([]);
    }
  }, [revenueData, currentPeriod]);

  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
  };
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Doanh số</h4>
          <div className="d-flex gap-1">
            <button
              type="button"
              className={`btn btn-soft-secondary btn-sm ${currentPeriod === 'all' ? 'btn-soft-primary' : ''}`}
              onClick={() => handlePeriodChange('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn btn-soft-secondary btn-sm ${currentPeriod === '7days' ? 'btn-soft-primary' : ''}`}
              onClick={() => handlePeriodChange('7days')}
            >
              7 ngày
            </button>
            <button
              type="button"
              className={`btn btn-soft-secondary btn-sm ${currentPeriod === '15days' ? 'btn-soft-primary' : ''}`}
              onClick={() => handlePeriodChange('15days')}
            >
              15 ngày
            </button>
            <button
              type="button"
              className={`btn btn-soft-secondary btn-sm ${currentPeriod === '30days' ? 'btn-soft-primary' : ''}`}
              onClick={() => handlePeriodChange('30days')}
            >
              30 ngày
            </button>
          </div>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp start={0} end={labelData.totalOrders} duration={3} separator="," />
                </h5>
                <p className="text-muted mb-0">Đơn đặt hàng</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    suffix="VND"
                    start={0}
                    end={labelData.totalNetProfit}
                    duration={3}
                  />
                </h5>
                <p className="text-muted mb-0">Thu về</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp start={0} end={labelData.totalCancelledOrders} duration={3} />
                </h5>
                <p className="text-muted mb-0">Hoàn lại</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0 border-end-0">
                <h5 className="mb-1 text-success">
                  <CountUp
                    start={0}
                    end={labelData.averageProfitPercentage}
                    decimals={2}
                    duration={3}
                    suffix="%"
                  />
                </h5>
                <p className="text-muted mb-0">Lãi</p>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts
                series={chartData}
                dataColors='["--vz-light",  "--vz-primary", "--vz-secondary"]'
                categories={categories}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
