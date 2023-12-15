export const RolesId = ["Administrator"] as const;

export type TRoleId = (typeof RolesId)[number];

export const Roles = RolesId.reduce((acc, id) => {
  acc[id] = id;
  return acc;
}, {} as Record<TRoleId, TRoleId>);

export const RolesList: Record<
  TRoleId,
  {
    id: TRoleId;
    label: string;
    description: string;
    colorCode: string;
  }
> = {
  Administrator: {
    id: "Administrator",
    label: "Administrator",
    description:
      "This role has full access to all system settings and controls.",
    colorCode: "#000000",
  },
};

export type AuthErrorCode = "SignUpDisabled" | "NoPermission" | "NoSession";
