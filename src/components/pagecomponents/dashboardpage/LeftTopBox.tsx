import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../../../utils/authUtils";

const LeftTopBox = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data using the utility function
    const user = getUserData();
    setUserData(user);
    // Log user data structure to understand where the role property is
    // console.log('User data structure:', user);
  }, []);
  return (
    <div className="leftTopBox box">
      <h4>Shipments</h4>
      <div className="row">
        {userData && (
          <>
            <div className="cubeBox">
              <Link to="/add-shipment">
                <p>Add Shipment</p>
                <div className="btmWrap">
                  <span className="iconWrap">
                    <img
                      src="https://beta.axlpl.com/admin/template/assets/images/dashboard/pickupppp.png"
                      alt="Pickup"
                      className="img-fluid"
                      width="60"
                      height="60"
                    />
                  </span>
                  <span className="rightArrowWrap">
                    <img
                      src="https://beta.axlpl.com/admin/template/assets/images/dashboard/rightArrow.png"
                      alt="right arrow"
                      className="img-fluid"
                      width="12"
                      height="12"
                    />
                  </span>
                </div>
              </Link>
            </div>

            <div className="cubeBox">
              <Link to="/shipments/pending">
                <p>Show Shipment</p>
                <div className="btmWrap">
                  <span className="iconWrap">
                    <img
                      src="https://beta.axlpl.com/admin/template/assets/images/dashboard/consignment.png"
                      alt="consignment"
                      className="img-fluid"
                      width="60"
                      height="60"
                    />
                  </span>
                  <span className="rightArrowWrap">
                    <img
                      src="https://beta.axlpl.com/admin/template/assets/images/dashboard/rightArrow.png"
                      alt="right arrow"
                      className="img-fluid"
                      width="12"
                      height="12"
                    />
                  </span>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftTopBox;
