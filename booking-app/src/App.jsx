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
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}
