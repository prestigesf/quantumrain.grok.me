import "./sentry.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.v2.jsx";
import "./app.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
