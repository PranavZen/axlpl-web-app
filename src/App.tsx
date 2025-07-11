import "bootstrap/dist/css/bootstrap.min.css";
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShipmentsPage from "../src/pages/ShipmentsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LogisticsLoader } from "./components/ui/spinner";
import { APP_CONFIG } from "./config";
import { SidebarProvider } from "./contexts/SidebarContext";
import Addresses from "./pages/Addresses";
import "./styles/global/Global.scss";
import SessionTimeoutChecker from "./components/auth/SessionTimeoutChecker";
// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AddShipment = lazy(() => import("./pages/AddShipement"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const TrackShipment = lazy(() => import("./pages/TrackShipment"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const EditShipment = lazy(() => import("./pages/EditShipment"));

const App = () => {
  return (
    <Router>
      <SidebarProvider>
      <SessionTimeoutChecker />
        <Suspense fallback={<LogisticsLoader />}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-shipment"
              element={
                <ProtectedRoute>
                  <AddShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/:shipment_status"
              element={
                <ProtectedRoute>
                  <ShipmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/addresses"
              element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-shipment"
              element={
                <ProtectedRoute>
                  <TrackShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/edit/:shipment_id"
              element={
                <ProtectedRoute>
                  <EditShipment />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
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
