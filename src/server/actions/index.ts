import { ZodError } from "zod";

export type TActionSuccess<TData> = {
  status: "success";
  data?: TData;
};

type TActionErrorType =
  | "undefined"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "internal_server_error";

type TActionErrorBase = {
  status: "error";
  type: TActionErrorType;
  statusCode: number;
  message: string;
};

export interface IActionValidationErrorResult<TData> extends TActionErrorBase {
  type: "validation";
  statusCode: 400;
  errors: Record<keyof TData, string>;
}

export interface IActionUnauthorizedError extends TActionErrorBase {
  type: "unauthorized";
  statusCode: 401;
}

export interface IActionForbiddenError extends TActionErrorBase {
  type: "forbidden";
  statusCode: 403;
}

export interface IActionNotFoundError extends TActionErrorBase {
  type: "not_found";
  statusCode: 404;
}

export interface IActionInternalServerError extends TActionErrorBase {
  type: "internal_server_error";
  statusCode: 500;
}

export interface IActionUndefinedError extends TActionErrorBase {
  type: "undefined";
  statusCode: 500;
}

export type TActionErrorResponse<TData> =
  | IActionValidationErrorResult<TData>
  | IActionUnauthorizedError
  | IActionForbiddenError
  | IActionNotFoundError
  | IActionInternalServerError
  | IActionUndefinedError;

export type TActionResponse<TData, TError = TData> =
  | TActionSuccess<TData>
  | TActionErrorResponse<TError>;

export function ActionValidationError<TData>(
  errors: ZodError<TData> | Array<{ path: keyof TData; message: string }>,
  message: string = "Validation error."
): IActionValidationErrorResult<TData> {
  return {
    status: "error",
    type: "validation",
    statusCode: 400,
    message: message,
    errors: Array.isArray(errors)
      ? errors.reduce((acc, { path: field, message }) => {
          acc[field] = message;
          return acc;
        }, {} as Record<keyof TData, string>)
      : errors.issues.reduce((acc, { path, message }) => {
          acc[path.join(".") as keyof TData] = message;
          return acc;
        }, {} as Record<keyof TData, string>),
  };
}

export function ActionUnauthorizedError(
  message: string = "Unauthorized."
): IActionUnauthorizedError {
  return {
    status: "error",
    type: "unauthorized",
    statusCode: 401,
    message: message,
  };
}

export function ActionForbiddenError(
  message: string = "Forbidden."
): IActionForbiddenError {
  return {
    status: "error",
    type: "forbidden",
    statusCode: 403,
    message: message,
  };
}

export function ActionNotFoundError(
  message: string = "Not found."
): IActionNotFoundError {
  return {
    status: "error",
    type: "not_found",
    statusCode: 404,
    message: message,
  };
}

export function ActionInternalServerError(
  message: string = "Internal server error."
): IActionInternalServerError {
  return {
    status: "error",
    type: "internal_server_error",
    statusCode: 500,
    message: message,
  };
}

export function ActionSuccess<TData>(data?: TData): TActionSuccess<TData> {
  return {
    status: "success",
    data: data,
  };
}
