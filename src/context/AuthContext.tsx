import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { authService } from "@/features/auth/services/authService";
import { useNavigate } from "react-router-dom";
import {
  useAuthenticationServicePostApiAuthGoogle,
  useUsersServiceGetApiUsersCurrent,
} from "../../openapi/queries/queries";
import type { UserResponse } from "../../openapi/requests/types.gen";
import { useQueryClient } from "@tanstack/react-query";
import { UseUsersServiceGetApiUsersCurrentKeyFn } from "../../openapi/queries/common";
import { tokenService } from "../../openapi/requests/core/OpenAPI";

interface AuthContextType {
  user: UserResponse;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    error,
    refetch: refetchUser,
  } = useUsersServiceGetApiUsersCurrent();

  const { mutateAsync: loginWithGoogle, isPending: isLoginWithGooglePending } =
    useAuthenticationServicePostApiAuthGoogle({
      onSuccess: (data) => {
        tokenService.setToken(data.access_token);
        refetchUser();
      },
    });

  useEffect(() => {
    if (!error) return;
    console.error("Authentication check failed:", error);
    tokenService.removeToken();
  }, [error]);

  const logout = () => {
    tokenService.removeToken();
    queryClient.setQueryData(UseUsersServiceGetApiUsersCurrentKeyFn(), null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isUserLoading || isLoginWithGooglePending,
        loginWithGoogle: async (googleToken: string) => {
          await loginWithGoogle({ requestBody: { token: googleToken } });
        },
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
