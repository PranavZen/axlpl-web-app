import React from "react";
import { SenderData, ReceiverData } from "../../../types";

interface AddressCardProps {
  title: string;
  type: "sender" | "receiver";
  data: SenderData | ReceiverData;
}

const AddressCard: React.FC<AddressCardProps> = ({ title, type, data }) => {
  const isSender = type === "sender";
  const senderData = data as SenderData;
  const receiverData = data as ReceiverData;

  const name = isSender ? senderData.sender_name : receiverData.receiver_name;
  const companyName = data.company_name;
  const mobile = data.mobile;
  const address1 = data.address1;
  const address2 = data.address2;
  const state = data.state;
  const city = data.city;
  const area = data.area;
  const pincode = data.pincode;

  return (
    <div className="address-card">
      <div className="card-header">
        {/* <div className="header-icon">
          <div className={`card-icon ${type}`}></div>
        </div> */}
        <div className="header-content">
          <h3>{title}</h3>
          {/* <span className={`card-type-badge ${type}`}>
            {type === "sender" ? "From" : "To"}
          </span> */}
        </div>
      </div>

      <div className="card-body">
        <div className="addressContent">
          {/* Contact Information */}
          <div className="contactInfo">
            <div className={`info-item ${name ? "" : ""}`}>
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="info-content">
                <label>Name</label>
                <div className="info-value">{name || "N/A"}</div>
              </div>
            </div>

            {companyName && (
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                  </svg>
                </div>
                <div className="info-content">
                  <label>Company</label>
                  <div className="info-value">{companyName}</div>
                </div>
              </div>
            )}

            <div className="info-item">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div className="info-content">
                <label>Mobile</label>
                <div className="info-value">{mobile || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="addressInfo">
            <div className="address-header">
              <div className="address-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4>Address Details</h4>
            </div>

            <div className="address-content">
              {address1 && (
                <div className="address-line">
                  <span>{address1}</span>
                </div>
              )}

              {address2 && address2 !== address1 && (
                <div className="address-line">
                  <span>{address2}</span>
                </div>
              )}

              <div className="location-details">
                <div className="location-row">
                  {area && (
                    <div className="location-item">
                      <label>Area</label>
                      <span>{area}</span>
                    </div>
                  )}
                  {city && (
                    <div className="location-item">
                      <label>City</label>
                      <span>{city}</span>
                    </div>
                  )}
                </div>
                <div className="location-row">
                  {state && (
                    <div className="location-item">
                      <label>State</label>
                      <span>{state}</span>
                    </div>
                  )}
                  {pincode && (
                    <div className="location-item">
                      <label>Pincode</label>
                      <span>{pincode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
