import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import Label from "../components/ui/label/Label";
import Input from "../components/ui/input/Input";
import Button from "../components/ui/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/toastUtils";
import { isAuthenticated } from "../utils/authUtils";
import { useConfig } from "../hooks";
import { InlineLogisticsLoader } from "../components/ui/spinner";
const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { fcmToken } = useConfig();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .matches(/^\d{10}$/, "Invalid mobile number")
        .required("Required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await dispatch(
          loginUser({ ...values, fcm_token: fcmToken || "" })
        );

        if (response.meta.requestStatus === 'fulfilled') {
          showSuccess("Login Successful! Welcome back.");
          navigate("/dashboard");
        } else {
          let errorMessage = "Login Failed. Please check your credentials.";

          if (response.payload) {
            if (typeof response.payload === 'string') {
              errorMessage = response.payload;
            } else if (typeof response.payload === 'object' && 'message' in response.payload) {
              errorMessage = String(response.payload.message);
            }
          } else if (error) {
            errorMessage = String(error);
          }

          // Check if the error is related to messenger role
          if (errorMessage.includes("Messenger accounts are not allowed")) {
            showError("Access Denied: Messenger accounts cannot use this application. Please contact support.");
          } else {
            showError(errorMessage);
          }
        }
      } catch (err) {
        showError("An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <section id="p_newLoginFormSection">
      <div className="container-fluid px-0">
        <div className="p_newFormRow">
          <div className="col-lg-6 col-md-8 col-12 p_newLeftSide px-0">
            <div className="p_loginInnerFormWrap">
              <h1 className="p_formTitle">Welcome</h1>
              <p className="p_formPara">Please login to your account</p>
              <form onSubmit={formik.handleSubmit} className="p_loginMainForm">
                <div className="form-floating mb-5">
                  <Input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.mobile}
                    touched={formik.touched.mobile}
                    placeHolder="User Name / Email address"
                    className="form-control"
                  />
                  <Label
                    className="form-label"
                    htmlFor="mobile"
                    text="User Name / Email address"
                  />
                </div>

                <div className="form-floating mb-4">
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
                    className="form-control"
                  />
                  <Label
                    className="form-label" htmlFor="password" text="Password" />
                </div>
                <div className="p_frgtPswdWrap">
                  <Link
                    to="/forgot-password"
                    id="to-recover"
                    className="text-dark pull-right"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="form-check myCheckbox">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label
                    className="form-check-label" htmlFor="exampleCheck1">
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
                  <Link to="" className="btn authSignUpBtn">
                    Register Now
                  </Link>
                </div>
                {error && (
                  <div className="text-danger mt-2">
                    {String(error).includes("Messenger accounts are not allowed")
                      ? "Access Denied: Messenger accounts cannot use this application."
                      : String(error)}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
