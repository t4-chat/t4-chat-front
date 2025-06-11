import type { FC } from "react";

export const LoadingOverlay: FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);
