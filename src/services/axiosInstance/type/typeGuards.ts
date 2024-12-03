import { ApiError, ApiSuccess } from "./index";

export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === "object" &&
    "errorMessage" in error &&
    "status" in error
  );
}

export function isApiSuccess(resp: unknown): resp is ApiSuccess {
  return resp !== null && typeof resp === "object" && "message" in resp;
}
