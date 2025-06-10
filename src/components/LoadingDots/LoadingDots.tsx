import type { FC } from "react";
import "./LoadingDots.scss";

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={`loading-dots ${className}`}>
      <span />
      <span />
      <span />
    </div>
  );
};
