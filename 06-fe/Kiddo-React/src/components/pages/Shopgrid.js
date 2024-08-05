import React, {Fragment } from 'react';
import { useParams } from 'react-router-dom';
import {Helmet} from "react-helmet";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/shop-grid/Content';


function Shopgrid() {
    const { catId, tagId, query, minPrice, maxPrice, pagelocation } = useParams();
    console.log("Category");
  
    return (
      <Fragment>
        <Helmet>
          <title>{`Kiddo - Thời trang trẻ em | ${pagelocation}`}</title>
          <meta
            name="description"
            content="#"
          />
        </Helmet>
        <Header />
        <Content
          catId={catId}
          tagId={tagId}
          query={query}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <Footer />
      </Fragment>
    );
  }
  
  export default Shopgrid;