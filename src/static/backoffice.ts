import { User } from "lucide-react";

export const MENU_ITEMS = [
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
