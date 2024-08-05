import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import {
    Card,
    CardBody,
    Col,
    CardHeader,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Row,
    Alert,
  } from "reactstrap";
import { Link} from "react-router-dom";
import Select from "react-select";
import {
    getBrands as onGetBrands,
    addNewBrand as onAddNewBrand,
    updateBrand as onUpdateBrand,
    deleteBrand as onDeleteBrand,
  } from "../../../slices/thunks";
import { ToastContainer } from "react-toastify";

const EcommerceBrand = (props) => {
  const [isBottom, setIsBottom] = useState(false);

  const toggleBottomCanvas = () => {
    setIsBottom(!isBottom);
  };
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");


  const dispatch = useDispatch();
  const selectLayoutState = (state) => state.Ecommerce;
  const ecomBrandsProperties = createSelector(selectLayoutState, (ecom) => ({
    brands: ecom.brands,
    error: ecom.error,
  }));
  // Inside your component
  const { brands, error } = useSelector(
    ecomBrandsProperties
  );
  const [name, setName] = useState("");
  useEffect(() => {
    if (!brands || brands.length === 0) {
      dispatch(onGetBrands());
    }
  }, [dispatch, brands]);


  const addBrand=async()=> {
    const newBrand = {
      name: name,
    };
    await dispatch(onAddNewBrand(newBrand));
  }

  const handleDelete = async (row) => {
    if (!row) {
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the row: ${row.name}?`
      )
    ) {
      return;
    }
   await dispatch(onDeleteBrand(row._id)); 
  };

  const handleEdit = async (row) => {
    await dispatch(onUpdateBrand(row));
    setEditing(null);
  };
  const handleEditDoubleClick = (e) => {
    setEditValue(e.target.value);
  };

  const handleDoubleClick = (row) => {
    setEditing(row._id);
    setEditValue(row.name);
  };


  const handleCancel = () => {
    setEditing(null);
  };
  const brandOptions = Object.values(brands).map((row) => ({
    label: row.name,
    value: row._id,
  }));


  return (
    <div>
      {/* Bottom offcanvas thương hiệu*/}
      <ToastContainer autoClose={2000} limit={1} />
      <Offcanvas
        isOpen={isBottom}
        direction="bottom"
        toggle={toggleBottomCanvas}
        id="offcanvasBottom"
        style={{
          minHeight: "46vh",
          width: "60%", // Điều chỉnh chiều rộng của Offcanvas
          margin: "0 auto", // Để căn giữa theo chiều ngang
          height: "60vh", // Điều chỉnh chiều cao Offcanvas
          transform: "translateY(-50%)",
        }}
      >
        <OffcanvasHeader
          toggle={toggleBottomCanvas}
          id="offcanvasBottomLabel"
          className="border-bottom"
        >
          Quản lý thương hiệu
        </OffcanvasHeader>
        <OffcanvasBody>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Thêm, Xóa, Sửa</h4>
            </CardHeader>

            <CardBody>
              <div id="customerList">
                <Row className="g-4 mb-3">
                  <Col className="col-sm-auto">
                    <div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Thêm thương hiệu..."
                          id="brandNameInput"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <button
                          className="btn btn-success"
                          onClick={addBrand}
                        >
                          + Thêm
                        </button>
                      </div>
                    </div>
                  </Col>
                  <Col className="col-sm">
                  </Col>
                </Row>

                <div className="table-responsive table-card mt-3 mb-1">
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <thead className="table-light">
                      <tr>
                        <th scope="col" style={{ width: "50px" }}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkAll"
                              value="option"
                            />
                          </div>
                        </th>
                        <th className="sort" data-sort="brand_name">
                          Tên thương hiệu
                        </th>
                        <th className="sort" data-sort="brand_created_at">
                          Ngày tạo
                        </th>
                        <th className="sort" data-sort="brand_updated_at">
                          Ngày sửa đổi
                        </th>
                        <th className="sort" data-sort="action">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {brands.map((row) => (
                        <tr key={row._id}>
                          <th scope="row">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="chk_child"
                                value={row._id}
                              />
                            </div>
                          </th>
                          <td className="id" style={{ display: "none" }}>
                            <Link to="#" className="fw-medium link-primary">
                              {row.name}
                            </Link>
                          </td>
                          <td className="brand_name">
                            {editing === row._id ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={handleEditDoubleClick}
                                autoFocus
                              />
                            ) : (
                              <span
                                onDoubleClick={() =>
                                  handleDoubleClick(row)
                                }
                                title="Nhấn đúp để chỉnh sửa"
                                style={{ cursor: "pointer" }}
                              >
                                {row.name}
                              </span>
                            )}
                          </td>
                          <td className="brand_created_at">
                            {row.createDate}
                          </td>
                          <td className="brand_updated_at">
                            {row.modifyDate}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <div className="edit">
                                {editing === row._id && (
                                  <button
                                    className="btn btn-sm btn-success edit-item-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#showModal"
                                    onClick={() => {
                                      const updatedBrand = {
                                        ...row,
                                        name: editValue,
                                      }; // Tạo bản sao và chỉnh sửa 'name'
                                      handleEdit(updatedBrand);
                                    }}
                                  >
                                    Chỉnh sửa
                                  </button>
                                )}
                              </div>
                              <div className="remove">
                                <button
                                  className="btn btn-sm btn-danger remove-item-btn"
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteRecordModal"
                                  onClick={() => handleDelete(row)}
                                >
                                  Loại bỏ
                                </button>
                              </div>
                              <div className="cancle">
                                {editing === row._id && (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={handleCancel}
                                  >
                                    Hủy
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center">
                      <lord-icon
                        src="https://cdn.lordicon.com/msoeawqm.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "75px", height: "75px" }}
                      ></lord-icon>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ Orders We did not find any
                        orders for your search.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <div className="pagination-wrap hstack gap-2">
                    <Link className="page-item pagination-prev disabled" to="#">
                      Trước
                    </Link>
                    <ul className="pagination listjs-pagination mb-0"></ul>
                    <Link className="page-item pagination-next" to="#">
                      Tiếp
                    </Link>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </OffcanvasBody>
      </Offcanvas>
      {/*Quản lý thương hiệu */}
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">Thương hiệu sản phẩm</h5>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-2">
            {" "}
            <Link
              to="#"
              className="float-end text-decoration-underline"
              onClick={toggleBottomCanvas}
              //
            >
              Quản lý thương hiệu
            </Link>
            Chọn thương hiệu sản phẩm
          </p>

          <Select
            name="brand"
            options={brandOptions}
            value={props.brandId}
            onBlur = {props.handleBrandBlur}
            onChange={(selectedOption) => {
             props.handleBrandChange(selectedOption);
            }}
          />

          {props.blur&&props.errors ? (
            <Alert color="danger">
              <strong>Có lỗi xảy ra! </strong>
              {props.errors}
            </Alert>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

export default EcommerceBrand;
