import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/button/Button';
import '../styles/pages/PageNotFound.scss';

const PageNotFound: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnimated, setIsAnimated] = useState(false);

  // Memoize the current pathname to prevent unnecessary re-renders
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  // Use useCallback to prevent function recreation on every render
  const handleGoHome = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleGoBack = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigate(-1);
  }, [navigate]);

  // Memoize navigation handlers for quick links
  const handleDashboardClick = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentPath !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, currentPath]);

  const handleAddShipmentClick = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentPath !== '/add-shipment') {
      navigate('/add-shipment', { replace: true });
    }
  }, [navigate, currentPath]);

  const handleActiveShipmentsClick = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentPath !== '/shipments/active') {
      navigate('/shipments/active', { replace: true });
    }
  }, [navigate, currentPath]);

  return (
    <div className="page-not-found" key="page-not-found">
      <div className="page-not-found-container">
        {/* Animated Background Elements */}
        <div className="background-elements">
          <div className="floating-box box-1"></div>
          <div className="floating-box box-2"></div>
          <div className="floating-box box-3"></div>
          <div className="floating-box box-4"></div>
        </div>

        {/* Main Content */}
        <div className={`content-wrapper ${isAnimated ? 'animated' : ''}`}>
          {/* 404 Illustration */}
          <div className="illustration-container">
            {/* Lost Truck Animation */}
            <div className="lost-truck">
              <div className="truck-container">
                <div className="truck-body">
                  <div className="truck-cab"></div>
                  <div className="truck-trailer"></div>
                </div>
                <div className="truck-wheels">
                  <div className="wheel wheel-front"></div>
                  <div className="wheel wheel-rear1"></div>
                  <div className="wheel wheel-rear2"></div>
                </div>
              </div>
              {/* Question marks around truck */}
              <div className="confusion-marks">
                <span className="question-mark q1">?</span>
                <span className="question-mark q2">?</span>
                <span className="question-mark q3">?</span>
              </div>
            </div>

            {/* 404 Text */}
            <div className="error-code">
              <span className="four">4</span>
              <span className="zero">0</span>
              <span className="four">4</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-content">
            <h1 className="main-title">Oops! Route Not Found</h1>
            <p className="subtitle">
              Looks like our delivery truck took a wrong turn! The page you're looking for doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button
              type="button"
              text="Go to Dashboard"
              className="btn primary-btn"
              onClick={handleGoHome}
            />
            <Button
              type="button"
              text="Go Back"
              className="btn secondary-btn"
              onClick={handleGoBack}
            />
          </div>

          {/* Additional Help */}
          <div className="help-section">
            <p className="help-text">
              Need help? Here are some quick links:
            </p>
            <div className="quick-links">
              <button
                type="button"
                className="link-btn"
                onClick={handleDashboardClick}
              >
                📊 Dashboard
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={handleAddShipmentClick}
              >
                📦 Add Shipment
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={handleActiveShipmentsClick}
              >
                🚚 Active Shipments
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Road */}
        <div className="decorative-road d-none">
          <div className="road-line"></div>
          <div className="road-dashes">
            <span className="dash"></span>
            <span className="dash"></span>
            <span className="dash"></span>
            <span className="dash"></span>
            <span className="dash"></span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
PageNotFound.displayName = 'PageNotFound';

export default PageNotFound;
