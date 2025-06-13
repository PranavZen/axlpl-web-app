import React from "react";
import { ShipmentDetails } from "../../../types";

interface ShipmentDetailsCardProps {
  data: ShipmentDetails;
}

const ShipmentDetailsCard: React.FC<ShipmentDetailsCardProps> = ({ data }) => {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `₹${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="box">
      <h4>Shipment Details - ID: {data.shipment_id}</h4>
      <div className="shipmentContent">
        <div className="row">
          {/* Package Information */}
          <div className="col-md-6 mb-4">
            <div className="infoSection">
              <h6 className="sectionTitle">Package Information</h6>

              <div className="infoList">
                <div className="infoRow">
                  <span className="infoLabel">Parcel Details:</span>
                  <span className="infoValue">{data.parcel_detail || "N/A"}</span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Number of Parcels:</span>
                  <span className="infoValue">{data.number_of_parcel || "N/A"}</span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Net Weight:</span>
                  <span className="infoValue">{data.net_weight ? `${data.net_weight} kg` : "N/A"}</span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Gross Weight:</span>
                  <span className="infoValue">{data.gross_weight ? `${data.gross_weight} kg` : "N/A"}</span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Invoice Value:</span>
                  <span className="infoValue highlight">
                    {data.invoice_value ? formatCurrency(data.invoice_value) : "N/A"}
                  </span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Expected Delivery:</span>
                  <span className="infoValue">{data.exp_date ? formatDate(data.exp_date) : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="col-md-6 mb-4">
            <div className="infoSection">
              <h6 className="sectionTitle">Service Information</h6>

              <div className="infoList">
                <div className="infoRow">
                  <span className="infoLabel">Payment Mode:</span>
                  <span className={`infoValue ${data.payment_mode?.toLowerCase() === 'prepaid' ? 'success' : 'warning'}`}>
                    {data.payment_mode || "N/A"}
                  </span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Service ID:</span>
                  <span className="infoValue">{data.service_id || "N/A"}</span>
                </div>

                <div className="infoRow">
                  <span className="infoLabel">Bill To:</span>
                  <span className="infoValue">
                    {data.bill_to === "1" ? "Sender" : data.bill_to === "2" ? "Receiver" : "N/A"}
                  </span>
                </div>

                {data.remark && (
                  <div className="infoRow">
                    <span className="infoLabel">Remarks:</span>
                    <span className="infoValue">{data.remark}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          {(data.axlpl_insurance === "1" || data.insurance_value) && (
            <div className="col-md-6 mb-4">
              <div className="infoSection">
                <h6 className="sectionTitle">Insurance Information</h6>

                <div className="infoList">
                  <div className="infoRow">
                    <span className="infoLabel">AXLPL Insurance:</span>
                    <span className={`infoValue ${data.axlpl_insurance === "1" ? "success" : "muted"}`}>
                      {data.axlpl_insurance === "1" ? "Active" : "Not Active"}
                    </span>
                  </div>

                  {data.policy_no && (
                    <div className="infoRow">
                      <span className="infoLabel">Policy Number:</span>
                      <span className="infoValue">{data.policy_no}</span>
                    </div>
                  )}

                  {data.insurance_value && (
                    <div className="infoRow">
                      <span className="infoLabel">Insurance Value:</span>
                      <span className="infoValue highlight">
                        {formatCurrency(data.insurance_value)}
                      </span>
                    </div>
                  )}

                  {data.additional_axlpl_insurance && parseFloat(data.additional_axlpl_insurance) > 0 && (
                    <div className="infoRow">
                      <span className="infoLabel">Additional Insurance:</span>
                      <span className="infoValue highlight">
                        {formatCurrency(data.additional_axlpl_insurance)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Charges Breakdown */}
          <div className="col-md-6 mb-4">
            <div className="infoSection">
              <h6 className="sectionTitle">Charges Breakdown</h6>

              <div className="chargesList">
                <div className="chargeRow">
                  <span className="chargeLabel">Shipment Charges:</span>
                  <span className="chargeValue">{formatCurrency(data.shipment_charges || "0")}</span>
                </div>

                <div className="chargeRow">
                  <span className="chargeLabel">Handling Charges:</span>
                  <span className="chargeValue">{formatCurrency(data.handling_charges || "0")}</span>
                </div>

                <div className="chargeRow">
                  <span className="chargeLabel">Insurance Charges:</span>
                  <span className="chargeValue">{formatCurrency(data.insurance_charges || "0")}</span>
                </div>

                {data.invoice_charges && parseFloat(data.invoice_charges) > 0 && (
                  <div className="chargeRow">
                    <span className="chargeLabel">Invoice Charges:</span>
                    <span className="chargeValue">{formatCurrency(data.invoice_charges)}</span>
                  </div>
                )}

                <div className="chargeRow">
                  <span className="chargeLabel">Tax:</span>
                  <span className="chargeValue">{formatCurrency(data.tax || "0")}</span>
                </div>

                <div className="chargeRow totalRow">
                  <span className="chargeLabel">Total Charges:</span>
                  <span className="chargeValue totalAmount">
                    {formatCurrency(data.total_charges || "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsCard;
