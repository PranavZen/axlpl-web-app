import React, { useContext } from "react";
import { useSelector } from "react-redux";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import { RootState } from "../redux/store";
import { TrackingState } from "../types";
import { LogisticsLoader } from "../components/ui/spinner";
import TrackShipmentForm from "../components/pagecomponents/trackshipmentpage/TrackShipmentForm";
import TrackingTimeline from "../components/pagecomponents/trackshipmentpage/TrackingTimeline";
import AddressCard from "../components/pagecomponents/trackshipmentpage/AddressCard";
import ShipmentDetailsCard from "../components/pagecomponents/trackshipmentpage/ShipmentDetailsCard";
// import "../styles/pages/TrackShipment.scss";

const TrackShipment: React.FC = () => {
  const { isSidebarCollapsed } = useContext(SidebarContext);
  const trackingState = useSelector((state: RootState) => state.tracking) as TrackingState;
  const { trackingData, loading, error, searchedShipmentId } = trackingState;

  return (
    <section id="trackShipmentSection">
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="trackShipmentGrid">
              {/* Search Form Box */}
              <div className="searchFormBox box">
                <h4>Track Your Shipment</h4>
                <TrackShipmentForm />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loadingBox box">
                  <div className="text-center">
                    <LogisticsLoader />
                    <p className="mt-3 mb-0">Fetching tracking information...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="errorBox box">
                  <h4>Tracking Information Not Found</h4>
                  <p className="errorMessage">{error}</p>
                  <div className="errorSuggestions">
                    <p><strong>Please check:</strong></p>
                    <ul>
                      <li>Your shipment ID is correct</li>
                      <li>The shipment has been processed</li>
                      <li>Try again in a few minutes</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tracking Results */}
              {trackingData && !loading && !error && (
                <div className="trackingResultsGrid">
                  {/* Results Header */}
                  <div className="resultsHeaderBox box">
                    <div className="resultsHeader">
                      <div>
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
                    <TrackingTimeline trackingStatus={trackingData.TrackingStatus} />
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
                <div className="emptyStateBox box">
                  <div className="emptyState">
                    <div className="emptyIcon">
                      <img
                        src="https://beta.axlpl.com/admin/template/assets/images/dashboard/pickupppp.png"
                        alt="Track Shipment"
                        width="80"
                        height="80"
                      />
                    </div>
                    <h4>Ready to Track</h4>
                    <p>Enter your shipment ID above to get real-time tracking information</p>
                  </div>
                </div>
              )}
            </div>
          </MainBody>
        </section>
      </div>
    </section>
  );
};

export default TrackShipment;
