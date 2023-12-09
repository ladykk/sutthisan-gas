import { TActionErrorResponse } from "@/server/actions";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function handleActionError<TData extends FieldValues>(
  response: TActionErrorResponse<TData>,
  handlers?: {
    setFormError?: UseFormSetError<TData>;
    toast?: (message: string) => void;
    message?: {
      [key in TActionErrorResponse<TData>["type"]]?: (error: string) => void;
    };
  }
) {
  handlers?.message?.[response.type]?.(response.message);
  if (response.type === "undefined")
    console.error(`Undefined error: ${response.message}`, response);
  if (response.type === "internal_server_error")
    console.error(`Internal server error: ${response.message}`, response);

  if (response.type === "validation" && handlers?.setFormError) {
    for (const [key, value] of Object.entries(response.errors)) {
      handlers?.setFormError(key as Path<TData>, {
        type: "mannual",
        message: value,
      });
    }
  }
}
