import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

const Toast: React.FC<ToastProps> = ({ position }) => {
  return <ToastContainer position={position} autoClose={3000} />;
};

export default Toast;
