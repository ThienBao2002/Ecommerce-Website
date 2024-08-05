import React from "react";
import {  Alert, Card, CardBody, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../../slices/thunks";

import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";

const Content = props => {
    const dispatch = useDispatch();

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
        }),
        onSubmit: (values) => {
            console.log(values);
            dispatch(userForgetPassword(values, props.history));
        }
    });

    const selectLayoutState = (state) => state.ForgetPassword;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (state) => ({
            forgetError: state.forgetError,
            forgetSuccessMsg: state.forgetSuccessMsg,
        })
    );
    const {
        forgetError, forgetSuccessMsg
    } = useSelector(selectLayoutProperties);

    document.title = "Reset Password | Kiddo - Trang quản trị ";
    return (
        <>
            <ToastContainer autoClose={2000} limit={1} />
            <div className="container">
                <div className="hm-section">
                    <div className="row">
                        <div className="col-lg-5 col-md-7 col-sm-9 mx-auto">
                            <div className="card hm-card-signin my-5">
                                <div className="card-body">
                                    <Card className="mt-4">

                                        <CardBody className="p-4">
                                            <div className="text-center mt-2">
                                                <h5 className="text-primary">Quên mật khẩu ?</h5>
                                                <p className="text-muted">Thiết lập lại mật khẩu tài khoản khách hàng</p>

                                                <lord-icon
                                                    src="https://cdn.lordicon.com/rhvddzym.json"
                                                    trigger="loop"
                                                    colors="primary:#0ab39c"
                                                    className="avatar-xl"
                                                    style={{ width: "120px", height: "120px" }}
                                                >
                                                </lord-icon>

                                            </div>

                                            <Alert className="border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                                Đăng nhập vào email để nhận hướng dẫn thiết lập mật khẩu mới!
                                            </Alert>
                                            <div className="p-2">
                                                {forgetError && forgetError && !forgetSuccessMsg && (
                                                    <Alert color="danger" style={{ marginTop: "13px" }}>
                                                        {forgetError}
                                                    </Alert>
                                                )}
                                                {forgetSuccessMsg && !forgetError && !forgetError && (
                                                    <Alert color="success" style={{ marginTop: "13px" }}>
                                                        {forgetSuccessMsg}
                                                    </Alert>
                                                )}
                                                <Form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                    }}
                                                >
                                                    <div className="mb-4">
                                                        <Label className="form-label">Email</Label>
                                                        <Input
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Nhập email"
                                                            type="email"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.email || ""}
                                                            invalid={
                                                                validation.touched.email && validation.errors.email ? true : false
                                                            }
                                                        />
                                                        {validation.touched.email && validation.errors.email ? (
                                                            <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="text-center mt-4">
                                                        <button className="btn btn-success w-100" type="submit">Gửi</button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <div className="mt-4 text-center">
                                        <p className="mb-0"><Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Đăng nhập </Link> </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Content;
