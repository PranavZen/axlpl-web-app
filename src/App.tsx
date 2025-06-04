import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ToastContainer } from "react-toastify";
import { APP_CONFIG } from "./config";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style/Global.scss";
import ShipmentsPage from "../src/pages/ShipmentsPage";
import Addresses from "./pages/Addresses";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AddShipment = lazy(() => import("./pages/AddShipement"));
const EditShipment = lazy(() => import("./pages/EditShipment"));

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-shipment" element={<ProtectedRoute><AddShipment /></ProtectedRoute>} />
            <Route path="/edit-shipment/:shipmentId" element={<ProtectedRoute><EditShipment /></ProtectedRoute>} />
            <Route path="/shipments/:shipment_status" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
            <Route path="/customer/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          </Routes>
        </Suspense>
        <ToastContainer
          {...APP_CONFIG.toast}
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
        />
    </SidebarProvider>
    </Router>
  );
};

export default App;
