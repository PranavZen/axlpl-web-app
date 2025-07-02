import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { logoutLocal } from "../../redux/slices/authSlice";

const SessionTimeoutChecker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

  const handleSessionTimeout = useCallback(() => {
    sessionStorage.removeItem("user"); // clear session
    Swal.fire({
      title: "Session Expired",
      text: "You have been inactive for 15 minutes. Would you like to continue your session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Login Again",
      cancelButtonText: "Exit",
      customClass: {
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      } else {
        dispatch(logoutLocal());
        navigate("/dashboard");
      }
    });
  }, [navigate, dispatch]);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const user = sessionStorage.getItem("user");
      //   console.log("sessionStorage.getItemuser", sessionStorage.getItem("user"));
      if (user) {
        handleSessionTimeout();
      }
    }, INACTIVITY_LIMIT);
  }, [handleSessionTimeout, INACTIVITY_LIMIT]);

  useEffect(() => {
    resetInactivityTimer();

    // List of events to track
    const events = ["mousemove", "keydown", "click", "scroll"];

    // Reset timer on user activity
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  return null;
};

export default SessionTimeoutChecker;
