import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import * as moment from "moment";
import { Link, useSearchParams } from "react-router-dom";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";


// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import actions
import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
  getNotifications as onGetNotifications,
} from "../../../slices/thunks";

import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import { createSelector } from "reselect";

const EcommerceOrders = () => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode'); // Lấy reviewId từ URL


  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Ecommerce;
  const selectLayoutProperties = createSelector(selectLayoutState, (ecom) => ({
    orders: ecom.orders,
    isOrderSuccess: ecom.isOrderSuccess,
    error: ecom.error,
  }));
  // Inside your component
  const { orders, isOrderSuccess, error } = useSelector(selectLayoutProperties);

  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const isReadOnly = true;
  const orderstatus = [
    {
      options: [
        { label: "Đang chờ xử lý", value: "Pending" },
        { label: "Đã giao", value: "Delivered" },
        { label: "Lấy hàng", value: "Pickups" },
        { label: "Trả hàng", value: "Returns" },
        { label: "Đã hủy", value: "Cancelled" },
      ],
    },
  ];

  const orderpayement = [
    {
      options: [
        { label: "Select Payment", value: "Select Payment" },
        { label: "All", value: "All" },
        { label: "Mastercard", value: "Mastercard" },
        { label: "Paypal", value: "Paypal" },
        { label: "Visa", value: "Visa" },
        { label: "COD", value: "COD" },
      ],
    },
  ];


  const [isEdit, setIsEdit] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (order) => {
    setOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (order) {
      dispatch(onDeleteOrder(order._id));
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) setOrderList(orders);
  }, [orders]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredOrders = orders;
      if (type !== "all") {
        filteredOrders = orders.filter((order) => order.status === type);
      }
      setOrderList(filteredOrders);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);
  
  const handleOrderClick = useCallback(
    (arg) => {
      const order = arg;
      
      setOrder({
        _id: order._id,
        phoneNumber: order.phoneNumber,
        email: order.email,
        items: order.items,
        voucher: order.voucher,
        totalItem: order.totalItem,
        taxFee: order.taxFee,
        shippingCost: order.shippingCost,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        total: order.total,
        status: order.status,
        items: order.items,
        createDate: order.createDate,
        modifyDate: order.modifyDate,
        name: order.name,
      });
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );
  
  
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      _id: (order && order._id) || "",
      name: (order && order.name) || "",
      paymentMethod: (order && order.paymentMethod) || "",
      status: (order && order.status) || "",
      phoneNumber: (order && order.phoneNumber) || "",
      email: (order && order.email) || "",
      voucher: (order && order.voucher) || "",
      totalItem: (order && order.totalItem) || "",
      taxFee: (order && order.taxFee) || "",
      shippingCost: (order && order.shippingCost) || 0,
      shippingAddress: (order && order.shippingAddress) || "",
      total: (order && order.total) || "",
      items: (order && order.items) || [], // trừ cái này
      createDate: (order && order.createDate) || "",
      modifyDate: (order && order.modifyDate) || "",
    },
    validationSchema: Yup.object({
      //email: Yup.string().required("Please Enter Email"),
      phoneNumber: Yup.string().required("Please Enter Phone Number"),
      totalItem: Yup.number().required("Please Enter Total Item"),
      shippingCost: Yup.number().required("Please Enter Shipping Cost"),
      shippingAddress: Yup.string().required("Please Enter Shipping Address"),
      paymentMethod: Yup.string().required("Please Enter Payment Method"),
      total: Yup.number().required("Please Enter Total"),
      status: Yup.string().required("Please Enter Delivery Status"),
    }),

    onSubmit: async (values) => {
      if (isEdit) {
        const updateOrder = {
          _id: values._id,
          email: values.email, // Thêm email
          phoneNumber: values.phoneNumber, // Thêm phoneNumber
          items: order.items,
          voucher: values.voucher, // Thêm voucher
          taxFee: values.taxFee, // Thêm taxFee
          shippingCost: values.shippingCost, // Thêm shippingCost
          shippingAddress: values.shippingAddress, // Thêm shippingAddress
          paymentMethod: values.paymentMethod, // Thêm paymentMethod
          total: values.total, // Thêm total
          status: values.status,
        };
        // update order
        await dispatch(onUpdateOrder(updateOrder));
        await dispatch(onGetNotifications())
        validation.resetForm();
      } else {
        //   _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        //   orderId: values["orderId"],
        //   name: values["name"],
        //   product: values["product"],
        //   orderDate: date,
        //   total: values["total"],
        //   paymentMethod: values["paymentMethod"],
        //   status: values["status"],
        //   phoneNumber: order.phoneNumber, // Thêm phoneNumber
        //   email: order.email, // Thêm email
        //   voucher: order.voucher, // Thêm voucher
        //   totalItem: order.totalItem, // Thêm totalItem
        //   taxFee: order.taxFee, // Thêm taxFee
        //   shippingCost: order.shippingCost, // Thêm shippingCost
        //   shippingAddress: order.shippingAddress, // Thêm shippingAddress
        //   paymentMethod: order.paymentMethod, // Thêm paymentMethod
        //   total: order.total, // Thêm total
        //   items: order.items, // Thêm items
        //   createDate: order.createDate, // Thêm createDate
        //   name: order.name, // Thêm name
        // };
        // // save new order
        // dispatch(onAddNewOrder(newOrder));
        // validation.resetForm();
      }
      toggle();
    },
  });

  useEffect(() => {
    if (orders && !orders.length) {
      dispatch(onGetOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    setOrder(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders)) {
      setOrder(orders);
      setIsEdit(false);
    }
  }, [orders]);

  const handleOrderClicks = () => {
    setOrder("");
    setIsEdit(false);
    toggle();
  };

  // Node API
  // useEffect(() => {
  //   if (isOrderCreated) {
  //     setOrder(null);
  //     dispatch(onGetOrders())
  //   }
  // }, [
  //   dispatch,
  //   isOrderCreated,
  // ]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".orderCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteOrder(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    checkall.checked = false;
    setIsMultiDeleteButton(false);
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".orderCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      // {
      //   Header: (
      //     <input
      //       type="checkbox"
      //       id="checkBoxAll"
      //       className="form-check-input"
      //       onClick={() => checkedAll()}
      //     />
      //   ),
      //   Cell: (cellProps) => {
      //     return (
      //       <input
      //         type="checkbox"
      //         className="orderCheckBox form-check-input"
      //         value={cellProps.row.original._id}
      //         onChange={() => {
      //           deleteCheckbox();
      //         }}
      //       />
      //     );
      //   },
      //   id: "#",
      // },
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
        accessor: row => row.name ? row.name + " (vãng lai)" : row.user.name + " (thành viên)",        Cell: ({ value }) => (
          <span>
          {value ? (
            <strong style={value.includes("thành viên") ? { color: '#E0115F' } : { color: '#009900' }}>{value}</strong>
          ) : null}
        </span>
        ),
        filterable: true,
      },
      // {
      //   Header: "Sản phẩm",
      //   accessor: "items[0].product.name",
      //   filterable: true,
      //   Cell: (cell) => {
      //     const productValue = cell.value || "";
      //     const truncatedProduct =
      //       productValue.length > 20
      //         ? `${productValue.slice(0, 20)}...`
      //         : productValue;
      //     return <span title={productValue}>{truncatedProduct}</span>;
      //   },
      // },
      {
        Header: "Ngày đặt hàng",
        accessor: "createDate",
        filterable: true,
        // Cell: (cell) => {
        //     const formattedCreateDate = moment(order.createDate).format('HH:mm DD/MM/YYYY ');
        //     console.log(cell.value); 
        //   return <span>{cell.value}</span>
        //   },
      },
      {
        Header: "Ngày chỉnh sửa",
        accessor: "modifyDate",
        filterable: true,
        // Cell: (cell) => {
        //   const formattedModifyDate = moment(order.modifyDate).format('HH:mm DD/MM/YYYY ');
        //   return <span>{formattedModifyDate}</span>
        // },
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
        Header: "Phương thức thanh toán",
        accessor: "paymentMethod",
        filterable: true,
      },
      {
        Header: "Trạng thái ",
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
        Header: "Thao tác",
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
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    handleOrderClick(orderData);
                  }}
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              {/* <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    const orderData = cellProps.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li> */}
            </ul>
          );
        },
      },
    ],
    [handleOrderClick, checkedAll]
  );

  const defaultdate = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(defaultdate());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");

    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    h = h <= 9 ? (h = "0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime =
      moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  document.title = "Đơn hàng | Kiddo - Trang quản trị ";
  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
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
        <BreadCrumb title="Đơn hàng" pageTitle="Thương mại điện tử" />
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Lịch sử đơn hàng</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {/* <button
                        type="button"
                        className="btn btn-secondary add-btn"
                        id="create-btn"
                        onClick={() => {
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Create
                        Order
                      </button>{" "} */}
                      {/* <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setIsExportCSV(true)}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Xuất excel
                      </button>{" "} */}
                      {isMultiDeleteButton && (
                        <button
                          className="btn btn-soft-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        >
                          <i className="ri-delete-bin-2-line"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </Row>
              </CardHeader>
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
                          {orders.length}
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
                          {
                            orders.filter(
                              (order) => order.status === "Delivered"
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
                          toggleTab("3", "Pickups");
                        }}
                        href="#"
                      >
                        <i className="ri-truck-line me-1 align-bottom"></i> Lấy
                        hàng{" "}
                        <span className="badge bg-danger align-middle ms-1">
                          {
                            orders.filter((order) => order.status === "Pickups")
                              .length
                          }
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
                          {
                            orders.filter((order) => order.status === "Returns")
                              .length
                          }
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
                          {
                            orders.filter(
                              (order) => order.status === "Cancelled"
                            ).length
                          }
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {isOrderSuccess && orderList.length ? (
                    <TableContainer
                      columns={columns}
                      data={orderList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={8}
                      divClass="table-responsive table-card mb-1"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light text-muted"
                      handleOrderClick={handleOrderClicks}
                      isOrderFilter={true}
                      orderCode={orderCode}
                      SearchPlaceholder="Tìm kiếm ID đơn hàng, tên, trạng thái đơn hàng hoặc thứ gì đó..."
                    />
                  ) : (
                    <Loader error={error} />
                  )}
                </div>
                <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                  <ModalHeader className="bg-light p-3" toggle={toggle}>
                    {!!isEdit ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}
                  </ModalHeader>
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <ModalBody>
                      <input type="hidden" id="id-field" />

                      <div className="mb-3">
                        <Label htmlFor="id-field" className="form-label">
                          Mã đơn hàng
                        </Label>
                        <Input
                          name="orderId"
                          id="id-field"
                          className="form-control"
                          placeholder="Enter Order Id"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values._id || ""}
                          invalid={
                            validation.touched.orderId &&
                            validation.errors.orderId
                              ? true
                              : false
                          }
                        />
                        {validation.touched.orderId &&
                        validation.errors.orderId ? (
                          <FormFeedback type="invalid">
                            {validation.errors.orderId}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="email-field" className="form-label">
                          Địa chỉ Email
                        </Label>
                        <Input
                          name="email"
                          id="email-field"
                          className="form-control"
                          placeholder="Enter Email Address"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="phonenumber-field"
                          className="form-label"
                        >
                          Số điện thoại
                        </Label>
                        <Input
                          name="phoneNumber"
                          id="phonenumber-field"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.phoneNumber || ""}
                          invalid={
                            validation.touched.phoneNumber &&
                            validation.errors.phoneNumber
                              ? true
                              : false
                          }
                        />
                        {validation.touched.phoneNumber &&
                        validation.errors.phoneNumber ? (
                          <FormFeedback type="invalid">
                            {validation.errors.phoneNumber}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="voucher-field" className="form-label">
                          Voucher
                        </Label>
                        <Input
                          name="voucher"
                          id="voucher-field"
                          className="form-control"
                          placeholder="Enter Voucher"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.voucher || 0}
                          invalid={
                            validation.touched.voucher &&
                            validation.errors.voucher
                              ? true
                              : false
                          }
                        />
                        {validation.touched.voucher &&
                        validation.errors.voucher ? (
                          <FormFeedback type="invalid">
                            {validation.errors.voucher}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="taxfee-field" className="form-label">
                          Phí thuế
                        </Label>
                        <Input
                          name="taxFee"
                          id="taxfee-field"
                          className="form-control"
                          placeholder="Enter Tax Fee"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.taxFee || 0}
                          invalid={
                            validation.touched.taxFee &&
                            validation.errors.taxFee
                              ? true
                              : false
                          }
                        />
                        {validation.touched.taxFee &&
                        validation.errors.taxFee ? (
                          <FormFeedback type="invalid">
                            {validation.errors.taxFee}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label
                          htmlFor="shippingcost-field"
                          className="form-label"
                        >
                          Phí vận chuyển
                        </Label>
                        <Input
                          name="shippingCost"
                          id="shippingcost-field"
                          className="form-control"
                          placeholder="Enter Shipping Cost"
                          type="text"
                          readOnly={isReadOnly}
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.shippingCost || 0}
                          invalid={
                            validation.touched.shippingCost &&
                            validation.errors.shippingCost
                              ? true
                              : false
                          }
                        />
                        {validation.touched.shippingCost &&
                        validation.errors.shippingCost ? (
                          <FormFeedback type="invalid">
                            {validation.errors.shippingCost}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Ngày đặt hàng
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Select a date"
                          readOnly={isReadOnly}
                          options={{
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                          }}
                          onChange={(e) => dateformate(e)}
                          value={validation.values.createDate || ""}
                        />

                        {validation.touched.createDate &&
                        validation.errors.createDate ? (
                          <FormFeedback type="invalid">
                            {validation.errors.createDate}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="row gy-4 mb-3">
                        <div className="col-md-6">
                          <div>
                            <Label htmlFor="total-field" className="form-label">
                              Tổng cộng
                            </Label>
                            <Input
                              name="total"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.total || ""}
                              readOnly={isReadOnly}
                              invalid={
                                validation.touched.total &&
                                validation.errors.total
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.total &&
                            validation.errors.total ? (
                              <FormFeedback type="invalid">
                                {validation.errors.total}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <Label
                              htmlFor="paymentMethod-field"
                              className="form-label"
                            >
                              Phương thức thanh toán
                            </Label>

                            <Input
                              name="paymentMethod"
                              type="select"
                              className="form-select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.paymentMethod || ""}
                            >
                              {orderpayement.map((item, key) => (
                                <React.Fragment key={key}>
                                  {item.options.map((item, key) => (
                                    <option value={item.value} key={key}>
                                      {item.label}
                                    </option>
                                  ))}
                                </React.Fragment>
                              ))}
                            </Input>
                            {validation.touched.paymentMethod &&
                            validation.errors.paymentMethod ? (
                              <FormFeedback type="invalid">
                                {validation.errors.paymentMethod}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="delivered-status"
                          className="form-label"
                        >
                          Trạng thái đơn hàng
                        </Label>

                        <Input
                          name="status"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.status || ""}
                        >
                          {orderstatus.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (
                                <option value={item.value} key={key}>
                                  {item.label}
                                </option>
                              ))}
                            </React.Fragment>
                          ))}
                        </Input>
                        {validation.touched.status &&
                        validation.errors.status ? (
                          <FormFeedback type="invalid">
                            {validation.errors.status}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </ModalBody>
                    <div className="modal-footer">
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            setModal(false);
                          }}
                        >
                          Close
                        </button>

                        <button type="submit" className="btn btn-primary">
                          {!!isEdit ? "Update" : "Add name"}
                        </button>
                      </div>
                    </div>
                  </Form>
                </Modal>
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrders;
