import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ToastContainer } from "react-toastify";
import { APP_CONFIG } from "./config";
import { LogisticsLoader } from "./components/ui/spinner";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global/Global.scss";
import ShipmentsPage from "../src/pages/ShipmentsPage";
import Addresses from "./pages/Addresses";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AddShipment = lazy(() => import("./pages/AddShipement"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <Suspense fallback={<LogisticsLoader />}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-shipment" element={<ProtectedRoute><AddShipment /></ProtectedRoute>} />
            <Route path="/shipments/:shipment_status" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
            <Route path="/customer/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
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
