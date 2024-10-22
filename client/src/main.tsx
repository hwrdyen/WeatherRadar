import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <SnackbarProvider autoHideDuration={1000}>
        <App />
      </SnackbarProvider>
    </AuthContextProvider>
  </StrictMode>
);
