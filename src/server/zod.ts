import { z } from "zod";

export const zodEmail = z
  .string({
    required_error: "Email is required",
  })
  .email({ message: "Invalid email address" })
  .min(1, { message: "Email is required" });

export const zodPassword = z
  .string({
    required_error: "Password is required",
  })
  .min(6, { message: "Password must be at least 6 characters" })
  .max(100, { message: "Password must be less than 100 characters" });

export const zodTaxId = z
  .string()
  .min(13, {
    message: "Tax ID must have 13 characters",
  })
  .max(13, {
    message: "Tax ID must have 13 characters",
  })
  .regex(/^[0-9]{13}$/, {
    message: "Tax ID must be a number",
  });

export const zodFullName = z
  .string({
    required_error: "Full name is required",
  })
  .min(1, { message: "Full name is required" });

export const zodPhoneNumber = z
  .string({
    required_error: "Phone number is required",
  })
  .min(9, { message: "Phone number must be at least 9 characters" })
  .max(12, { message: "Phone number must be less than 12 characters" })
  // Regrex to check if phone number is in Thai's phone number format
  .regex(/^(0[0-9]{1}[0-9]{7,8})$/, {
    message: "Invalid phone number",
  });

export const zodDate = z
  .string()
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date")
  .transform((val) => new Date(val));

export const zodFile = (options?: {
  maxSizeMB?: number;
  allowedFileTypes?: string[];
}) =>
  z
    .instanceof(File)
    .refine(
      (file) =>
        options?.maxSizeMB
          ? file.size <= options.maxSizeMB * 1024 * 1024
          : true,
      {
        message: `File size must be smaller than ${options?.maxSizeMB}MB`,
      }
    )
    .refine(
      (file) =>
        options?.allowedFileTypes
          ? options.allowedFileTypes.includes(file.type)
          : true,
      {
        message: `File type must be one of ${options?.allowedFileTypes?.join(
          ", "
        )}`,
      }
    );

export const getFileExtension = (file: File) => {
  return file.name.split(".").pop();
};

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
