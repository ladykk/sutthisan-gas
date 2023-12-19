import { ROLE_LIST, TRoleId } from "@/static/auth";
import { Badge, BadgeProps } from "../ui/badge";

type RoleBadgeProps = BadgeProps & {
  roleId: TRoleId;
};

export function RoleBadge(props: RoleBadgeProps) {
  return (
    <Badge
      {...props}
      style={{
        ...props.style,
        backgroundColor: ROLE_LIST[props.roleId].colorCode,
      }}
    >
      {ROLE_LIST[props.roleId].label}
    </Badge>
  );
}
