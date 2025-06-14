import type { FC } from "react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[12.5rem]">
      <div className="mb-3 border-[rgba(var(--primary-color-rgb),0.1)] border-4 border-t-[var(--primary-color)] rounded-full w-10 h-10 animate-[spin_1s_ease-in-out_infinite]" />
      <p className="text-[var(--text-secondary-color)] text-base">{message}</p>
    </div>
  );
};
