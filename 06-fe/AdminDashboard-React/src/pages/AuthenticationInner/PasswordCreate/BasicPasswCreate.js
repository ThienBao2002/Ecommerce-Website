import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Row, Form, Input, Label, FormFeedback } from 'reactstrap';
import ParticlesAuth from '../ParticlesAuth';
import logo from "../../../assets/images/logo.png";
import { useParams } from 'react-router-dom';

//formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userForgetPasswordReset } from '../../../slices/thunks';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const BasicPasswCreate = (props) => {

    document.title = "Create New Password | Kiddo - Trang quản trị ";
    const { _id } = useParams();
    const dispatch = useDispatch();

    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setconfirmPasswordShow] = useState(false);
    const forgetErrorReset = useSelector(state => state.ForgetPassword.forgetErrorReset);
    const navigate = useNavigate();

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                // .matches(RegExp('(.*[a-z].*)'), 'At least lowercase letter')
                // .matches(RegExp('(.*[A-Z].*)'), 'At least uppercase letter')
                // .matches(RegExp('(.*[0-9].*)'), 'At least one number')
                .required("This field is required"),
            confirm_password: Yup.string()
                .oneOf(
                    [Yup.ref("password")],
                    "Both passwords need to be the same"
                )
                .required("Confirm Password Required"),

        }),
        onSubmit: (values) => {
            try {
                const reset = {
                    token: _id,
                    password: values.password,
                    confirmPassword: values.confirm_password
                };
                dispatch(userForgetPasswordReset(reset, props.history));
                console.log(forgetErrorReset);
                if (forgetErrorReset.length===0)
                    navigate(`/login`);
                else
                    toast.error(`Đã xảy ra lỗi: ${forgetErrorReset}`, { autoClose: 3000 });
            } catch (error) {
                console.error("An error occurred during password reset submission:", error);
            }
        }
    });
    return (
        <ParticlesAuth>
            <ToastContainer autoClose={2000} limit={1} />
            <div className="auth-page-content mt-lg-5">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                    <Link to="/#" className="d-inline-block auth-logo">
                                        <img src={logo} alt="" height="30" />
                                    </Link>
                                </div>
                                <p className="mt-3 fs-15 fw-medium">Thời trang trẻ em</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">

                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Tạo mật khẩu mới</h5>
                                        <p className="text-muted"></p>
                                    </div>

                                    <div className="p-2">
                                        <Form onSubmit={validation.handleSubmit} action="/auth-signin-basic">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="password-input">Mật khẩu</Label>
                                                <div className="position-relative auth-pass-inputgroup">
                                                    <Input
                                                        type={passwordShow ? "text" : "password"}
                                                        className="form-control pe-5 password-input"
                                                        placeholder="Nhập mật khẩu"
                                                        id="password-input"
                                                        name="password"
                                                        value={validation.values.password}
                                                        onBlur={validation.handleBlur}
                                                        onChange={validation.handleChange}
                                                        invalid={validation.errors.password && validation.touched.password ? true : false}
                                                    />
                                                    {validation.errors.password && validation.touched.password ? (
                                                        <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                    ) : null}
                                                    <Button color="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button"
                                                        id="password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                </div>
                                                <div id="passwordInput" className="form-text">Phải có tối thiểu 8 kí tự</div>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="confirm-password-input">Xác nhận mật khẩu</Label>
                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <Input
                                                        type={confirmPasswordShow ? "text" : "password"}
                                                        className="form-control pe-5 password-input"
                                                        placeholder="Xác nhận mật khẩu"
                                                        id="confirm-password-input"
                                                        name="confirm_password"
                                                        value={validation.values.confirm_password}
                                                        onBlur={validation.handleBlur}
                                                        onChange={validation.handleChange}
                                                        invalid={validation.errors.confirm_password && validation.touched.confirm_password ? true : false}
                                                    />
                                                    {validation.errors.confirm_password && validation.touched.confirm_password ? (
                                                        <FormFeedback type="invalid">{validation.errors.confirm_password}</FormFeedback>
                                                    ) : null}
                                                    <Button color="link" onClick={() => setconfirmPasswordShow(!confirmPasswordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button">
                                                        <i className="ri-eye-fill align-middle"></i></Button>
                                                </div>
                                            </div>

                                            {/* <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                <h5 className="fs-13">Password must contain:</h5>
                                                <p id="pass-length" className="invalid fs-12 mb-2">Minimum <b>8 characters</b></p>
                                                <p id="pass-lower" className="invalid fs-12 mb-2">At <b>lowercase</b> letter (a-z)</p>
                                                <p id="pass-upper" className="invalid fs-12 mb-2">At least <b>uppercase</b> letter (A-Z)</p>
                                                <p id="pass-number" className="invalid fs-12 mb-0">A least <b>number</b> (0-9)</p>
                                            </div> */}

                                            {/* <div className="form-check">
                                                <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                <Label className="form-check-label" htmlFor="auth-remember-check">Ghi nhớ</Label>
                                            </div> */}

                                            <div className="mt-4">
                                                <Button color="secondary" className="w-100" type="submit">Tạo mật khẩu mới</Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-4 text-center">
                                <p className="mb-0"><Link to="/auth-signin-basic" className="fw-semibold text-primary text-decoration-underline"> Đăng nhập </Link> </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ParticlesAuth>
    );
};

export default BasicPasswCreate;