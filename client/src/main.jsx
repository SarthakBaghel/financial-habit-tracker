import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HabitsPage from "./pages/HabitsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfileSetupPage from "./pages/ProfileSetupPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "profile-setup",
        element: <ProfileSetupPage />
      },
      {
        path: "transactions",
        element: <TransactionsPage />
      },
      {
        path: "habits",
        element: <HabitsPage />
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        )
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
