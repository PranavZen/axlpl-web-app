import React from "react";
import { getUserData } from "../../../utils/authUtils";
import "./SecurityNotice.scss";

interface SecurityNoticeProps {
  type?: "info" | "warning" | "success";
  title?: string;
  message?: string;
  showUserInfo?: boolean;
  className?: string;
}

const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  type = "info",
  title = "Security Notice",
  message,
  showUserInfo = true,
  className = ""
}) => {
  const userData = getUserData();
  const userName = userData?.Customerdetail?.name || userData?.Customerdetail?.company_name || "User";
  const userEmail = userData?.Customerdetail?.email || "";

  const getIcon = () => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      default:
        return "🔒";
    }
  };

  const defaultMessage = showUserInfo 
    ? `You can only access shipments that belong to your account (${userName}). This ensures your data privacy and security.`
    : "Access is restricted to authorized users only.";

  return (
    <div className={`security-notice security-notice--${type} ${className}`}>
      <div className="security-notice__header">
        <div className="security-notice__icon">
          {getIcon()}
        </div>
        <div className="security-notice__title">
          {title}
        </div>
      </div>
      
      <div className="security-notice__content">
        <p className="security-notice__message">
          {message || defaultMessage}
        </p>
        
        {showUserInfo && (
          <div className="security-notice__user-info">
            <div className="user-info__item">
              <span className="user-info__label">Logged in as:</span>
              <span className="user-info__value">{userName}</span>
            </div>
            {userEmail && (
              <div className="user-info__item">
                <span className="user-info__label">Email:</span>
                <span className="user-info__value">{userEmail}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityNotice;
