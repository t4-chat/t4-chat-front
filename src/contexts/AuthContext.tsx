import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  useAuthenticationServicePostApiAuthGoogle,
  useUsersServiceGetApiUsersCurrent,
} from "~/openapi/queries/queries";
import type { UserResponseSchema } from "~/openapi/requests/types.gen";
import { useQueryClient } from "@tanstack/react-query";
import {
  UseUsersServiceGetApiUsersCurrentKeyFn,
  UseAiModelsServiceGetApiAiModelsKeyFn,
  UseChatsServiceGetApiChatsKeyFn,
} from "~/openapi/queries/common";
import { tokenService } from "~/openapi/requests/core/OpenAPI";
import { useMutationErrorHandler } from "@/utils/hooks";

interface TokenPayload {
  admin?: boolean;
}

interface AuthContextType {
  user: UserResponseSchema | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
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
  const { handleError, handleSuccess } = useMutationErrorHandler();

  const getIsAdminFromToken = (): boolean => {
    const token = tokenService.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return !!decoded.admin;
    } catch (e) {
      console.error("Failed to decode token", e);
      return false;
    }
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(getIsAdminFromToken());

  const {
    data: user,
    isLoading: isUserLoading,
    error,
    refetch: refetchUser,
  } = useUsersServiceGetApiUsersCurrent(undefined, {
    enabled: !!tokenService.getToken(),
  });

  const { mutateAsync: loginWithGoogle, isPending: isLoginWithGooglePending } =
    useAuthenticationServicePostApiAuthGoogle({
      onSuccess: (data) => {
        tokenService.setToken(data.access_token);
        setIsAdmin(getIsAdminFromToken());
        refetchUser();
        queryClient.invalidateQueries({
          queryKey: UseAiModelsServiceGetApiAiModelsKeyFn(),
        });
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsKeyFn(),
        });
        handleSuccess("Signed in successfully");
      },
      // onError: (error) => handleError(error, "Authentication failed"),
    });

  useEffect(() => {
    if (!error) return;
    console.error("Authentication check failed:", error);
    tokenService.removeToken();
  }, [error]);

  const logout = () => {
    tokenService.removeToken();
    setIsAdmin(false);
    queryClient.clear();
    queryClient.setQueryData(UseUsersServiceGetApiUsersCurrentKeyFn(), null);
    queryClient.invalidateQueries({
      queryKey: UseAiModelsServiceGetApiAiModelsKeyFn(),
    });
    queryClient.invalidateQueries({
      queryKey: UseChatsServiceGetApiChatsKeyFn(),
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isUserLoading || isLoginWithGooglePending,
        isAdmin,
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
