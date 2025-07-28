import React, { useEffect, useState } from "react";
import { getUserData } from "../../../utils/authUtils";
import { useNavigate } from "react-router-dom";

const RightTopBox = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Get user data using the utility function
    const user = getUserData();
    setUserData(user);
  }, []);

  return (
    <div className="rightTopBox box">
      <h4>Profile</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="profBox" onClick={() => navigate("/edit-profile")}>
            <span>
              <img
                src={`${(userData?.Customerdetail?.path || "").replace(
                  /\/$/,
                  ""
                )}/${(userData?.Customerdetail?.cust_profile_img || "").replace(
                  /^\//,
                  ""
                )}`}
                alt={userData?.Customerdetail?.name || "User"}
                className="rounded-circle"
                title="profile img"
                // onError={(e) =>
                //   (e.currentTarget.src =
                //     "https://beta.axlpl.com/admin/template/assets/images/dashboard/profImg.png")
                // } // fallback path
              />
            </span>
            <p>{userData?.Customerdetail?.name || "User"}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-12">
          <div className="profRateBox">
            <p>Rating</p>
            <span>4.5</span>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="profRateBox">
            <p>Delivery’s</p>
            <span>110</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightTopBox;
