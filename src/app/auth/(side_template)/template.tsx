import { ReactNode } from "react";
import Image from "next/image";
import { env } from "@/env.mjs";

export default function Template({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted lg:flex-row">
      <div className="sticky top-0 left-0 right-0 flex items-center justify-between gap-5 px-5 py-2 bg-white shadow-md lg:flex-col lg:flex-1 lg:max-w-3xl lg:items-center flex-row-reverse lg:justify-center">
        <Image
          src="/ptt-or-logo.png"
          alt="PTT OR Logo"
          width={260}
          height={100}
          className="w-auto h-[35px] lg:h-[100px]"
        />
        <div className="lg:text-center lg:space-y-2">
          <h1 className="font-bold text-xl lg:text-4xl">
            {env.NEXT_PUBLIC_ORGANIZATION_NAME}
          </h1>
          <p className="font-medium text-muted-foreground text-sm lg:text-base">
            Authentication
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex">
        <div className="flex px-4 py-5 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
