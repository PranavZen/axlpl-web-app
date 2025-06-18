import React, { useContext } from "react";
import { useSelector } from "react-redux";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import { RootState } from "../redux/store";
import { TrackingState } from "../types";
import { getUserData } from "../utils/authUtils";

import TrackShipmentForm from "../components/pagecomponents/trackshipmentpage/TrackShipmentForm";
import TrackingTimeline from "../components/pagecomponents/trackshipmentpage/TrackingTimeline";
import AddressCard from "../components/pagecomponents/trackshipmentpage/AddressCard";
import ShipmentDetailsCard from "../components/pagecomponents/trackshipmentpage/ShipmentDetailsCard";
import SecurityNotice from "../components/ui/security/SecurityNotice";
import AuthGuard from "../components/guards/AuthGuard";
import "../styles/pages/TrackShipment.scss";
import "../components/guards/AuthGuard.scss";

const TrackShipment: React.FC = () => {
  const { isSidebarCollapsed } = useContext(SidebarContext);
  const trackingState = useSelector((state: RootState) => state.tracking) as TrackingState;
  const { trackingData, loading, error, searchedShipmentId } = trackingState;

  // Get current user information for personalized messages
  const userData = getUserData();
  const userName = userData?.Customerdetail?.name || userData?.Customerdetail?.company_name || "User";

  return (
    <AuthGuard
      requireAuth={true}
      redirectTo="/"
      allowedRoles={['customer', 'admin', 'user']} // Exclude messenger roles
      showLoadingSpinner={true}
    >
      <section id="trackShipmentSection">
        <div className="container-fluid p-0">
          <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar />
            <MainBody>
            <div className="trackShipmentGrid">
              {/* Security Notice */}
              <SecurityNotice
                type="info"
                title="Secure Shipment Tracking"
                message="For your privacy and security, you can only track shipments that belong to your account. This ensures your shipment data remains confidential."
                showUserInfo={true}
                className="security-notice--compact d-none"
              />

              {/* Search Form Box */}
              <div className="searchFormBox">
                <h4>Track Your Shipment - {userName}</h4>
                <TrackShipmentForm />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loadingBox">
                  <div className="loading-content">
                    <div className="loading-icon"></div>
                    <p>Fetching tracking information...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <>
                  {/* Show security notice for authorization errors */}
                  {(error.includes("not authorized") || error.includes("Access denied") || error.includes("permission")) && (
                    <SecurityNotice
                      type="warning"
                      title="Access Restricted"
                      message="You can only track shipments that belong to your account. Please verify the shipment ID and ensure you're logged in with the correct account."
                      showUserInfo={true}
                    />
                  )}

                  <div className="errorBox">
                    <div className="error-header">
                      <h4>
                        {error.includes("not authorized") || error.includes("Access denied")
                          ? "Access Denied"
                          : "Tracking Information Not Found"
                        }
                      </h4>
                    </div>
                    <div className="error-content">
                      <p className="errorMessage">{error}</p>
                      <div className="errorSuggestions">
                        <p><strong>Please check:</strong></p>
                        <ul>
                          <li>Your shipment ID is correct and belongs to your account</li>
                          <li>The shipment has been processed and is in the system</li>
                          <li>You are logged in with the correct account</li>
                          <li>You have permission to access this shipment</li>
                          <li>Try again in a few minutes if the issue persists</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tracking Results */}
              {trackingData && !loading && !error && (
                <div className="trackingResultsGrid">
                  {/* Success Security Notice */}
                  <SecurityNotice
                    type="success"
                    title="Shipment Access Verified"
                    message={`Successfully retrieved tracking information for shipment ${searchedShipmentId}. This shipment belongs to your account and you have full access to its details.`}
                    showUserInfo={false}
                    className="security-notice--compact d-none"
                  />

                  {/* Results Header */}
                  <div className="resultsHeaderBox">
                    <div className="resultsHeader">
                      <div className="header-content">
                        <h4>Tracking Results</h4>
                        <p className="shipmentIdText">Shipment ID: {searchedShipmentId}</p>
                      </div>
                      {trackingData.TrackingStatus && trackingData.TrackingStatus.length > 0 && (
                        <div className="statusBadge">
                          <span className={`status ${trackingData.TrackingStatus[trackingData.TrackingStatus.length - 1].status.toLowerCase()}`}>
                            {trackingData.TrackingStatus[trackingData.TrackingStatus.length - 1].status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="timelineBox">
                    <div className="timelineContainer">
                      <div className="timeline-header">
                        <h3>Shipment Journey</h3>
                      </div>
                      <div className="timeline-content">
                        <TrackingTimeline trackingStatus={trackingData.TrackingStatus} />
                      </div>
                    </div>
                  </div>

                  {/* Sender Details */}
                  {trackingData.SenderData && (
                    <div className="senderBox">
                      <AddressCard
                        title="Sender Details"
                        type="sender"
                        data={trackingData.SenderData}
                      />
                    </div>
                  )}

                  {/* Receiver Details */}
                  {trackingData.ReceiverData && (
                    <div className="receiverBox">
                      <AddressCard
                        title="Receiver Details"
                        type="receiver"
                        data={trackingData.ReceiverData}
                      />
                    </div>
                  )}

                  {/* Shipment Details */}
                  {trackingData.ShipmentDetails && (
                    <div className="shipmentBox">
                      <ShipmentDetailsCard data={trackingData.ShipmentDetails} />
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!trackingData && !loading && !error && (
                <div className="emptyStateBox">
                  <div className="emptyState">
                    <div className="emptyIcon">
                      <img
                        src="https://beta.axlpl.com/admin/template/assets/images/dashboard/pickupppp.png"
                        alt="Track Shipment"
                        width="80"
                        height="80"
                      />
                    </div>
                    <h4>Ready to Track, {userName}!</h4>
                    <p>Enter your shipment ID above to get real-time tracking information for shipments belonging to your account</p>
                  </div>
                </div>
              )}
            </div>
          </MainBody>
        </section>
      </div>
    </section>
    </AuthGuard>
  );
};

export default TrackShipment;
