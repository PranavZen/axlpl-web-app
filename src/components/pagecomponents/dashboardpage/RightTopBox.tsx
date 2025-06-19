import React, { useEffect, useState } from 'react';
import { getUserData } from '../../../utils/authUtils';

const RightTopBox = () => {
  const [userData, setUserData] = useState<any>(null);

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
                <div className="profBox">
                  <span>
                    <img
                      src="https://beta.axlpl.com/admin/template/assets/images/dashboard/profImg.png"
                      alt="profile pic"
                      className="img-fluid"
                    />
                  </span>
                  <p>{userData?.Customerdetail?.name || 'User'}</p>
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
  )
}

export default RightTopBox
