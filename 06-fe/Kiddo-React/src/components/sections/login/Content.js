import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, FormFeedback, Input, Button,Label,Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
//formik
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser, socialLogin, resetLoginFlag, startSession } from "../../../slices/thunks";
import { ToastContainer } from "react-toastify";
//đăng nhập
function Content(props) {
  const dispatch = useDispatch();
  const selectLayoutState = (state) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));
  // Inside your component
  const { user, error, loading, errorMsg } = useSelector(loginpageData);

  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (user && user) {
      console.log(user);
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.user.email;
          // eslint-disable-next-line
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? ""
          : user.user.confirm_password;
      setUserLogin({
        email: updatedUserData,
        password: "",
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "",
      password: userLogin.password || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Vui lòng nhập email"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit:async (values) => {
      await dispatch(loginUser(values, props.navigate));
      await dispatch(startSession());
      // for (let i = 0; i < sessionStorage.length; i++) {
      //   const key = sessionStorage.key(i);
      //   const value = sessionStorage.getItem(key);
      //   console.log(`Key: ${key}, Value: ${value}`);
      // }
    },
  });

  const signIn = (type) => {
    dispatch(socialLogin(type, props.navigate));
  };
// eslint-disable-next-line
  const socialResponse = (type) => {
    signIn(type);
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  return (
    <div className="container">
      <ToastContainer closeButton={false} limit={1} />
      <div className="hm-section">
        <div className="row">
          <div className="col-lg-5 col-md-7 col-sm-9 mx-auto">
            <div className="card hm-card-signin my-5">
              <div className="card-body">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  action="#"
                >
                  <div className="mb-3">
                    <Label htmlFor="email" className="form-label">
                      Email
                    </Label>
                    <Input
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
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
                        {validation.errors.email}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <div className="float-end">
                      <Link to="/forgot-password" className="text-muted">
                        Quên mật khẩu
                      </Link>
                    </div>
                    <Label className="form-label" htmlFor="password-input">
                      Mật khẩu
                    </Label>
                    <div className="position-relative auth-pass-inputgroup mb-3">
                      <Input
                        name="password"
                        value={validation.values.password || ""}
                        type={passwordShow ? "text" : "password"}
                        className="form-control pe-5"
                        placeholder="Enter Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
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
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                      <button
                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                        type="button"
                        id="password-addon"
                        onClick={() => setPasswordShow(!passwordShow)}
                      >
                        <i className="ri-eye-fill align-middle"></i>
                      </button>
                    </div>
                  </div>
{/* 
                  <div className="form-check">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="auth-remember-check"
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="auth-remember-check"
                    >
                      Lưu lại đăng nhập
                    </Label>
                  </div> */}

                  <div className="mt-4">
                    <Button
                      color="secondary"
                      disabled={error ? null : loading ? true : false}
                      className="w-100"
                      type="submit"
                    >
                      {loading ? (
                        <Spinner size="sm" className="me-2">
                          {" "}
                          Loading...{" "}
                        </Spinner>
                      ) : null}
                      Đăng nhập
                    </Button>
                  </div>

                  {/* <div className="mt-4 text-center">
                    <div className="signin-other-title">
                      <h5 className="fs-13 mb-4 title">Đăng nhập với</h5>
                    </div>
                    <div>
                      <Link
                        to="#"
                        className="btn btn-primary btn-icon me-1"
                        onClick={(e) => {
                          e.preventDefault();
                          socialResponse("facebook");
                        }}
                      >
                        <i className="ri-facebook-fill fs-16" />
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-danger btn-icon me-1"
                        onClick={(e) => {
                          e.preventDefault();
                          socialResponse("google");
                        }}
                      >
                        <i className="ri-google-fill fs-16" />
                      </Link>
                      <Button color="dark" className="btn-icon">
                        <i className="ri-github-fill fs-16"></i>
                      </Button>{" "}
                      <Button color="info" className="btn-icon">
                        <i className="ri-twitter-fill fs-16"></i>
                      </Button>
                    </div>
                  </div> */}
                </Form>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Chưa có tài khoản ?{" "}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Đăng ký{" "}
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
