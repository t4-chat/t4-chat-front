import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { ChatPage } from "@/pages/ChatPage/ChatPage";
import { HomePage } from "@/pages/HomePage/HomePage";
import { AdminPage } from "@/pages/AdminPage/AdminPage";
import { AuthProvider } from "@/context/AuthContext";
import { AdminRoute } from "@/components/AdminRoute/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "chat/:chatId",
        element: <ChatPage />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);
