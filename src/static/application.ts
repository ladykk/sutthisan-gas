import { TRoleId } from "./auth";

export const APPLICATION_ID_ARRAY = ["Backoffice"] as const;
export type TApplicationId = (typeof APPLICATION_ID_ARRAY)[number];
export type TApplication = {
  id: TApplicationId;
  label: string;
  description: string;
  colorCode: string;
  roles: TRoleId[];
};

export const APPLICATION_LIST: Record<TApplicationId, TApplication> = {
  Backoffice: {
    id: "Backoffice",
    label: "Backoffice",
    description: "An application for managing the system administration.",
    colorCode: "#000000",
    roles: ["Administrator"],
  },
} as const;

export const Applications = APPLICATION_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TApplicationId, TApplicationId>);

export const APPLICATION_ARRAY = Object.values(APPLICATION_LIST);
