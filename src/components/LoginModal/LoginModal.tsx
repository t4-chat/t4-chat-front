import { type FC, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/Modal/Modal";
import "./LoginModal.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export const LoginModal: FC<LoginModalProps> = ({
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
      <div className="login-modal">
        <p className="login-description">Sign in to continue to AGG AI</p>

        {error && <div className="error-message">{error}</div>}

        <div className="login-options">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>

        {isLoading && <div className="loading">Authenticating...</div>}
      </div>
    </Modal>
  );
};
