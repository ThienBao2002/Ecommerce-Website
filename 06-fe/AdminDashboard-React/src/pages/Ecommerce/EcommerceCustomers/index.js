import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  getCustomers as onGetCustomers,
  addNewCustomer as onAddNewCustomer,
  updateCustomer as onUpdateCustomer,
  deleteCustomer as onDeleteCustomer,
} from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Common/Loader";
import { createSelector } from "reselect";

const EcommerceCustomers = () => {
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(selectLayoutState, (ecom) => ({
    customers: ecom.customers,
    isCustomerSuccess: ecom.isCustomerSuccess,
    error: ecom.error,
  }));
  // Inside your component
  const { customers, isCustomerSuccess, error } = useSelector(
    ecomCustomerProperties
  );

  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const customermocalstatus = [
    {
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Cấm", value: "banned" },
      ],
    },
  ];
  const customermocalrole = [
    {
      options: [
        { label: "Quản lý", value: "admin" },
        { label: "Nhân viên", value: "employee" },
        { label: "Khách hàng", value: "user" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      customer: (customer && customer.customer) || "",
      email: (customer && customer.email) || "",
      phone: (customer && customer.phone) || "",
      date: (customer && customer.date) || "",
      status: (customer && customer.status) || "",
      role:(customer && customer.role)||""
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please Enter Your Status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = {
          _id: customer ? customer._id : 0,
          customer: values.customer,
          email: values.email,
          phone: values.phone,
          date: date,
          status: values.status,
          role:values.role,
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          customer: values["customer"],
          email: values["email"],
          phone: values["phone"],
          date: date,
          status: values["status"],
        };
        // save new customer
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Delete Data
  const handleDeleteCustomer = () => {
    if (customer) {
      dispatch(onDeleteCustomer(customer._id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback(
    (arg) => {
      const customer = arg;
      setCustomer({
        _id: customer._id,
        role:customer.role,
        customer: customer.customer,
        email: customer.email,
        phone: customer.phone,
        date: customer.date,
        status: customer.status,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  useEffect(() => {
    if (!customers || customers.length === 0) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);

  useEffect(() => {
    setCustomer(customers);
  }, [customers]);

  useEffect(() => {
    if (!isEmpty(customers)) {
      setCustomer(customers);
      setIsEdit(false);
    }
  }, [customers]);

  // Add Data
  const handleCustomerClicks = () => {
    setCustomer("");
    setIsEdit(false);
    toggle();
  };

  // Node API
  // useEffect(() => {
  //   if (isCustomerCreated) {
  //     setCustomer(null);
  //     dispatch(onGetCustomers());
  //   }
  // }, [
  //   dispatch,
  //   isCustomerCreated,
  // ]);

  const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".customerCheckBox");

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
      dispatch(onDeleteCustomer(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".customerCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Customers Column
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
      //         className="customerCheckBox form-check-input"
      //         value={cellProps.row.original._id}
      //         onChange={() => deleteCheckbox()}
      //       />
      //     );
      //   },
      //   id: "#",
      // },
      {
        Header: "",
        accessor: "_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Khách hàng",
        accessor: "name",
        filterable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
      },
      {
        Header: "Quyền",
        accessor: "role",
        filterable: true,
      },
      {
        Header: "Ngày khởi tạo",
        accessor: "createDate",
        filterable: true,
      },
      {
        Header: "Ngày chỉnh sửa",
        accessor: "modifyDate",
        filterable: true,
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "active":
              return (
                <span className="badge text-uppercase bg-success-subtle text-success">
                  {" "}
                  Hoạt động{" "}
                </span>
              );
            case "banned":
              return (
                <span className="badge text-uppercase bg-danger-subtle text-danger">
                  {" "}
                  Bị cấm
                </span>
              );
            default:
              return (
                <span className="badge text-uppercase bg-info-subtle text-info">
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
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    handleCustomerClick(customerData);
                  }}
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              {/* <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    onClickDelete(customerData);
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
    [handleCustomerClick, checkedAll]
  );

  const dateFormat = () => {
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
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear()
    ).toString();
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Customers | Kiddo - Trang quản trị ";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={customers}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
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
          <BreadCrumb title="Khách hàng" pageTitle="Thương mại điện tử" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Danh sách tài khoản</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-soft-danger me-1"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        {/* <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => {
                            setIsEdit(false);
                            toggle();
                          }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Thêm tài khoản
                        </button>{" "} */}
                        {/* <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsExportCSV(true)}
                        >
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Xuất excel
                        </button> */}
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {isCustomerSuccess && customers.length ? (
                      <TableContainer
                        columns={columns}
                        data={customers || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={true}
                        SearchPlaceholder="Tìm kiếm khách hàng, email, điện thoại, trạng thái hoặc cái gì đó.."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Chỉnh sửa tài khoản" : "Thêm nhân viên"}
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

                        <div
                          className="mb-3"
                          id="modal-id"
                          style={{ display: "none" }}
                        >
                          <Label htmlFor="id-field1" className="form-label">
                            ID
                          </Label>
                          <Input
                            type="text"
                            id="id-field1"
                            className="form-control"
                            placeholder="ID"
                            readOnly
                          />
                        </div>
                        {console.log(validation.values)}
                        <div>
                          <Label htmlFor="role-field" className="form-label">
                            Vai trò
                          </Label>

                          <Input
                            name="role"
                            type="select"
                            className="form-select"
                            id="role-field"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.role || ""}
                          >
                            {customermocalrole.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (
                                  <option value={item.value} key={key}>
                                    {item.label}
                                  </option>
                                ))}
                              </React.Fragment>
                            ))}
                          </Input>
                          {validation.touched.role && validation.errors.role ? (
                            <FormFeedback type="invalid">
                              {validation.errors.role}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div>
                          <Label htmlFor="status-field" className="form-label">
                            Trạng thái
                          </Label>

                          <Input
                            name="status"
                            type="select"
                            className="form-select"
                            id="status-field"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.status || ""}
                          >
                            {customermocalstatus.map((item, key) => (
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
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                          >
                            {" "}
                            Đóng{" "}
                          </button>

                          <button type="submit" className="btn btn-success">
                            {" "}
                            {!!isEdit ? "Chỉnh sửa" : "Add Customer"}{" "}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCustomers;
