import { toast } from "sonner";
import { ApiError } from "~/openapi/requests";

interface LegacyApiError {
  message?: string;
  detail?: string;
  status?: number;
  response?: {
    data?: {
      detail?: string | { msg?: string; type?: string }[];
      message?: string;
      error?: string;
      errors?: Array<string | { message?: string; msg?: string }>;
    };
    status?: number;
    statusText?: string;
  };
}

export const useMutationErrorHandler = () => {
  const handleError = (error: unknown, customMessage?: string) => {
    let errorMessage = customMessage || "An unexpected error occurred";

    console.log("Error object:", error); // Debug logging

    if (error instanceof ApiError) {
      // Handle OpenAPI generated ApiError class
      console.log("ApiError body:", error.body); // Debug the body content

      // Try to extract detailed message from the response body
      if (error.body && typeof error.body === "object") {
        const body = error.body as Record<string, unknown>;

        if (typeof body.detail === "string") {
          errorMessage = body.detail;
        } else if (Array.isArray(body.detail) && body.detail.length > 0) {
          // Handle validation errors
          errorMessage = body.detail
            .map((err: unknown) => {
              if (typeof err === "object" && err !== null) {
                const errorObj = err as Record<string, unknown>;
                return (
                  (errorObj.msg as string) ||
                  (errorObj.type as string) ||
                  "Validation error"
                );
              }
              return "Validation error";
            })
            .join(", ");
        } else if (typeof body.message === "string") {
          errorMessage = body.message;
        } else if (typeof body.error === "string") {
          errorMessage = body.error;
        } else if (Array.isArray(body.errors) && body.errors.length > 0) {
          errorMessage = body.errors
            .map((err: unknown) => {
              if (typeof err === "string") {
                return err;
              } else if (typeof err === "object" && err !== null) {
                const errorObj = err as Record<string, unknown>;
                return (
                  (errorObj.message as string) ||
                  (errorObj.msg as string) ||
                  "Error"
                );
              }
              return "Error";
            })
            .join(", ");
        }

        // Fallback to status information if no error message found
        if (
          errorMessage === (customMessage || "An unexpected error occurred")
        ) {
          errorMessage = `${error.statusText || error.status || "Request failed"}`;
        }
      } else {
        // If no body or body is not an object, use status info
        errorMessage = `${error.statusText || error.status || "Request failed"}`;
      }
    } else if (error && typeof error === "object") {
      // Handle legacy error format (keeping for backward compatibility)
      const apiError = error as LegacyApiError;

      if (apiError.response?.data?.detail) {
        const detail = apiError.response.data.detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail
            .map((err) => err.msg || err.type || "Validation error")
            .join(", ");
        }
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (
        apiError.response?.data?.errors &&
        Array.isArray(apiError.response.data.errors) &&
        apiError.response.data.errors.length > 0
      ) {
        errorMessage = apiError.response.data.errors
          .map((err) =>
            typeof err === "string" ? err : err.message || err.msg || "Error",
          )
          .join(", ");
      } else if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.detail) {
        errorMessage = apiError.detail;
      } else if (apiError.response?.status) {
        errorMessage = `Request failed with status ${apiError.response.status}${
          apiError.response.statusText
            ? ` (${apiError.response.statusText})`
            : ""
        }`;
      } else if (apiError.status) {
        errorMessage = `Request failed with status ${apiError.status}`;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Don't repeat the custom message if it's already part of the error message
    if (
      customMessage &&
      errorMessage !== customMessage &&
      !errorMessage.includes(customMessage)
    ) {
      errorMessage = `${customMessage}: ${errorMessage}`;
    }

    console.log("Final error message:", errorMessage); // Debug logging
    toast.error(errorMessage);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return { handleError, handleSuccess };
};
