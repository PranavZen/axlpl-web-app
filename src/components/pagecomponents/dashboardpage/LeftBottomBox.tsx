import React from 'react'
import { Link } from 'react-router-dom'

const LeftBottomBox = () => {
  return (
    <div className="leftBottomBox box">
            <h4>Active Delivery's</h4>
            <div className="row">
              <div className="col-md-12 col-lg-6 col-6">
                <div className="btmBoxWrap">
                  <Link to="">
                    <p>Running Delivery's</p>
                    <div className="btmRowWrap">
                      <span>10</span>
                      <span className="btmArrowWrap">
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
              </div>
              <div className="col-md-12 col-lg-6 col-6">
                <div className="btmBoxWrap">
                  <Link to="">
                    <p>Running Pickup's</p>
                    <div className="btmRowWrap">
                      <span>10</span>
                      <span className="btmArrowWrap">
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
              </div>
            </div>
          </div>
  )
}

export default LeftBottomBox
