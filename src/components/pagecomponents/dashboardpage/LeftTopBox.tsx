import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../../../utils/authUtils";
import shipmentTracking from "../../../assets/images/shipment-tracking.png";
import pickup from "../../../assets/images/pickupppp.png";
import consignment from "../../../assets/images/consignment.png";
import rightArrow from "../../../assets/images/rightArrow.png";
const LeftTopBox = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data using the utility function
    const user = getUserData();
    setUserData(user);
  }, []);
  return (
    <div className="leftTopBox box">
      <h4>Shipments</h4>
      <div className="row">
        {userData && (
          <>
            <div className=" col-md-12 col-lg-4 col-12">
              <div className="cubeBox">
                <Link to="/add-shipment">
                  <p>Add Shipment</p>
                  <div className="btmWrap">
                    <span className="iconWrap">
                      <img
                        src={pickup}
                        alt="Pickup"
                        className="img-fluid"
                        width="60"
                        height="60"
                      />
                    </span>
                    <span className="rightArrowWrap">
                      <img
                        src={rightArrow}
                        alt="right arrow"
                        className="img-fluid"
                        width="12"
                        height="12"
                      />
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            <div className=" col-md-12 col-lg-4 col-12">
              <div className="cubeBox">
                <Link to="/shipments/approved">
                  <p>Show Shipment</p>
                  <div className="btmWrap">
                    <span className="iconWrap">
                      <img
                        src={consignment}
                        alt="consignment"
                        className="img-fluid"
                        width="60"
                        height="60"
                      />
                    </span>
                    <span className="rightArrowWrap">
                      <img
                        src={rightArrow}
                        alt="right arrow"
                        className="img-fluid"
                        width="12"
                        height="12"
                      />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
            <div className=" col-md-12 col-lg-4 col-12">
              <div className="cubeBox">
                <Link to="/track-shipment">
                  <p>Track Shipment</p>
                  <div className="btmWrap">
                    <span className="iconWrap">
                      <img
                        src={shipmentTracking}
                        alt="shipment-tracking"
                        className="img-fluid"
                        width="60"
                        height="60"
                      />
                    </span>
                    <span className="rightArrowWrap">
                      <img
                        src={rightArrow}
                        alt="right arrow"
                        className="img-fluid"
                        width="12"
                        height="12"
                      />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftTopBox;
