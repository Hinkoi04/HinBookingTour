import { ClientLayout } from "../layouts";
import { HomePage } from "../modules/home";
import { TourDetailPage } from "../modules/tours";
import { BookingPage } from "../modules/booking";
import { PaymentPage } from "../modules/payment";
import { LoginPage, RegisterPage } from "../modules/auth";

export const clientRoutes = [
  {
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/tour/:id",
        element: <TourDetailPage />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
      },
      {
        path: "/payment",
        element: <PaymentPage />,
      },
    ],
  },
];
