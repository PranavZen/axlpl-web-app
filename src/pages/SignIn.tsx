import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Button from "../components/ui/button/Button";
import Input from "../components/ui/input/Input";
import Label from "../components/ui/label/Label";
import { InlineLogisticsLoader } from "../components/ui/spinner";
import { useConfig } from "../hooks";
import { loginUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { isAuthenticated } from "../utils/authUtils";
import { showError, showSuccess } from "../utils/toastUtils";
import { validateMobileOrEmail, detectInputType } from "../utils/validationUtils";
import BigLogo from "../assets/images/axlplLogoImg.png";
const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { fcmToken } = useConfig();
  const [inputType, setInputType] = useState<'mobile' | 'email' | 'unknown'>('unknown');

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .test('mobile-or-email', '', function(value) {
          const { path, createError } = this;
          const validation = validateMobileOrEmail(value || '');
          
          if (!validation.isValid) {
            return createError({ path, message: validation.error });
          }
          return true;
        })
        .required("Please enter your mobile number or email address"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Please enter your password"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(
          loginUser({ ...values, fcm_token: fcmToken || "" })
        );

        if (response.meta.requestStatus === "fulfilled") {
          showSuccess("Login Successful! Welcome back.");
          navigate("/dashboard");
        } else {
          let errorMessage = "Login Failed. Please check your credentials.";

          if (response.payload) {
            if (typeof response.payload === "string") {
              errorMessage = response.payload;
            } else if (
              typeof response.payload === "object" &&
              "message" in response.payload
            ) {
              errorMessage = String(response.payload.message);
            }
          } else if (error) {
            errorMessage = String(error);
          }

          // Check if the error is related to messenger role
          if (errorMessage.includes("Messenger accounts are not allowed")) {
            showError(
              "Access Denied: Messenger accounts cannot use this application. Please contact support."
            );
          } else {
            showError(errorMessage);
          }
        }
      } catch (err) {
        showError("An unexpected error occurred. Please try again.");
      }
    },
  });

  // Update input type detection when mobile field changes
  useEffect(() => {
    setInputType(detectInputType(formik.values.mobile));
  }, [formik.values.mobile]);

  return (
    <section id="p_newLoginFormSection">
      <div className="container-fluid px-0">
        <div className="p_newFormRow">
          <div className="col-lg-8 col-md-8 col-12 p_newLeftSide px-0">
            <div className="p_loginInnerFormWrap">
              <div className="logoWrap d-flex justify-content-center mb-5">
                <img
                  src={BigLogo}
                  alt="axlpl"
                  width={300}
                  height={100}
                  className="img-fluid"
                />
              </div>
              <h1 className="p_formTitle">Welcome</h1>
              <p className="p_formPara">Please login with your mobile number or email address</p>
              <form onSubmit={formik.handleSubmit} className="p_loginMainForm">
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.mobile}
                    touched={formik.touched.mobile}
                    placeHolder={
                      inputType === 'mobile' ? 'Mobile Number' :
                      inputType === 'email' ? 'Email Address' :
                      'Mobile Number or Email Address'
                    }
                    className={`form-control ${formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}`}
                  />
                  <Label
                    className="form-label"
                    htmlFor="mobile"
                    text={
                      inputType === 'mobile' ? 'Mobile Number' :
                      inputType === 'email' ? 'Email Address' :
                      'Mobile Number or Email Address'
                    }
                  />
                  {formik.values.mobile && inputType !== 'unknown' && !formik.errors.mobile && (
                    <div className="mt-1 text-success" style={{ fontSize: '1.2rem' }}>
                      {inputType === 'mobile' ? '📱 Mobile Number' : '✉️ Email Address'} is correct
                    </div>
                  )}
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="errorText">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>

                <div className="form-floating mb-3">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                    placeHolder="Password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  />
                  <Label
                    className="form-label"
                    htmlFor="password"
                    text="Password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="errorText">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <div className="p_frgtPswdWrap">
                  {/* <Link
                    // to="/forgot-password"
                    to="/"
                    id="to-recover"
                    className="text-dark pull-right"
                  >
                    Forgot Password?
                  </Link> */}
                </div>
                <div className="form-check myCheckbox d-none">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    By selecting you are agree to our{" "}
                    <Link to="">terms of service</Link> and acknowledge our{" "}
                    <Link to="">privacy policy</Link>
                  </label>
                </div>
                <div className="p_loginFormBtnsWrap">
                  <Button
                    text={loading ? "Logging in..." : "Login"}
                    type="submit"
                    className="btn authLoginBtn"
                    disabled={loading}
                  />
                  {loading && (
                    <div className="mt-2 text-center">
                      <InlineLogisticsLoader size="sm" />
                    </div>
                  )}
                  <span className="dividerLine">or</span>
                  <Link to="/registration" className="btn authSignUpBtn">
                    Register Now
                  </Link>
                </div>
                {/* {error && (
                  <div className="text-danger mt-2">
                    {String(error).includes(
                      "Messenger accounts are not allowed"
                    )
                      ? "Access Denied: Messenger accounts cannot use this application."
                      : String(error)}
                  </div>
                )} */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
