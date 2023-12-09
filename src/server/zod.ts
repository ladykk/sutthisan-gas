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
  .regex(/^(0[6-9]{1}[0-9]{8})$/, {
    message: "Invalid phone number",
  });
