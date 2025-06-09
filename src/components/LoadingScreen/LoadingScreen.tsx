import type { FC } from "react";
import "./LoadingScreen.scss";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
};
