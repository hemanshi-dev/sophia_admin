import React from "react";
import ReactDOM from "react-dom/client";
import "./jquery-global";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./assets/css/bootstrap.min.css";
import "./assets/css/theme.min.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "feather-icons/dist/feather.js";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
);

reportWebVitals();
