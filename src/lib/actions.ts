import { ToastFn } from "@/components/ui/use-toast";
import { SafeAction } from "next-safe-action";
import { HookResult } from "next-safe-action/hook";
import { Path, UseFormSetError } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import { formData } from "zod-form-data";

type TFormDataInput = ReturnType<typeof formData>["_input"];
export type AcceptInputValue = string | number | boolean | Date | File | null;

export function objectToFormData(
  obj: Record<string, AcceptInputValue>
): FormData {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") formData.append(key, value);
    else if (typeof value === "number") formData.append(key, value.toString());
    else if (typeof value === "boolean")
      formData.append(key, value ? "true" : "false");
    else if (value instanceof File) formData.append(key, value);
    else if (value instanceof Date) formData.append(key, value.toJSON());
    else if (value === null) return;
    else if (value === undefined) return;
    else
      throw new Error(
        `Convert Fn not implemented yet. (key:${key} type: ${typeof value})`
      );
  });
  return formData;
}

export function formDataToObject<T>(formData: TFormDataInput): T {
  const obj: Record<string, AcceptInputValue> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj as T;
}

export function handleActionError<Schema extends z.ZodTypeAny, Data>(
  toast?: ToastFn,
  setError?: UseFormSetError<z.infer<Schema>>,
  message: string = "Something went wrong"
) {
  return (error: Omit<HookResult<Schema, Data>, "data">) => {
    console.log(error);
    if (error.validationError) {
      if (setError)
        for (const [key, value] of Object.entries(error.validationError)) {
          setError(key as Path<Schema>, {
            type: "mannual",
            message: value?.join(", "),
          });
        }
      toast?.({
        title: "Validation error",
        description: "Please check your inputs and try again",
        variant: "warning",
      });
    } else {
      console.log(error);
      toast?.({
        title: message,
        description: error.serverError,
        variant: "destructive",
      });
    }
  };
}

export function actionQuery<TInput extends ZodTypeAny, TOutput>(
  action: SafeAction<TInput, TOutput>
) {
  return async (inputs: z.infer<TInput>) => {
    const result = await action(inputs);
    if (result.validationError)
      throw {
        validationError: result.validationError,
      };
    else if (result.serverError)
      throw {
        serverError: result.serverError,
      };
    else return result.data;
  };
}

export function actionMutation<TInput extends ZodTypeAny, TOutput>(
  action: SafeAction<TInput, TOutput>
) {
  return async (inputs: z.infer<TInput>) => {
    const result = await action(objectToFormData(inputs));
    if (result.validationError)
      throw {
        validationError: result.validationError,
      };
    else if (result.serverError)
      throw {
        serverError: result.serverError,
      };
    else return result.data;
  };
}
