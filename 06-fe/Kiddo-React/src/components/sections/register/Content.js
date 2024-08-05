import React, { useEffect } from "react";
import {
  Alert,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// action
import { registerUser, apiError, resetRegisterFlag } from "../../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
//đăng ký
function Content(props) {
  const history = useNavigate();
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      name: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Vui lòng nhập email"),
      name: Yup.string().required("Vui lòng nhập tài khoản"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  const selectLayoutState = (state) => state.Account;
  const registerdatatype = createSelector(selectLayoutState, (account) => ({
    success: account.success,
    error: account.error,
  }));
  // Inside your component
  const { error, success } = useSelector(registerdatatype);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);
  return (
    <div className="container">
      <div className="hm-section">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card hm-card-signin my-5">
              <div className="card-body">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  className="needs-validation"
                  action="#"
                >
                  {success && success ? (
                    <>
                      {toast("Your Redirect To Login Page...", {
                        position: "top-right",
                        hideProgressBar: false,
                        className: "bg-success text-white",
                        progress: undefined,
                        toastId: "",
                      })}
                      <ToastContainer autoClose={2000} limit={1} />
                      <Alert color="success">
                        Đăng ký thành công, đang chuyển đến trang đăng nhập
                      </Alert>
                    </>
                  ) : null}

                  {error && error ? (
                    <Alert color="danger">
                      <div>
                        Email đã được đăng ký, vui lòng nhập email khác{" "}
                      </div>
                    </Alert>
                  ) : null}

                  <div className="mb-3">
                    <Label htmlFor="useremail" className="form-label">
                      Email <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Nhập email"
                      type="email"
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
                        <div>{validation.errors.email}</div>
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label htmlFor="username" className="form-label">
                      Họ và tên <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Nhập họ và tên"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.name || ""}
                      invalid={
                        validation.touched.name && validation.errors.name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.name && validation.errors.name ? (
                      <FormFeedback type="invalid">
                        <div>{validation.errors.name}</div>
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="userpassword" className="form-label">
                      Mật khẩu <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.password || ""}
                      invalid={
                        validation.touched.password &&
                        validation.errors.password
                          ? true
                          : false
                      }
                    />
                    {validation.touched.password &&
                    validation.errors.password ? (
                      <FormFeedback type="invalid">
                        <div>{validation.errors.password}</div>
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <Label htmlFor="confirmPassword" className="form-label">
                      Nhập lại mật khẩu<span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="confirm_password"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.confirm_password || ""}
                      invalid={
                        validation.touched.confirm_password &&
                        validation.errors.confirm_password
                          ? true
                          : false
                      }
                    />
                    {validation.touched.confirm_password &&
                    validation.errors.confirm_password ? (
                      <FormFeedback type="invalid">
                        <div>{validation.errors.confirm_password}</div>
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    {/* <p className="mb-0 fs-12 text-muted fst-italic">
                      By registering you agree to the Velzon
                      <Link
                        to="#"
                        className="text-primary text-decoration-underline fst-normal fw-medium"
                      >
                        Terms of Use
                      </Link>
                    </p> */}
                  </div>

                  <div className="mt-4">
                    <button className="btn btn-secondary w-100" type="submit">
                      Đăng ký
                    </button>
                  </div>

                  {/* <div className="mt-4 text-center">
                    <div className="signin-other-title">
                      <h5 className="fs-13 mb-4 title text-muted">
                        Tạo tài khoản với
                      </h5>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-primary btn-icon waves-effect waves-light"
                      >
                        <i className="ri-facebook-fill fs-16"></i>
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-danger btn-icon waves-effect waves-light"
                      >
                        <i className="ri-google-fill fs-16"></i>
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-dark btn-icon waves-effect waves-light"
                      >
                        <i className="ri-github-fill fs-16"></i>
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-info btn-icon waves-effect waves-light"
                      >
                        <i className="ri-twitter-fill fs-16"></i>
                      </button>
                    </div>
                  </div> */}
                </Form>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Đã có tài khoản ?{" "}
                    <Link
                      to="/login"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Đăng nhập{" "}
                    </Link>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
