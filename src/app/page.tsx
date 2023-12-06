import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env.mjs";
import {
  GitHubLogoIcon,
  EnvelopeClosedIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-1 flex-col justify-center items-center">
        <Image
          src="/ptt-or-logo.png"
          alt="PTT OR Logo"
          width={260}
          height={100}
          className="mb-5"
        />
        <h1 className="font-bold text-4xl mb-2">
          {env.NEXT_PUBLIC_ORGANIZATION_NAME}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          A Mono-Repo Next.js Application for "
          {env.NEXT_PUBLIC_ORGANIZATION_NAME}"
        </p>
        <Link
          className={buttonVariants({ variant: "link" })}
          href="https://github.com/ladykk/sutthisan-gas"
          target="_blank"
        >
          Repository URL
        </Link>
        <div></div>
      </div>
      <Separator />
      <footer className="p-3 flex justify-between items-center w-full">
        <p className="mr-auto text-sm font-medium">
          Develop by Mr.Rattapon Apiratjit
        </p>
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="tel:+66623434114"
        >
          <MobileIcon className="mr-2" />
          (+66) 62-343-4114
        </Link>
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="mailto:krtp.apirat@gmail.com"
        >
          <EnvelopeClosedIcon className="mr-2" />
          krtp.apirat@gmail.com
        </Link>
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="https://github.com/ladykk"
          target="_blank"
        >
          <GitHubLogoIcon className="mr-2" /> ladykk
        </Link>
      </footer>
    </main>
  );
}
