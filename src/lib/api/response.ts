import { NextResponse } from "next/server";

/**
 * Consistent JSON envelope for every REST API v1 endpoint — one shape
 * whether the caller is this app's own client code or an external
 * integration. Mirrors the `ActionResult` shape the Server Actions
 * already use (success/message/fieldErrors) so `fromActionResult` below
 * can translate one into the other without re-deriving anything.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function apiSuccess<T>(
  data: T,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  message: string,
  status = 400,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, message, fieldErrors },
    { status },
  );
}

export const apiUnauthorized = (message = "Authentication required") =>
  apiError(message, 401);
export const apiForbidden = (message = "Not allowed") => apiError(message, 403);
export const apiNotFound = (message = "Not found") => apiError(message, 404);
export const apiTooManyRequests = (message = "Too many requests") =>
  apiError(message, 429);
export const apiServerError = (message = "Internal server error") =>
  apiError(message, 500);

interface ActionResultLike {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

/** Maps the existing Server Action `ActionResult` shape onto an HTTP
 * response — the REST layer reuses the same underlying business-logic
 * functions as the UI, so this is the one place that bridges the two
 * calling conventions. */
export function fromActionResult<T extends ActionResultLike>(
  result: T,
  successStatus = 200,
): NextResponse {
  if (result.success) {
    return apiSuccess(result, successStatus);
  }
  return apiError(result.message, 400, result.fieldErrors);
}
