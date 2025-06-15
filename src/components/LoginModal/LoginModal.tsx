import { type FC, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/Modal/Modal";

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
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <div className="text-center">
        <p className="mb-5 text-[var(--text-color)] text-base">
          Sign in to continue to T4 Chat
        </p>

        {error && (
          <div className="bg-[rgba(var(--error-color-rgb),0.1)] mb-4 p-2 rounded text-[var(--error-color)]">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>

        {isLoading && (
          <div className="mt-4 text-[var(--text-color)] text-sm">
            Authenticating...
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
