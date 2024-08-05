import React, { Fragment } from "react";
import {Helmet} from "react-helmet";
import Content from "../sections/checkout-v2/Content";

const Checkouttwo = ({ pagelocation }) => {
  return (
    <Fragment>
      <Helmet>
        <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
        <meta name="description" content="#" />
      </Helmet>
      <Content />
    </Fragment>
  );
};

export default Checkouttwo;
