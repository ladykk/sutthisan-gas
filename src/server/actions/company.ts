"use server";
import { Roles } from "@/static/role";
import { roleAction } from ".";
import { getEdgeConfig, setEdgesConfig } from "../edge-config";
import { z } from "zod";
import { EDGE_CONFIG_SCHEMA } from "@/static/edge-config";
import { zfd } from "zod-form-data";

// Get Company Infomation
export const getCompanyInfo = roleAction([Roles.Administrator, Roles.Owner])(
  z.void(),
  async (input) => {
    const info = await getEdgeConfig("companyInfo");
    return info;
  }
);

// Set Company Infomation
const setCompanyInfoSchema = zfd.formData(EDGE_CONFIG_SCHEMA.companyInfo);
export type TSetCompanyInfoInput = z.infer<typeof setCompanyInfoSchema>;
export const setCompanyInfo = roleAction([Roles.Administrator, Roles.Owner])(
  setCompanyInfoSchema,
  async (input) => {
    const result = await setEdgesConfig([
      {
        key: "companyInfo",
        value: input,
      },
    ]);
    if (!result) throw new Error("Failed to set company info");
    return;
  }
);
