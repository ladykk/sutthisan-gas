import { TRoleId } from "./auth";

export const APPLICATION_ID_ARRAY = [
  "POS",
  "Inventory",
  "Chat",
  "Payroll",
  "BackOffice",
] as const;

export const APPLICATION_LIST: Record<TApplicationId, TApplication> = {
  POS: {
    id: "POS",
    label: "POS",
    description: "An application for point of sale.",
    colorCode: "#ea580c",
    roles: ["Administrator", "Owner", "Employee"],
    path: "/pos",
    isDashboard: true,
  },
  Inventory: {
    id: "Inventory",
    label: "Inventory",
    description: "An application for inventory management.",
    colorCode: "#2563eb",
    roles: ["Administrator", "Owner", "Employee"],
    path: "/inventory",
    isDashboard: true,
  },
  Chat: {
    id: "Chat",
    label: "Chat",
    description: "An application for communication with customers.",
    colorCode: "#16a34a",
    roles: ["Administrator", "Owner", "Employee"],
    path: "/chat",
    isDashboard: true,
  },
  Payroll: {
    id: "Payroll",
    label: "Payroll",
    description: "An application for payroll management.",
    colorCode: "#9333ea",
    roles: ["Administrator", "Owner"],
    path: "/payroll",
    isDashboard: true,
  },
  BackOffice: {
    id: "BackOffice",
    label: "Back Office",
    description: "An application for back office management.",
    colorCode: "#000000",
    roles: ["Administrator", "Owner"],
    path: "/backoffice",
    isDashboard: true,
  },
} as const;

export const getApplicationsByRoleId = (roleId: TRoleId) => {
  const applications = APPLICATION_ARRAY.filter((application) => {
    return application.roles.includes(roleId);
  });
  return applications.map((application) => application.id);
};
export const Applications = APPLICATION_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TApplicationId, TApplicationId>);
export type TApplicationId = (typeof APPLICATION_ID_ARRAY)[number];
export type TApplication = {
  id: TApplicationId;
  label: string;
  description: string;
  colorCode: string;
  roles: TRoleId[];
  path: string;
  isDashboard?: boolean;
};
export const APPLICATION_ARRAY = Object.values(APPLICATION_LIST);
export type TDashboardApplicationId = Extract<
  TApplicationId,
  "POS" | "Inventory" | "Chat" | "Payroll" | "BackOffice"
>;
