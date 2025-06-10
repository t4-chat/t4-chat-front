import { useState, useEffect, useRef } from "react";

interface UseMinimumLoadingOptions {
  minimumDuration?: number;
  initialLoading?: boolean;
}

export const useMinimumLoading = ({
  minimumDuration = 300,
  initialLoading = false,
}: UseMinimumLoadingOptions = {}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isMinimumLoading, setIsMinimumLoading] = useState(initialLoading);
  const loadingStartTime = useRef<number | null>(null);

  // Update internal loading state when external loading state changes
  useEffect(() => {
    setIsLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    if (isLoading) {
      loadingStartTime.current = Date.now();
      setIsMinimumLoading(true);
    } else if (loadingStartTime.current) {
      const elapsedTime = Date.now() - loadingStartTime.current;
      const remainingTime = Math.max(0, minimumDuration - elapsedTime);

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setIsMinimumLoading(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      }
      setIsMinimumLoading(false);
    }
  }, [isLoading, minimumDuration]);

  return {
    isLoading,
    isMinimumLoading,
    setLoading: (loading: boolean) => setIsLoading(loading),
  };
};
