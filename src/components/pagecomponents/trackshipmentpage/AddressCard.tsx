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
    <div className="box">
      <h4>{title}</h4>
      <div className="addressContent">
        {/* Contact Information */}
        <div className="contactInfo">
          <div className="infoRow">
            <span className="infoLabel">Name:</span>
            <span className="infoValue">{name || "N/A"}</span>
          </div>

          {companyName && (
            <div className="infoRow">
              <span className="infoLabel">Company:</span>
              <span className="infoValue">{companyName}</span>
            </div>
          )}

          <div className="infoRow">
            <span className="infoLabel">Mobile:</span>
            <span className="infoValue">{mobile || "N/A"}</span>
          </div>
        </div>

        {/* Address Information */}
        <div className="addressInfo">
          <div className="addressHeader">
            <strong>Address Details</strong>
          </div>

          <div className="addressDetails">
            {address1 && (
              <div className="addressLine">{address1}</div>
            )}

            {address2 && address2 !== address1 && (
              <div className="addressLine">{address2}</div>
            )}

            <div className="locationInfo">
              {area && <span className="locationItem">Area: {area}</span>}
              {city && <span className="locationItem">City: {city}</span>}
              {state && <span className="locationItem">State: {state}</span>}
              {pincode && <span className="locationItem">Pincode: {pincode}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
