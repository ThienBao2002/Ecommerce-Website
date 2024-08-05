import React, { Fragment } from "react";
import {Helmet} from "react-helmet";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Content from "../sections/profile/Content";

const pagelocation = "Thông tin khách hàng";

function Profile() {
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

export default Profile;
