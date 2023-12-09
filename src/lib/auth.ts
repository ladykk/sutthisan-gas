export function getNamePrefix(fullName: string | null) {
  return fullName?.split(" ")[0].charAt(0).toUpperCase();
}
