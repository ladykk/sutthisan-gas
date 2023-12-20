import { DashboardSidebarMenu } from "@/components/common/theme/dashboard";
import { TDashboardApplicationId } from "./application";
import { Building2, Database, ServerCog } from "lucide-react";

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
      label: "Company",
      baseUrl: "company",
      icon: Building2,
      roles: ["Administrator", "Owner"],
      links: [
        {
          label: "Company Infomation",
          url: "info",
        },
        {
          label: "Payment Channels",
          url: "payment_channels",
        },
      ],
    },
    {
      label: "Master Data",
      baseUrl: "master_data",
      icon: Database,
      roles: ["Administrator"],
      links: [{ label: "Banks", url: "banks" }],
    },
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
