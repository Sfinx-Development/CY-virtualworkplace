// index.tsx

import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Navigation from "./navigation";
import store from "./slices/store";
import { theme1 } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme1}>
        <BrowserRouter>
          {" "}
          {/* Use BrowserRouter here */}
          <Navigation />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
