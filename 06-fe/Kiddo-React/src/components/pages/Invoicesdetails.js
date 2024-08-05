import React, { Fragment } from "react";
import {Helmet} from "react-helmet";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Content from "../sections/invoices-details/Content";

const pagelocation = "Chi tiết hóa đơn";

function Orderdetails() {
  return (
    <Fragment>
      <Helmet>
        <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
        <meta name="description" content="#" />
      </Helmet>
      <Header />
      <Content />
      <Footer />
    </Fragment>
  );
}

export default Orderdetails;
