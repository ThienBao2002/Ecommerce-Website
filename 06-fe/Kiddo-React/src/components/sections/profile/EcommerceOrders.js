import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Form,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import TableContainer from "./TableContainer";
import { isEmpty } from "lodash";

// Formik
import { useFormik } from "formik";

//redux
import {useSelector,useDispatch } from "react-redux";
import { createSelector } from 'reselect';

//Import actions
import {
  updateOrder as onUpdateOrder,
} from "../../../slices/thunks";

import Loader from "./Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCustomerById as onGetCustomerById } from "../../../slices/thunks";
const EcommerceOrders = () => {
 //** ======================== CheckSession========================
 const token = useSelector((state) => state.Session.decodedToken);


 //** ======================== Get customer by id ========================
 const dispatch = useDispatch();

 const selectLayoutState = (state) => state.Ecommerce;
 const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
   customers: ecom.customers,
   isCustomerSuccess: ecom.isCustomerSuccess,
   error: ecom.error,
 }));
 // Inside your component
 // eslint-disable-next-line
 const { customers: customer, isCustomerSuccess, error } = useSelector(
   ecomCustomerProperties
 );
 useEffect(() => {
   if (customer && !customer.length && token!==null) {
     dispatch(onGetCustomerById(token.userId));
   }
   // eslint-disable-next-line
 }, [dispatch,token]);
  const [activeTab, setActiveTab] = useState("1");

  // Inside your component
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);



  useEffect(() => {
    setOrderList(customer.orders);
  }, [customer]);

  useEffect(() => {
    if (!isEmpty(customer.orders)) setOrderList(customer.orders);
  }, [customer]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredOrders = customer.orders;
      if (type !== "all") {
        filteredOrders = customer.orders.filter(
          (order) => order.status === type
        );
      }
      setOrderList(filteredOrders);
    }
  };


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      _id: (order && order._id) || "",
    },

    onSubmit: async (values) => {
        const updateOrder = {
          _id: values._id,
          status: "Cancelled",
        };
        try {
          // update order
          await dispatch(onUpdateOrder(updateOrder));
          await dispatch(onGetCustomerById(token.userId));
          validation.resetForm();
        } catch (error) {
          console.error("Error updating order:", error);
        }
    },
    
  });

  useEffect(() => {
    if (customer.orders && !customer.orders.length) {
      setOrderList(customer.orders);
    }
  }, [dispatch, customer.orders, customer]);

  useEffect(() => {
    setOrder(customer.orders);
  }, [customer.orders]);

  useEffect(() => {
    if (!isEmpty(customer.orders)) {
      setOrder(customer.orders);
    }
  }, [customer.orders]);

  useEffect(()=>{
    console.log(orderList);
  },[orderList])



  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="orderCheckBox form-check-input"
              value={cellProps.row.original._id}
            />
          );
        },
        id: "#",
      },
      {
        Header: "Mã đơn hàng",
        accessor: "orderCode",  // Dùng orderCode làm accessor để hiển thị mã đơn hàng
        filterable: true,
        Cell: ({ row }) => {  // Sử dụng { row } để truy cập toàn bộ dữ liệu của hàng
          const { _id, orderCode } = row.original;  // Truy cập _id và orderCode từ dữ liệu gốc của hàng
          return (
            <Link
              to={`/apps-ecommerce-order-details/${_id}`}  // Sử dụng _id để tạo liên kết
              className="fw-medium link-primary"
            >
              {orderCode}
            </Link>
          );
        },
      }, 
      {
        Header: "Khách hàng",
        accessor: (row) =>
          row.name ? row.name + " (vãng lai)" : row.user.name + " (thành viên)",
        Cell: ({ value }) => (
          <span>
            {value ? (
              <strong
                style={
                  value.includes("thành viên")
                    ? { color: "#E0115F" }
                    : { color: "#009900" }
                }
              >
                {value}
              </strong>
            ) : null}
          </span>
        ),
        filterable: true,
      },
      {
        Header: "Đánh giá",
        accessor: "isSuccessReviewed",
        filterable: true,
        Cell: (cell) => {
          switch (cell.value) {
            case true:
              return (
                <span className="badge text-uppercase bg-success-subtle text-success">
                  {" "}
                  {"Đánh giá thành công"}{" "}
                </span>
              );
            case false:
              return (
                <span className="badge text-uppercase bg-danger-subtle text-danger">
                  {" "}
                  {"Chưa đánh giá"}{" "}
                </span>
              );
            default:
              return (
                <span className="badge text-uppercase bg-warning-subtle text-warning">
                  {" "}
                  {"Chưa đánh giá"}{" "}
                </span>
              );
          }

        },
      },
      {
        Header: "Ngày đặt",
        accessor: "createDate",
        filterable: true,
      },
      {
        Header: "Tổng SL",
        accessor: "items",
        filterable: true,
        Cell: (cell) => {
          // Lấy ra mảng items từ cell.value
          const items = cell.value;

          // Tính tổng quantity từ mảng items
          const totalQuantity = items.reduce((total, item) => {
            return total + item.quantity;
          }, 0);

          // Hiển thị tổng trong cột "total"
          return <span>{totalQuantity}</span>;
        },
      },
      {
        Header: "Thanh toán",
        accessor: "paymentMethod",
        filterable: true,
      },
      {
        Header: "Trạng thái đơn hàng",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "Pending":
              return (
                <span className="badge text-uppercase bg-warning-subtle text-warning">
                  {" "}
                  {/* {cell.value}{" "} */}
                  {"Đang chờ xử lý"}{" "}
                </span>
              );
            case "Cancelled":
              return (
                <span className="badge text-uppercase bg-danger-subtle text-danger">
                  {" "}
                  {"Hủy đơn"}{" "}
                </span>
              );
            case "Inprogress":
              return (
                <span className="badge text-uppercase bg-secondary-subtle text-secondary">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
            case "Pickups":
              return (
                <span className="badge text-uppercase bg-info-subtle text-info">
                  {" "}
                  {"Lấy hàng"}{" "}
                </span>
              );
            case "Returns":
              return (
                <span className="badge text-uppercase bg-primary-subtle text-primary">
                  {" "}
                  {"Trả hàng"}{" "}
                </span>
              );
            case "Delivered":
              return (
                <span className="badge text-uppercase bg-success-subtle text-success">
                  {" "}
                  {"Đã giao"}{" "}
                </span>
              );
            default:
              return (
                <span className="badge text-uppercase bg-warning-subtle text-warning">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
          }
        },
      },

      {
        Header: "Xem/Xóa",
        Cell: (cellProps) => {
          const orderId = cellProps.row.original._id;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <Link
                  to={`/apps-ecommerce-order-details/${orderId}`}
                  className="text-primary d-inline-block"
                >
                  <i className="ri-eye-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit">
                <Form
                  className="tablelist-form d-inline-block edit-item-btn"
                  onSubmit={async (e) => {            
                    e.preventDefault();
                    validation.setFieldValue("_id", orderId);
                    if (window.confirm("Bạn có chắc chắn muốn Hủy đơn hàng này?")) {
                      await validation.handleSubmit();
                    }
                    return false;
                  }}
                >
                  <button type="submit" className="text-primary bg-transparent border-0 p-0">
                    <i className="ri-pencil-fill fs-16"></i>
                  </button>
                </Form>
              </li>
            </ul>
          );
        },
      },
    ],
    [validation]
  );
  return (
    <div>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      ></Form>

      <Card id="orderList">
        <CardBody className="pt-0">
          <div>
            <Nav
              className="nav-tabs nav-tabs-custom nav-success"
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
                  <i className="ri-store-2-fill me-1 align-bottom"></i>
                  Tất cả{" "}
                  <span className="badge bg-danger align-middle ms-1">
                    {customer && customer.orders ? customer.orders.length : 0}
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
                    toggleTab("2", "Delivered");
                  }}
                  href="#"
                >
                  <i className="ri-checkbox-circle-line me-1 align-bottom"></i>
                  Đã giao{" "}
                  <span className="badge bg-danger align-middle ms-1">
                    {customer && customer.orders
                      ? customer.orders.filter(
                          (order) => order.status === "Delivered"
                        ).length
                      : 0}
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
                    toggleTab("3", "Pickups");
                  }}
                  href="#"
                >
                  <i className="ri-truck-line me-1 align-bottom"></i> Lấy hàng{" "}
                  <span className="badge bg-danger align-middle ms-1">
                    {customer && customer.orders
                      ? customer.orders.filter(
                          (order) => order.status === "Pickups"
                        ).length
                      : 0}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: activeTab === "4" },
                    "fw-semibold"
                  )}
                  onClick={() => {
                    toggleTab("4", "Returns");
                  }}
                  href="#"
                >
                  <i className="ri-arrow-left-right-fill me-1 align-bottom"></i>
                  Trả hàng{" "}
                  <span className="badge bg-danger align-middle ms-1">
                    {customer && customer.orders
                      ? customer.orders.filter(
                          (order) => order.status === "Returns"
                        ).length
                      : 0}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: activeTab === "5" },
                    "fw-semibold"
                  )}
                  onClick={() => {
                    toggleTab("5", "Cancelled");
                  }}
                  href="#"
                >
                  <i className="ri-close-circle-line me-1 align-bottom"></i>
                  Đã hủy{" "}
                  <span className="badge bg-danger align-middle ms-1">
                    {customer && customer.orders
                      ? customer.orders.filter(
                          (order) => order.status === "Cancelled"
                        ).length
                      : 0}
                  </span>
                </NavLink>
              </NavItem>
            </Nav>
            {orderList && orderList.length ? (
                <TableContainer
                  columns={columns}
                  data={orderList || []}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={8}
                  divClass="table-responsive table-card mb-1"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light text-muted"
                  isOrderFilter={true}
                  SearchPlaceholder="Tìm kiếm ID đơn hàng, tên, trạng thái đơn hàng hoặc thứ gì đó..."
                />
            ) : (
              <Loader />
            )}
          </div>
          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>
    </div>
  );
};

export default EcommerceOrders;
