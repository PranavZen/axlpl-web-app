import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReceiverData, SenderData, ShipmentDetails } from "../../../types";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchServiceTypes } from "../../../redux/slices/serviceTypeSlice";

interface ShipmentDetailsCardProps {
  data: ShipmentDetails;
  senderData : SenderData;
  receiverData : ReceiverData;
}

const ShipmentDetailsCard: React.FC<ShipmentDetailsCardProps> = ({ data , senderData , receiverData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceTypes, loading: serviceTypesLoading } = useSelector((state: RootState) => state.serviceType);

  useEffect(() => {
    if (serviceTypes.length === 0 && !serviceTypesLoading) {
      dispatch(fetchServiceTypes());
    }
  }, [dispatch, serviceTypes.length, serviceTypesLoading]);

  const getServiceName = (serviceId: string): string => {
    if (serviceTypesLoading) {
      return "Loading...";
    }
    const service = serviceTypes.find(service => service.id === serviceId);
    return service ? service.name : serviceId || "N/A";
  };

  // console.log("data", data);
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `₹${num.toFixed(2)}`;
  };

  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: 'short',
  //       day: 'numeric'
  //     });
  //   } catch (error) {
  //     return dateString;
  //   }
  // };

  return (
    <div className="shipment-details-card">
      <div className="card-header">
        <div className="header-icon">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
            </svg>
          </div>
        </div>
        <div className="header-content">
          <h3>Shipment Details</h3>
          <span className="shipment-id-badge">ID: {data.shipment_id}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="shipmentContent">
          {/* Package Information */}
          <div className="details-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h4>Package Information</h4>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label>Parcel Details</label>
                <span>{data.parcel_detail || "N/A"}</span>
              </div>

              <div className="detail-item">
                <label>Number of Parcels</label>
                <span>{data.number_of_parcel || "N/A"}</span>
              </div>

              <div className="detail-item">
                <label>Net Weight</label>
                <span>
                  {data.net_weight ? `${data.net_weight} gms` : "N/A"}
                </span>
              </div>

              <div className="detail-item">
                <label>Gross Weight</label>
                <span>
                  {data.gross_weight ? `${data.gross_weight} gms` : "N/A"}
                </span>
              </div>

              <div className="detail-item">
                <label>Invoice Value</label>
                <span className="highlight">
                  {data.invoice_value
                    ? formatCurrency(data.invoice_value)
                    : "N/A"}
                </span>
              </div>

              <div className="detail-item">
                <label>Invoice Number</label>
                <span className="highlight">{data.invoice_number}</span>
              </div>

              {/* <div className="detail-item">
                <label>Expected Delivery</label>
                <span>{data.exp_date ? formatDate(data.exp_date) : "N/A"}</span>
              </div> */}
            </div>
          </div>

          {/* Service Information */}
          <div className="details-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h4>Service Information</h4>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label>Payment Mode</label>
                <span
                  className={`payment-mode ${
                    data.payment_mode?.toLowerCase() === "prepaid"
                      ? "prepaid"
                      : "cod"
                  }`}
                >
                  {data.payment_mode || "N/A"}
                </span>
              </div>

              <div className="detail-item">
                <label>Service Type</label>
                <span>{getServiceName(data.service_id)}</span>
              </div>

              <div className="detail-item">
                <label>Bill To</label>
                <span>
                  {data.bill_to === "0" || data.bill_to === "1"
                    ? senderData.sender_name
                    : data.bill_to === "2"
                    ? receiverData.receiver_name
                    : "N/A"}
                </span>
              </div>

              {data.remark && (
                <div className="detail-item full-width">
                  <label>Remarks</label>
                  <span>{data.remark}</span>
                </div>
              )}
            </div>
          </div>

          {/* Insurance Information */}
          {(data.axlpl_insurance === "1" || data.insurance_value) && (
            <div className="details-section">
              <div className="section-header">
                <div className="section-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
                  </svg>
                </div>
                <h4>Insurance Information</h4>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>AXLPL Insurance</label>
                  <span
                    className={`insurance-status ${
                      data.axlpl_insurance === "1" ? "active" : "inactive"
                    }`}
                  >
                    {data.axlpl_insurance === "1" ? "Active" : "Not Active"}
                  </span>
                </div>

                {data.policy_no && (
                  <div className="detail-item">
                    <label>Policy Number</label>
                    <span>{data.policy_no}</span>
                  </div>
                )}

                {data.insurance_value && (
                  <div className="detail-item">
                    <label>Insurance Value</label>
                    <span className="highlight">
                      {formatCurrency(data.insurance_value)}
                    </span>
                  </div>
                )}

                {data.additional_axlpl_insurance &&
                  parseFloat(data.additional_axlpl_insurance) > 0 && (
                    <div className="detail-item">
                      <label>Additional Insurance</label>
                      <span className="highlight">
                        {formatCurrency(data.additional_axlpl_insurance)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Charges Breakdown */}
          <div className="details-section charges-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
                </svg>
              </div>
              <h4>Charges Details</h4>
            </div>

            <div className="charges-grid">
              <div className="charge-item">
                <label>Shipment Charges</label>
                <span>{formatCurrency(data.shipment_charges || "0")}</span>
              </div>

              <div className="charge-item">
                <label>Handling Charges</label>
                <span>{formatCurrency(data.handling_charges || "0")}</span>
              </div>

              <div className="charge-item">
                <label>Insurance Charges</label>
                <span>{formatCurrency(data.insurance_charges || "0")}</span>
              </div>

              {data.invoice_charges && parseFloat(data.invoice_charges) > 0 && (
                <div className="charge-item">
                  <label>Invoice Charges</label>
                  <span>{formatCurrency(data.invoice_charges)}</span>
                </div>
              )}

              <div className="charge-item">
                <label>Tax</label>
                <span>{formatCurrency(data.tax || "0")}</span>
              </div>

              <div className="charge-item d-none">
                <label>GST</label>
                <span>{formatCurrency(data.gst || "0")}</span>
              </div>

              <div className="charge-item total">
                <label>Total Charges</label>
                <span className="total-amount">
                  {formatCurrency(data.total_charges || "0")}
                </span>
              </div>
              <div className="charge-item total gTotal">
                <label>Grand Total</label>
                <span className="total-amount">
                  {formatCurrency((data.grand_total ?? "0").toString())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsCard;
