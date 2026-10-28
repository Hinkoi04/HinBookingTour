
import { Dashboard } from "../modules/dashboard";
import { TourList } from "../modules/tours";
import { CategoryList } from "../modules/categories";
import { ChangePassword, UserList } from "../modules/users";
import { Booking } from "../modules/bookings";
import { Departure, DepartureDetailPage, DeparturePassengersPage } from "../modules/departures";
import { Discount } from "../modules/discounts";
import { Login } from "../modules/login";
import { BlogList } from "../modules/blogs";
import { ReviewList } from "../modules/reviews";
import TourForm from "../modules/tours/pages/TourForm";
import { VehicleList } from "../modules/vehicles"
import  {BlogForm}  from "../modules/blogs";
import { ContactList } from "../modules/contacts";

import { MainLayout } from "../layouts";
import { AuthLayout } from "../layouts";

import PrivateRoute from "./PrivateRoute";
import { RolePage, RoleForm } from "../modules/roles/pages";

export const adminRoutes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/admin/login",
        element: <Login />,
      },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/admin",
            element: <Dashboard />,
          },
          {
            path: "/admin/tours",
            element: <TourList />,
          },
          {
            path: "/admin/tours/new",
            element: <TourForm />,
          },
          {
            path: "/admin/tours/edit/:id",
            element: <TourForm />,
          },
          {
            path: "/admin/categories",
            element: <CategoryList />,
          },
          {
            path: "/admin/users",
            element: <UserList />,
          },
          {
            path: "/admin/change-password",
            element: <ChangePassword />,
          },
          {
            path: "/admin/bookings",
            element: <Booking />,
          },
          {
            path: "/admin/departures",
            element: <Departure />,
          },
          {
            path: "/admin/departures/:id/passengers",
            element: <DeparturePassengersPage />,
          },
          {
            path: "/admin/departures/:id",
            element: <DepartureDetailPage />,
          },
          {
            path: "/admin/vehicles",
            element: <VehicleList />,
          },
          {
            path: "/admin/discounts",
            element: <Discount />,
          },
          {
            path: "/admin/roles",
            element: <RolePage />,
          },
          {
            path: "/admin/roles/new",
            element: <RoleForm />,
          },
          {
            path: "/admin/roles/edit/:id",
            element: <RoleForm />,
          },
          {
            path: "/admin/blogs",
            element: <BlogList />,
          },
          {
            path: "/admin/blogs/new",
            element: <BlogForm />,
          },
          {
            path: "/admin/blogs/edit/:id",
            element: <BlogForm />,
          },
          {
            path: "/admin/reviews",
            element: <ReviewList />,
          },
          {
            path: "/admin/contacts",
            element: <ContactList />,
          }
        ],
      },
    ],
  },
];
