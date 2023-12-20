"use server";

import { zfd } from "zod-form-data";
import { roleAction } from ".";
import {
  IMAGE_MIME_TYPES,
  getFileExtension,
  zodBoolean,
  zodFile,
} from "../zod";
import { z } from "zod";
import { db } from "../db";
import { SBServerClient } from "../supabase";
import { cookies } from "next/headers";
import { METADATA_BUCKET } from "../db/storage";
import { banks } from "../db/schema/payments";

// Create Bank
const createBankSchema = zfd.formData({
  nameTH: zfd.text(),
  nameEN: zfd.text(),
  logo: zfd.file(
    zodFile({
      maxSizeMB: 1,
      allowedFileTypes: IMAGE_MIME_TYPES,
    })
  ),
  isActive: zfd.text(zodBoolean),
});
export type TCreateBankInput = z.infer<typeof createBankSchema>;
export const createBank = roleAction(["Administrator"])(
  createBankSchema,
  async (input) => {
    const supabase = SBServerClient(cookies());
    const id = await db.transaction(async (trx) => {
      const logoResult = await supabase.storage
        .from(METADATA_BUCKET)
        .upload(
          `banks/${input.nameEN
            .toLowerCase()
            .replace(" ", "_")}.${getFileExtension(input.logo)}`,
          input.logo
        );

      if (logoResult.error) throw logoResult.error;

      const logoPath = logoResult.data.path;

      return await trx
        .insert(banks)
        .values({
          nameTH: input.nameTH,
          nameEN: input.nameEN,
          logoUrl: logoPath,
        })
        .returning({ id: banks.id });
    });
    return id;
  }
);
