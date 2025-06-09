import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ChatPage } from "../pages/ChatPage/ChatPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { AuthProvider } from "../context/AuthContext";

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
    ],
  },
]);
