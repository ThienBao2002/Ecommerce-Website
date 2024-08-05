
import Pagination from "react-js-pagination";
import ProductFilters from "../../layouts/ProductFilters";
import {
  getProducts as onGetProducts,
} from "../../../slices/thunks";
//redux
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../home/ProductItem";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Quickview from "../../layouts/Quickview";
const Content = ({ promotionId,categoryNameSlug,brandNameSlug }) => {
  const [activePage, setActivePage] = useState(1);
  const [itemPerPage] = useState(12);
  const [isFiltering, setIsFiltering] = useState(false);

  const [productId, setProductId] = useState(null);
  const [modal_showQuickView, setmodal_ShowQuickView] = useState(false);
  function tog_ShowQuickView(index) {
    setProductId(index);
    setmodal_ShowQuickView(!modal_showQuickView);
  }

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };


  //GetProductFromAPi
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);
  const products = useSelector((state) => state.Ecommerce.products);
  useEffect(() => {
    if (!products || !products.length) {
      dispatch(onGetProducts());
    }
    // eslint-disable-next-line
  }, [products]); // Phụ thuộc vào dispatch và products

  useEffect(() => {
    if (productList.length === 0 && isFiltering === false)
      {
        const filteredProducts = products.filter((p) => p.isPublish === true);
        setProductList(filteredProducts);
      }
  }, [products, productList,isFiltering]);



  const paginationData = productList
    .slice((activePage - 1) * itemPerPage, activePage * itemPerPage)
    .map((item, i) => (
      <div key={i} className="col-lg-4 col-md-4 col-sm-6" >
        <ProductItem
          item={item}
          tog_ShowQuickView={tog_ShowQuickView}>
        </ProductItem>
      </div>
    ));

  return (
    <div className="container">
      <div className="hm-section">

        <div className="row">

          <div className="col-xl-3 col-lg-3">
            <ProductFilters
              productList={productList}
              promotionId={promotionId}
              categoryNameSlug={categoryNameSlug}
              brandNameSlug={brandNameSlug}
              setProductList={setProductList}
              setIsFiltering={setIsFiltering} />
          </div>
          <div className="col-xl-9 col-lg-9">
            <div className="hm-shop-filter py-3">
              <div className="hm-filter">
                <form className="form-inline">
                  <div className="form-group">
                    
                  </div>
                </form>
              </div>
              <div className="hm-pagination">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={itemPerPage}
                  totalItemsCount={productList.length}
                  pageRangeDisplayed={productList.length}
                  onChange={handlePageChange}
                  innerClass="pagination"
                  activeClass="active"
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            </div>
            <div className="hm-products">
              <div className="row">{paginationData}</div>
              <Modal
                size="xl"
                isOpen={modal_showQuickView}
                toggle={() => {
                  tog_ShowQuickView();
                }}
              >
                <ModalHeader className="modal-title"
                  id="myExtraLargeModalLabel" toggle={() => {
                    tog_ShowQuickView();
                  }}>
                  Xem nhanh
                </ModalHeader>
                <ModalBody>
                  <Quickview
                    productId={productId}
                    test="test"
                  />
                </ModalBody>
              </Modal>
            </div>
            <div className="hm-shop-filter py-3">
              <div className="hm-filter">
                <form className="form-inline">
                  <div className="form-group">
                  </div>
                </form>
              </div>
              <div className="hm-pagination">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={itemPerPage}
                  totalItemsCount={productList.length}
                  pageRangeDisplayed={productList.length}
                  onChange={handlePageChange}
                  innerClass="pagination"
                  activeClass="active"
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Content;
