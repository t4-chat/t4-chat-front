import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui-kit/Modal/Modal";
import "./LoginModal.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
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
