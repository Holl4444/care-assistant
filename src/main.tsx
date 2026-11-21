import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
if (manifest) {
  manifest.href = window.location.pathname.startsWith("/owner")
    ? "/owner.webmanifest"
    : "/manifest.webmanifest";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
