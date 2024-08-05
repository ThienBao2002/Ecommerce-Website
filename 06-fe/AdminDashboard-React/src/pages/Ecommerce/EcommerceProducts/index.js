import React, { useEffect, useState, useMemo } from "react";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";

import "nouislider/distribute/nouislider.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { Published, Price } from "./EcommerceProductCol";
//Import data
//import { products } from "../../../common/data";

//Import actions
import {
  getProducts as onGetProducts,
  deleteProducts,
} from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProductFilters from "./ProductFilters";


const EcommerceProducts = (props) => {
  const pageContentClass = props.usePageContentStyle ? "page-content" : "";
  const isAddProductToPromotion = props.isAddProductToPromotion;
  const dispatch = useDispatch();
  const products = useSelector(state => state.Ecommerce.products);
  const [productList, setProductList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [product, setProduct] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [productPage, setProductPage] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggleTab = (tab, type) => {
    let filteredProducts = products;
    if (activeTab !== tab) {
      setActiveTab(tab);
      if (type !== "all" && type === true) {
        filteredProducts = products.filter(
          (product) => product.isPublish === type
        );
      }
      if (type !== "all" && type === false) {
        filteredProducts = products.filter(
          (product) => product.isPublish === type
        );
      }
    }
    setProductList(filteredProducts);
  };


  useEffect(() => {
    if (productList.length == 0 && activeTab == 1 && isFiltering === false)
      setProductList(products);
  }, [products, productList, isFiltering]);

  useEffect(() => {
    // Gửi yêu cầu lấy sản phẩm, danh mục, và thương hiệu nếu chúng chưa được tải
    if (!products || products.length === 0) {
      dispatch(onGetProducts());
    }
  }, [products]);


  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = async (product) => {
    setProduct(product);
    setDeleteModal(true);
    //await dispatch(deleteProducts(product.row.original._id));
    await dispatch(onGetProducts());
  };

  const handleDeleteProduct = async () => {
    if (product) {
      await dispatch(deleteProducts(product._id));
      setDeleteModal(false);
    }
  };

  const [dele, setDele] = useState(0);

  // Displat Delete Button
  const displayDelete = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    setDele(ele.length);
    if (ele.length === 0) {
      del.style.display = "none";
    } else {
      del.style.display = "block";
    }
  };

  // Delete Multiple
  const deleteMultiple = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach(
      (element => {
        dispatch(deleteProducts(element.value));
        setTimeout(() => {
          toast.clearWaitingQueue();
        }, 3000);
        del.style.display = "none";
      })
    );
  };
  const handleProductSelection = (productId) => {
    setSelectedProducts(prevSelectedProducts => {
      if (prevSelectedProducts.includes(productId)) {
        // Loại bỏ sản phẩm đã chọn
        return prevSelectedProducts.filter(id => id !== productId);
      } else {
        // Thêm sản phẩm mới chọn
        return [...prevSelectedProducts, productId];
      }
    });
    displayDelete();
  };
  //Khi chưa có sản phẩm productToPromotion
  useEffect(() => {
    if (typeof props.setSelectedProductsToPromotion === 'function') {
      props.setSelectedProductsToPromotion(selectedProducts);
    }
    else {
      console.log('setSelectedProductsToPromotion is not a function!', props);
    }

  }, [selectedProducts]); // Including it in dependency array
  //Khi đã có sản phẩm prodctToPromotion
  useEffect(() => {
    if (typeof props.setSelectedProductsToPromotion === 'function' && props.selectedProductsToPromotion.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts(props.selectedProductsToPromotion);
    }
  }, [props.selectedProductsToPromotion])
  useEffect(() => {
    const checkAllSelected = productPage.every(product => selectedProducts.includes(product._id));
    setAllSelected(checkAllSelected);
    console.log("All selected:", checkAllSelected);
  }, [productPage, selectedProducts]);

  const handleSelectAll = (e) => {
    e.stopPropagation();  // Ngăn sự kiện lan lên tiêu đề cột
    const allProductIds = productPage.map(p => p._id);
    if (e.target.checked) {
      const newSelectedProducts = Array.from(new Set([...selectedProducts, ...allProductIds]));
      setSelectedProducts(newSelectedProducts);
    } else {
      const remainingSelectedProducts = selectedProducts.filter(id => !allProductIds.includes(id));
      setSelectedProducts(remainingSelectedProducts);
    }
  };
  const customSort = React.useCallback((rowA, rowB) => {
    const aSelected = selectedProducts.includes(rowA.original._id);
    const bSelected = selectedProducts.includes(rowB.original._id);
    // Nếu cả hai sản phẩm cùng được chọn hoặc không được chọn, giữ nguyên thứ tự
    if (aSelected === bSelected) {
      return 0;
    }
    // Nếu sản phẩm A được chọn và B không được chọn, A lên trên
    if (aSelected && !bSelected) {
      return -1;
    }
    // Ngược lại, B lên trên
    return 1;
  }, [selectedProducts]);
  const dateSort = React.useMemo(() => {
    return (rowA, rowB, columnId, desc) => {
      let a = rowA.values[columnId];
      let b = rowB.values[columnId];
      // Chuyển đổi chuỗi sang đối tượng Date
      a = a ? new Date(a.substr(6, 4), a.substr(3, 2) - 1, a.substr(0, 2), a.substr(11, 2), a.substr(14, 2)) : new Date(0);
      b = b ? new Date(b.substr(6, 4), b.substr(3, 2) - 1, b.substr(0, 2), b.substr(11, 2), b.substr(14, 2)) : new Date(0);
  
      // So sánh các đối tượng Date
      return a > b ? 1 : -1;
    };
  }, []);
  



  const columns = useMemo(
    () => [
      {
        Header: () => (
          <input
            type="checkbox"
            className="form-check-input selectAllCheckBox"
            checked={allSelected}
            onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền
            onChange={handleSelectAll}
            title="Chọn/Bỏ chọn tất cả"
          />
        ),
        accessor: "_id",
        Cell: ({ cell }) => (
          <input
            key={cell.row.original._id}
            type="checkbox"
            className="form-check-input productCheckBox"
            value={cell.row.original._id}
            onChange={() => handleProductSelection(cell.row.original._id)}
            checked={selectedProducts.includes(cell.row.original._id)}
          />
        ),
        sortType: customSort, // Sử dụng hàm sắp xếp tùy chỉnh
      },

      {
        Header: "Sản phẩm",
        accessor: "name",
        Cell: (product) => {
          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm bg-light rounded p-1">
                    {product.row.original.images[0] && (
                      <img
                        src={product.row.original.images[0].url}
                        alt=""
                        className="img-fluid d-block"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link
                      to={`/apps-ecommerce-product-details/${product.row.original._id}`}
                      className="text-body"
                    >
                      {" "}
                      {product.row.original.name}
                    </Link>
                  </h5>
                  <p className="text-muted mb-0">
                    Danh mục:{" "}
                    <span className="fw-medium">
                      {product.row.original.category
                        ? product.row.original.category.name
                        : "Không có danh mục"}
                    </span>{" "}
                  </p>
                  <p className="text-muted mb-0">
                    Thương hiệu:{" "}
                    <span className="fw-medium">
                      {product.row.original.brand
                        ? product.row.original.brand.name
                        : "Không có thương hiệu"}
                    </span>
                  </p>
                </div>
              </div>
            </>
          );
        },
      },
      {
        Header: "Số lượng",
        accessor: "stock",
        filterable: true,
      },
      {
        Header: "Giá bán",
        accessor: "newPrice",
        filterable: true,
        Cell: (cellProps) => {
          return <Price {...cellProps} />;
        },
      },
      {
        Header: "Giảm giá",
        accessor: "discount",
        filterable: true,
        // Sử dụng cellProps để tùy chỉnh giá trị trong ô cụ thể
        Cell: (cellProps) => {
          // Kiểm tra nếu giá trị discount hợp lệ
          if (cellProps.value !== null && cellProps.value !== undefined) {
            // Thêm dấu '%' vào giá trị và hiển thị
            return `${cellProps.value}%`;
          } else {
            return "N/A"; // Hoặc giá trị mặc định nếu discount không tồn tại
          }
        },
      },
      {
        Header: "Đánh giá",
        accessor: "averageRating",
        filterable: true,
      },
      {
        Header: "Số đơn hàng",
        accessor: "ordersCount",
        filterable: true,
      },
      {
        Header: "Ngày công bố",
        accessor: "publishedDate",
        filterable: true,
        sortType: dateSort
      },
      {
        Header: "Trạng thái",
        accessor: "isPublish",
        filterable: true,
        Cell: (cellProps) => {
          return <Published {...cellProps} />;
        },
      },
      // {
      //   Header: "Rating",
      //   accessor: "rating",
      //   filterable: false,
      //   Cell: (cellProps) => {
      //     return <Rating {...cellProps} />;
      //   },
      // },
      {
        Header: "Thao tác",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm"
                tag="button"
              >
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  tag={Link}
                  to={`/apps-ecommerce-product-details/${cellProps.row.original._id}`}
                  className="text-body"
                >
                  {" "}
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                  Xem
                </DropdownItem>

                <DropdownItem>
                  <Link
                    to={`/apps-ecommerce-add-product/${cellProps.row.original._id}`}
                    className="text-body"
                  >
                    <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                    Chỉnh sửa
                  </Link>
                </DropdownItem>

                <DropdownItem divider />

                <DropdownItem
                  href="#"
                  onClick={() => {
                    const productData = cellProps.row.original;
                    onClickDelete(productData);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                  Xóa
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [allSelected, handleSelectAll, handleProductSelection, selectedProducts]);
  document.title = "Sản phẩm | Kiddo - Trang quản trị ";


  return (
    <div className={pageContentClass}>
      <ToastContainer closeButton={false} limit={1} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <BreadCrumb title="Sản phẩm" pageTitle="Thương mại điện tử" />

        <Row>
          <Col xl={3} lg={4}>
            <ProductFilters
              productList={productList}
              setProductList={setProductList}
              setIsFiltering={setIsFiltering}
              isAddProductToPromotion={isAddProductToPromotion} />
          </Col>

          <div className="col-xl-9 col-lg-8">
            <div>
              <div className="card">
                <div className="card-header border-0">
                  <div className="row align-items-center">
                    <div className="col">
                      <Nav
                        className="nav-tabs-custom card-header-tabs border-bottom-0"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "1" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("1", "all");
                            }}
                            href="#"
                          >
                            Tất cả{" "}
                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              {products.length}
                            </span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "2" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("2", true);
                            }}
                            href="#"
                          >
                            Hiển thị{" "}
                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              {
                                products.filter(
                                  (product) => product.isPublish === true
                                ).length
                              }
                            </span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "3" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("3", false);
                            }}
                            href="#"
                          >
                            Đã ẩn{" "}
                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              {
                                products.filter(
                                  (product) => product.isPublish === false
                                ).length
                              }
                            </span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <div className="col-auto">
                      <div id="selection-element">
                        <div className="my-n1 d-flex align-items-center text-muted">
                          Đã chọn{" "}
                          <div
                            id="select-content"
                            className="text-body fw-semibold px-1"
                          >
                            {selectedProducts.length}
                          </div>{" "}
                          sản phẩm{" "}
                          <button
                            type="button"
                            className="btn btn-link link-danger p-0 ms-3"
                            onClick={() => {
                              //setDeleteModalMulti(true);
                              setSelectedProducts([]);
                              setDeleteModal(false);
                              setDeleteModalMulti(false);
                              setDele(0);
                              document.getElementById("selection-element").style.display = "none";
                            }}
                          >
                            Bỏ chọn tất cả
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {productList && productList.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={productList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="mb-0 align-middle table-borderless"
                      theadClass="table-light text-muted"
                      isProductsFilter={true}
                      setProductPage={setProductPage}
                      SearchPlaceholder="Tìm kiếm sản phẩm"
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <div>
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#405189,secondary:#0ab39c"
                          style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                      </div>

                      <div className="mt-4">
                        <h5>Không tìm thấy sản phẩm</h5>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-product-list-all"
                        className="table-card gridjs-border-none pb-2"
                      >
                      </div>
                    </TabPane>
                  </TabContent>
                </div> */}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceProducts;
