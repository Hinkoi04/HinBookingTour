import { ClientLayout } from "../layouts";
import { HomePage } from "../modules/home";
import { TourDetailPage, TourListPage } from "../modules/tours";
import { BookingPage } from "../modules/booking";
import { PaymentPage } from "../modules/payment";
import { ChangePasswordPage, ClientProfilePage, LoginPage, RegisterPage } from "../modules/auth";
import { OrderHistoryPage } from "../modules/booking/pages/OrderHistoryPage";
import { BlogDetailPage, BlogListPage } from "../modules/blogs";

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
        path: "/cam-nang",
        element: <BlogListPage />,
      },
      {
        path: "/cam-nang/:slug",
        element: <BlogDetailPage />,
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
        path: "/change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "/profile",
        element: <ClientProfilePage />,
      },
      {
        path: "/order-history",
        element: <OrderHistoryPage />,
      },
      {
        path: "/tour/:slug",
        element: <TourDetailPage />,
      },
      {
        path: "/tours/:type",
        element: <TourListPage />,
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
