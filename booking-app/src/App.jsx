import React from "react";
import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import { Toaster } from "sonner";
import { adminRoutes } from "./admin/routes/routes";

function AppRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/admin" replace />,
    },
    ...adminRoutes,
    {
      path: "*",
      element: <Navigate to="/admin" replace />,
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
