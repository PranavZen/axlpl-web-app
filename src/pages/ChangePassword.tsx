import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import Label from "../components/ui/label/Label";
import Input from "../components/ui/input/Input";
import Button from "../components/ui/button/Button";
import { SidebarContext } from "../contexts/SidebarContext";
import { AppDispatch, RootState } from "../redux/store";
import {
  changePassword,
  clearChangePasswordState,
  selectChangePasswordLoading,
  selectChangePasswordError,
  selectChangePasswordSuccess,
} from "../redux/slices/changePasswordSlice";
import { showSuccess, showError } from "../utils/toastUtils";
import { isAuthenticated } from "../utils/authUtils";
import "../styles/pages/ChangePassword.scss";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarCollapsed } = useContext(SidebarContext);

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // Get change password state from Redux store
  const loading = useSelector(selectChangePasswordLoading);
  const error = useSelector(selectChangePasswordError);
  const success = useSelector(selectChangePasswordSuccess);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  // Handle success/error states
  useEffect(() => {
    if (success) {
      showSuccess("Password changed successfully!");
      dispatch(clearChangePasswordState());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearChangePasswordState());
    }
  }, [error, dispatch]);

  // Form validation schema
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .notOneOf([Yup.ref("currentPassword")], "New password must be different from current password")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword")], "Confirm password does not match the new password"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        // Get user ID and role from user data
        const userId = user?.Customerdetail?.id || user?.id || "";
        const userRole = user?.Customerdetail?.role || user?.role || "";
        const userToken = user?.Customerdetail?.token || user?.token || "";

        console.log('🔄 Change Password - User data:', {
          userId: userId ? '***' + userId.slice(-4) : 'missing',
          userRole,
          hasToken: !!userToken
        });

        if (!userId || !userRole) {
          showError("User information not found. Please login again.");
          return;
        }

        if (!userToken) {
          showError("Authentication token not found. Please login again.");
          return;
        }

        await dispatch(
          changePassword({
            id: userId,
            old_password: values.currentPassword,
            new_password: values.newPassword,
            user_type: userRole,
          })
        ).unwrap();

        // Reset form on successful password change
        formik.resetForm();
      } catch (error: any) {
        // Error is handled in useEffect
        console.error("Change password error:", error);
      }
    },
  });

  return (
    <div className="container-fluid p-0">
      <section className={`bodyWrap ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar />
        <MainBody>
          <div className="change-password-container">
            {/* Header */}
            <div className="password-header">
              <h1>Change Password</h1>
              <p>Update your account password for better security</p>
            </div>

            {/* Form */}
            <div className="password-form">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-lock me-2"></i>
                    Password Settings
                  </h3>
                </div>
                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row flex-column justify-content-center align-items-center">
                      {/* Current Password */}
                      <div className="col-md-6 col-12 mb-4">
                        <Label
                          htmlFor="currentPassword"
                          text="Current Password *"
                          className="form-label"
                        />
                        <Input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formik.values.currentPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.currentPassword}
                          touched={formik.touched.currentPassword}
                          placeHolder="Enter your current password"
                          className="form-control innerFormControll"
                          disabled={loading}
                        />
                      </div>

                      {/* New Password */}
                      <div className="col-md-6 col-12 mb-4">
                        <Label
                          htmlFor="newPassword"
                          text="New Password *"
                          className="form-label"
                        />
                        <Input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.newPassword}
                          touched={formik.touched.newPassword}
                          placeHolder="Enter your new password"
                          className="form-control innerFormControll"
                          disabled={loading}
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="col-md-6 col-12 mb-4">
                        <Label
                          htmlFor="confirmPassword"
                          text="Confirm New Password *"
                          className="form-label"
                        />
                        <Input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.confirmPassword}
                          touched={formik.touched.confirmPassword}
                          placeHolder="Confirm your new password"
                          className="form-control innerFormControll"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                      <Button
                        type="button"
                        text="Cancel"
                        onClick={() => navigate("/dashboard")}
                        className="btn btn-secondary me-3"
                        disabled={loading}
                      />
                      <Button
                        type="submit"
                        text={loading ? "Changing Password..." : "Change Password"}
                        className="btn btn-primary"
                        disabled={loading || !formik.isValid}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </MainBody>
      </section>
    </div>
  );
};

export default ChangePassword;
