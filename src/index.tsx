import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { restoreUser } from "./redux/slices/authSlice";
import { isAuthenticated } from "./utils/authUtils";

// Restore user data from sessionStorage on app startup
if (isAuthenticated()) {
  store.dispatch(restoreUser());
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
