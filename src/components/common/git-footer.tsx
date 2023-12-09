import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  MobileIcon,
} from "@radix-ui/react-icons";

export default function GitFooter() {
  return (
    <footer className="p-3 flex justify-between items-center w-full flex-col sm:flex-row">
      <p className="text-sm font-medium h-10 px-4 py-2">
        Develop by Mr.Rattapon Apiratjit
      </p>
      <div className="flex-1" />
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
  );
}
