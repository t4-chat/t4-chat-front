import { type FC, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

interface GoogleCredentialResponse {
  credential?: string;
}

const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    try {
      setError(null);
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }
      await loginWithGoogle(credentialResponse.credential);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError("Failed to authenticate with Google. Please try again.");
      console.error("Google login error:", err);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to T4 Chat">
      <div className="flex flex-col items-center px-6 py-4">
        <div className="mb-6 text-center">
          <p className="text-[var(--text-secondary-color)] text-sm">
            Sign in with your Google account to get started
          </p>
        </div>

        {error && (
          <div className="bg-[rgba(var(--error-color-rgb),0.1)] mb-6 p-3 border border-[rgba(var(--error-color-rgb),0.2)] rounded-lg w-full">
            <p className="text-[var(--error-color)] text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <div className="[&_div[role=button]]:bg-[var(--component-bg-color)]! [&_div[role=button]]:hover:bg-[var(--hover-color)]! [&_div[role=button]]:shadow-sm! [&_div[role=button]]:border! [&_div[role=button]]:border-[var(--border-color)]! w-full max-w-[280px] [&_div[role=button]]:text-[var(--text-primary-color)]!">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            shape="rectangular"
            text="signin_with"
            size="large"
            width="280"
            logo_alignment="left"
            locale="en"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="border-[rgba(var(--primary-color-rgb),0.1)] border-4 border-t-[var(--primary-color)] rounded-full w-8 h-8 animate-[spin_1s_ease-in-out_infinite]" />
            <p className="text-[var(--text-secondary-color)] text-sm">
              Authenticating...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
