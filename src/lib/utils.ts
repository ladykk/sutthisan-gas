import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumber: string | null) {
  if (!phoneNumber) return "-";
  // MobilePhone Format: 0600000000 -> 060-000-0000
  if (phoneNumber.length === 10) {
    const formattedPhoneNumber = phoneNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );
    return formattedPhoneNumber;
  }
  // Landline Format: 020000000 -> 02-000-0000
  else if (phoneNumber.length === 9) {
    const formattedPhoneNumber = phoneNumber.replace(
      /(\d{2})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );
    return formattedPhoneNumber;
  }
}

export function getNamePrefix(fullName: string | null) {
  return fullName?.split(" ")[0].charAt(0).toUpperCase();
}
