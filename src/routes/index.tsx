import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { ChatPage } from "@/pages/ChatPage/ChatPage";
import { SettingsPage } from "@/pages/SettingsPage/SettingsPage";
import { AuthProvider } from "@/context/AuthContext";
import { HomePage } from "@/pages/HomePage/HomePage";

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
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
