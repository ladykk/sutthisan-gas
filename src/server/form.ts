type TCheckFileRequirementsOptions = {
  maxSizeMB?: number;
  allowedFileTypes?: string[];
};

type TCheckFileRequirementsResult = {
  isValid: boolean;
  errors: string[];
};

export const checkFileRequirements = (
  file: File,
  options?: TCheckFileRequirementsOptions
): TCheckFileRequirementsResult => {
  const { maxSizeMB = 0, allowedFileTypes = [] } = options || {};

  const errors = [];

  if (maxSizeMB > 0 && file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be smaller than ${maxSizeMB}MB`);
  }

  if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
    errors.push(`File type must be one of ${allowedFileTypes.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFileExtension = (file: File) => {
  return file.name.split(".").pop();
};

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
