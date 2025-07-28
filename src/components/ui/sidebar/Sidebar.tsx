import React, { useContext, useEffect, useState } from "react";
import {
  FaHome as FaHomeIconRaw,
  FaLock as FaLockIconRaw,
  FaSignOutAlt as FaSignOutAltRaw,
  FaUser as FaUserIconRaw,
} from "react-icons/fa";
import { FaTruckFast as FaTruckFastRaw } from "react-icons/fa6";
// import { IoReceiptSharp as IoReceiptSharpRaw } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SmallLogo from "../../../assets/images/axlpl_box.png";
import BigLogo from "../../../assets/images/axlplLogoImg.png";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { logoutLocal, logoutUser } from "../../../redux/slices/authSlice";
import { AppDispatch } from "../../../redux/store";
import { showError, showSuccess } from "../../../utils/toastUtils";
import "../sidebar/Sidebar.scss";
import SidebarDropdown from "./SidebarDropdown";
import SidebarLink from "./SidebarLink";
import SidebarToggleButton from "./SidebarToggleButton";
// Cast icons to JSX-compatible components
const FaHome = FaHomeIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaSignOutAlt = FaSignOutAltRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaLock = FaLockIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaTruckFast = FaTruckFastRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaUser = FaUserIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;
// const IoReceiptSharp = IoReceiptSharpRaw as React.FC<
//   React.SVGProps<SVGSVGElement>
// >;

const Sidebar = () => {
  const { isSidebarCollapsed } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // console.log("userData", userData)
  useEffect(() => {
    // Get user data from session storage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  const toggleDropdown = (menu: string | null) =>
    setDropdownOpen((prev) => (prev === menu ? null : menu));

  const handleLogout = async () => {
    try {
      // Call the logout API
      const result = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(result)) {
        // Show success toast message from API response
        const message = result.payload?.message || "Logout Successfully";
        showSuccess(message);

        // Navigate to login page after a short delay to show the toast
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // Show warning toast for API failure
        showError("Logout API failed, but you have been logged out locally");

        // Navigate to login page
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      // Fallback to local logout if API completely fails
      dispatch(logoutLocal());

      // Show error toast
      showError("Logout failed, but you have been logged out locally");

      // Navigate to login page
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <aside
      className={`d-flex ${
        !isSidebarCollapsed ? "sidebar-open" : "sidebar-collapsed"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="sidebar">
        <div className="logoWap">
          {isSidebarCollapsed ? (
            <img
              src={SmallLogo}
              alt="AXLPL Logo"
              className="img-fluid"
              loading="lazy"
            />
          ) : (
            <img
              src={BigLogo}
              alt="AXLPL Logo"
              className="img-fluid"
              loading="lazy"
            />
          )}
        </div>

        {userData && userData.Customerdetail && (
          <div
            className="user-profile"
            onClick={() => navigate("/edit-profile")}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex">
              <div className="user-avatar">
                {userData?.Customerdetail?.cust_profile_img === "0" || 
                 userData?.Customerdetail?.cust_profile_img === 0 ||
                 !userData?.Customerdetail?.cust_profile_img ? (
                  <div className="default-avatar-icon">
                    <FaUser />
                  </div>
                ) : (
                  <img
                    src={`${(userData?.Customerdetail?.path || "").replace(
                      /\/$/,
                      ""
                    )}/${(
                      userData?.Customerdetail?.cust_profile_img || ""
                    ).replace(/^\//, "")}`}
                    alt={userData?.Customerdetail?.name || "User"}
                    className="rounded-circle"
                    title="Click to edit profile"
                    onError={(e) => {
                      // Replace with SVG icon on error
                      <div className="default-avatar-icon">
                    <FaUser />
                  </div>
                    }}
                  />
                )}
              </div>
              <div className="user-info">
                <h6 className="mb-0">
                  {userData?.Customerdetail?.name || "User"}
                </h6>
                <small>
                  {userData?.Customerdetail?.email ||
                    userData?.Customerdetail?.mobile ||
                    ""}
                </small>
              </div>
            </div>
          </div>
        )}

        <ul className="list-unstyled">
          <li className="toggleBtnWrap">
            <span className="hideMenu"> Main Menu </span>
            <SidebarToggleButton />
          </li>
          <SidebarLink
            to="/dashboard"
            icon={<FaHome />}
            label="Dashboard"
            isOpen={!isSidebarCollapsed}
          />

          <SidebarDropdown
            title="Shipments"
            icon={<FaTruckFast />}
            isOpen={!isSidebarCollapsed}
            isActive={dropdownOpen === "shipments"}
            onToggle={() => toggleDropdown("shipments")}
            items={[
              { label: "Add Shipment", to: "/add-shipment" },
              { label: "Track Shipment", to: "/track-shipment" },
              { label: "Pending Shipments", to: "/shipments/pending" },
              { label: "Active Shipments", to: "/shipments/approved" },
              { label: "Hold Shipments", to: "/shipments/hold" },
              { label: "Archived Shipments", to: "/shipments/archived" },
              { label: "Address", to: "/customer/addresses" },
            ]}
          />

          {/* <SidebarDropdown
            title="Customer Details"
            icon={<FaUser />}
            isOpen={!isSidebarCollapsed}
            isActive={dropdownOpen === "customerdetails"}
            onToggle={() => toggleDropdown("customerdetails")}
            items={[{ label: "Contact", to: "/customer-contact" }]}
          /> */}

          {/* <SidebarDropdown
            title="Billing"
            icon={<IoReceiptSharp />}
            isOpen={!isSidebarCollapsed}
            isActive={dropdownOpen === "billing"}
            onToggle={() => toggleDropdown("billing")}
            items={[
              { label: "My Invoice", to: "/invoice" },
              // { label: "My Quotes", to: "/quotes" },
              // { label: "My Payment History", to: "/payment-history" },
            ]}
          /> */}
          <SidebarLink
            to="/change-password"
            icon={<FaLock />}
            label="Change Password"
            isOpen={!isSidebarCollapsed}
          />
          <li>
            <button
              onClick={handleLogout}
              className="sidebar-link d-flex align-items-center text-decoration-none w-100"
              aria-label="Logout"
              title="Logout"
            >
              <div className="iconBox">
                <FaSignOutAlt />
              </div>
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
