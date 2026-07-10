import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import PageLoader from "./components/ui/PageLoader.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import "./styles/index.css";

const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const HabitsPage = lazy(() => import("./pages/HabitsPage.jsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProfileSetupPage = lazy(() => import("./pages/ProfileSetupPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const SavingsGoalsPage = lazy(() => import("./pages/SavingsGoalsPage.jsx"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage.jsx"));

function withPageLoader(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: withPageLoader(<LoginPage />)
  },
  {
    path: "/register",
    element: withPageLoader(<RegisterPage />)
  },
  {
    path: "/",
    element: withPageLoader(<LandingPage />)
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: withPageLoader(<DashboardPage />)
      },
      {
        path: "profile-setup",
        element: withPageLoader(<ProfileSetupPage />)
      },
      {
        path: "transactions",
        element: withPageLoader(<TransactionsPage />)
      },
      {
        path: "habits",
        element: withPageLoader(<HabitsPage />)
      },
      {
        path: "savings-goals",
        element: withPageLoader(<SavingsGoalsPage />)
      },
      {
        path: "analytics",
        element: withPageLoader(<AnalyticsPage />)
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            {withPageLoader(<AdminPage />)}
          </AdminRoute>
        )
      },
      {
        path: "*",
        element: withPageLoader(<NotFoundPage />)
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
