import React from "react";
import { TrackingStatus } from "../../../types";

interface TrackingTimelineProps {
  trackingStatus: TrackingStatus[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  trackingStatus,
}) => {
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      return {
        date: dateTimeString.split(" ")[0] || "",
        time: dateTimeString.split(" ")[1] || "",
      };
    }
  };


  if (!trackingStatus || trackingStatus.length === 0) {
    return <p className="noDataText">No tracking information available</p>;
  }

  return (
    <>
      {trackingStatus.map((status, index) => {
        const { date, time } = formatDateTime(status.date_time);
        const isLatest = index === trackingStatus.length - 1;
        const statusLower = status.status.toLowerCase();

        // Determine status class for styling
        let statusClass = "";
        if (statusLower.includes("delivered")) {
          statusClass = "delivered";
        } else if (
          statusLower.includes("transit") ||
          statusLower.includes("shipped")
        ) {
          statusClass = "transit";
        } else if (
          statusLower.includes("approved") ||
          statusLower.includes("confirmed")
        ) {
          statusClass = "approved";
        } else if (
          statusLower.includes("pending") ||
          statusLower.includes("processing")
        ) {
          statusClass = "pending";
        }

        return (
          <div
            key={index}
            className={`timelineItem ${
              isLatest ? "latest" : ""
            } ${statusClass}`}
          >
            <div className="timelineMarker">
              <div
                className="timelineIcon"
                // style={isLatest ? { animation: "pulse 2s infinite" } : {}}
              />
              {isLatest && <div className="pulse-ring"></div>}
            </div>

            <div className="timelineContent">
              <div className="timelineCard">
                <div className="timelineHeader">
                  <h6 className="timelineTitle">{status.status}</h6>
                  {isLatest && <span className="latestBadge">Latest</span>}
                </div>

                <div className="timelineMeta">
                  <div className="metaItem date">
                    <span>{date}</span>
                  </div>
                  <div className="metaItem time">
                    <span>{time}</span>
                  </div>
                  {status.location && (
                    <div className="metaItem location">
                      <span>{status.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TrackingTimeline;
