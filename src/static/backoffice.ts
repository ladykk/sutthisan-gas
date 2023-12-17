import { ServerCog, User } from "lucide-react";

export const MENU_ITEMS = [
  {
    label: "System Preferences",
    baseUrl: "system_preferences",
    icon: ServerCog,
    children: [
      {
        label: "Site Config",
        url: "site_config",
      },
      {
        label: "Applications",
        url: "applications",
      },
    ],
  },
  {
    label: "Users Management",
    baseUrl: "users_mgt",
    icon: User,
    children: [
      {
        label: "Users",
        url: "users",
      },
      {
        label: "Roles",
        url: "roles",
      },
    ],
  },
];
