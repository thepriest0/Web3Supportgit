import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Polyfill for process object in browser environment
if (typeof global === 'undefined') {
  (window as any).global = window;
}
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

createRoot(document.getElementById("root")!).render(<App />);
