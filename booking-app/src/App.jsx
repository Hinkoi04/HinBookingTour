import React from "react";
import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import { Toaster } from "sonner";
import { adminRoutes } from "./admin/routes/routes";
import { clientRoutes } from "./client/routes/routes";

function AppRoutes() {
  const routes = useRoutes([
    ...clientRoutes,
    ...adminRoutes,
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return routes;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        className="app-toast-container"
        richColors
        position="top-center"
        style={{ width: "min(90vw, 480px)" }}
        toastOptions={{
          style: {
            width: "100%",
            minHeight: "72px",
            padding: "20px 24px",
            fontSize: "16px",
            borderRadius: "16px",
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
