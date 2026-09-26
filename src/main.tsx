import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Az elorenderelt oldalakon mar ott a HTML, azt csak eletre keltjuk.
// A tobbi utvonal (pl. /kereses) az ures spa.html-t kapja, ott sima kliens render van.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
