
import { Dashboard } from "../modules/dashboard";
import { TourList } from "../modules/tours";
import { CategoryList } from "../modules/categories";
import { ChangePassword, UserList, EmployeeDetailPage } from "../modules/users";
import { Booking } from "../modules/bookings";
import { Departure, DepartureDetailPage, DeparturePassengersPage } from "../modules/departures";
import { Discount } from "../modules/discounts";
import { Login } from "../modules/login";
import { BlogList } from "../modules/blogs";
import { ReviewList, ReviewDetailPage } from "../modules/reviews";
import TourForm from "../modules/tours/pages/TourForm";
import { VehicleList } from "../modules/vehicles"
import  {BlogForm}  from "../modules/blogs";
import { ContactList } from "../modules/contacts";

import { MainLayout } from "../layouts";
import { AuthLayout } from "../layouts";

import PrivateRoute from "./PrivateRoute";
import { RolePage, RoleForm } from "../modules/roles/pages";
import TourDetailPage from "../modules/tours/pages/TourDetailPage";
import CategoryDetailPage from "../modules/categories/pages/CategoryDetailPage";
import CustomerDetailPage from "../modules/users/pages/CustomerDetailPage";
import BookingDetailPage from "../modules/bookings/pages/BookingDetailPage";
import CouponDetailPage from "../modules/discounts/pages/CouponDetailPage";
import RoleDetailPage from "../modules/roles/pages/RoleDetailPage";
import BlogDetailPage from "../modules/blogs/pages/BlogDetailPage";

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
            path: "/admin/tours/:id",
            element: <TourDetailPage />,
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
            path: "/admin/categories/:id",
            element: <CategoryDetailPage />,
          },
          {
            path: "/admin/users",
            element: <UserList key="customers" listMode="customers" />,
          },
          {
            path: "/admin/users/:id",
            element: <CustomerDetailPage />,
          },
          {
            path: "/admin/employees",
            element: <UserList key="employees" listMode="employees" />,
          },
          {
            path: "/admin/employees/:id",
            element: <EmployeeDetailPage />,
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
            path: "/admin/bookings/:id",
            element: <BookingDetailPage />,
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
            path: "/admin/discounts/:id",
            element: <CouponDetailPage />,
          },
          {
            path: "/admin/roles",
            element: <RolePage />,
          },
          {
            path: "/admin/roles/:id",
            element: <RoleDetailPage />,
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
            path: "/admin/blogs/:id",
            element: <BlogDetailPage />,
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
            path: "/admin/reviews/:id",
            element: <ReviewDetailPage />,
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
