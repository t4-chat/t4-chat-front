import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ChatPage, HomePage } from '../pages';
import { AuthProvider } from '../context/AuthContext';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      }
    ]
  }
]); 