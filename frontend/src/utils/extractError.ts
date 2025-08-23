/**
 * Error types that can be handled by the utility
 */
interface AxiosError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
  config?: {
    url?: string;
    method?: string;
  };
}

interface ErrorWithMessage {
  message: string;
}

interface ErrorWithError {
  error: string;
}

type ErrorLike =
  | string
  | Error
  | ErrorWithMessage
  | ErrorWithError
  | AxiosError
  | null
  | undefined;

/**
 * Extract error message from various error formats
 * @param error - Error object, string, or any error-like object
 * @returns Formatted error message string
 */
export const extractErrorMessage = (error: ErrorLike): string => {
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle null/undefined
  if (!error) {
    return "An unexpected error occurred";
  }

  // Handle axios response errors (most common)
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }

  // Handle standard Error objects
  if (error && typeof error === "object" && "message" in error) {
    const errorWithMessage = error as ErrorWithMessage;
    return errorWithMessage.message;
  }

  // Handle objects with error property
  if (error && typeof error === "object" && "error" in error) {
    const errorWithError = error as ErrorWithError;
    return errorWithError.error;
  }

  // Fallback for unknown error types
  return "An unexpected error occurred";
};

/**
 * Extract error details for debugging
 * @param error - Error object
 * @returns Object with error details
 */
export const extractErrorDetails = (error: ErrorLike) => {
  const axiosError = error as AxiosError;

  return {
    message: extractErrorMessage(error),
    status: axiosError?.response?.status,
    statusText: axiosError?.response?.statusText,
    url: axiosError?.config?.url,
    method: axiosError?.config?.method,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Log error with consistent formatting
 * @param context - Context where the error occurred
 * @param error - Error object
 * @param additionalInfo - Additional information to log
 */
export const logError = (
  context: string,
  error: ErrorLike,
  additionalInfo?: unknown
) => {
  const errorDetails = extractErrorDetails(error);

  console.error(`[${context}] Error:`, {
    ...errorDetails,
    additionalInfo,
    originalError: error,
  });
};
