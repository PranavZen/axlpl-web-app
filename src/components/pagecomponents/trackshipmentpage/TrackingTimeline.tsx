import React from "react";
import { TrackingStatus } from "../../../types";

interface TrackingTimelineProps {
  trackingStatus: TrackingStatus[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ trackingStatus }) => {
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      return {
        date: dateTimeString.split(' ')[0] || '',
        time: dateTimeString.split(' ')[1] || ''
      };
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('delivered')) {
      return <i className="fas fa-check-circle text-success"></i>;
    } else if (statusLower.includes('transit') || statusLower.includes('shipped')) {
      return <i className="fas fa-truck text-info"></i>;
    } else if (statusLower.includes('approved') || statusLower.includes('confirmed')) {
      return <i className="fas fa-check text-success"></i>;
    } else if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return <i className="fas fa-clock text-warning"></i>;
    } else {
      return <i className="fas fa-circle text-muted"></i>;
    }
  };



  if (!trackingStatus || trackingStatus.length === 0) {
    return (
      <div className="box">
        <h4>Tracking Timeline</h4>
        <p className="noDataText">No tracking information available</p>
      </div>
    );
  }

  return (
    <div className="box">
      <h4>Tracking Timeline</h4>
      <div className="timelineContainer">
        {trackingStatus.map((status, index) => {
          const { date, time } = formatDateTime(status.date_time);
          const isLatest = index === trackingStatus.length - 1;

          return (
            <div key={index} className={`timelineItem ${isLatest ? 'latest' : ''}`}>
              <div className="timelineMarker">
                <div className="timelineIcon">
                  {getStatusIcon(status.status)}
                </div>
              </div>

              <div className="timelineContent">
                <div className="timelineCard">
                  <div className="timelineHeader">
                    <h6 className="timelineTitle">
                      {status.status}
                      {isLatest && (
                        <span className="latestBadge">Latest</span>
                      )}
                    </h6>
                  </div>

                  <div className="timelineMeta">
                    <div className="metaItem">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{date}</span>
                    </div>
                    <div className="metaItem">
                      <i className="fas fa-clock"></i>
                      <span>{time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;
