export const ROLE_ID_ARRAY = [
  "Administrator",
  "Owner",
  "Employee",
  "DeliveryMan",
  "Customer",
] as const;
export type TRoleId = (typeof ROLE_ID_ARRAY)[number];
export type TRole = {
  id: TRoleId;
  label: string;
  description: string;
  colorCode: string;
  accessLevel: number;
};

export const ROLE_LIST: Record<TRoleId, TRole> = {
  Administrator: {
    id: "Administrator",
    label: "Administrator",
    description:
      "This role has full access to all system functions and controls.",
    colorCode: "#000000",
    accessLevel: 99,
  },
  Owner: {
    id: "Owner",
    label: "Owner",
    description:
      "This role has full access to company related functions and controls.",
    colorCode: "#2563eb",
    accessLevel: 3,
  },
  Employee: {
    id: "Employee",
    label: "Employee",
    description:
      "This role has limited access to employee related functions and controls.",
    colorCode: "#ea580c",
    accessLevel: 2,
  },
  DeliveryMan: {
    id: "DeliveryMan",
    label: "Delivery Man",
    description:
      "This role has limited access to deliver related functions and controls.",
    colorCode: "#e11d48",
    accessLevel: 1,
  },
  Customer: {
    id: "Customer",
    label: "Customer",
    description:
      "This role has limited access to customer related functions and controls.",
    colorCode: "#16a34a",
    accessLevel: 0,
  },
};

export const Roles = ROLE_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TRoleId, TRoleId>);

export const ROLE_ARRAY = Object.values(ROLE_LIST).sort(
  (a, b) => b.accessLevel - a.accessLevel
);

export type AuthErrorCode = "SignUpDisabled" | "NoPermission" | "NoSession";
