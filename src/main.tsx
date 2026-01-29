import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routing } from "./Components/LayoutArea/Routing/Routing";

import { Provider } from "react-redux";
import { store } from "./Redux/Store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routing />
        <ToastContainer position="top-right" autoClose={2500} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);




