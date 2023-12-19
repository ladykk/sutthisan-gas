import { DashboardSidebarMenu } from "@/components/common/theme/dashboard";
import { TDashboardApplicationId } from "./application";
import { ServerCog } from "lucide-react";

export const MENU_ITEMS: Record<
  TDashboardApplicationId,
  Array<DashboardSidebarMenu>
> = {
  POS: [],
  Inventory: [],
  Chat: [],
  Payroll: [],
  BackOffice: [
    {
      label: "Administration",
      baseUrl: "admin",
      icon: ServerCog,
      roles: ["Administrator"],
      links: [
        {
          label: "Applications",
          url: "applications",
        },
        {
          label: "Roles",
          url: "roles",
        },
        {
          label: "Users",
          url: "users",
        },
        {
          label: "Site Config",
          url: "site_config",
        },
      ],
    },
  ],
} as const;
