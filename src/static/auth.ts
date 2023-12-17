export const ROLE_ID_ARRAY = ["Administrator"] as const;
export type TRoleId = (typeof ROLE_ID_ARRAY)[number];
export type TRole = {
  id: TRoleId;
  label: string;
  description: string;
  colorCode: string;
};

export const ROLE_LIST: Record<TRoleId, TRole> = {
  Administrator: {
    id: "Administrator",
    label: "Administrator",
    description:
      "This role has full access to all system settings and controls.",
    colorCode: "#000000",
  },
};

export const Roles = ROLE_ID_ARRAY.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TRoleId, TRoleId>);

export const ROLE_ARRAY = Object.values(ROLE_LIST);

export type AuthErrorCode = "SignUpDisabled" | "NoPermission" | "NoSession";
