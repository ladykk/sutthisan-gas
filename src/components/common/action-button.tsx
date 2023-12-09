"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export function BackButton() {
  const router = useRouter();
  return (
    <Button
      size="icon"
      variant="outline"
      type="button"
      onClick={() => router.back()}
    >
      <ChevronLeftIcon className="w-full h-full" />
    </Button>
  );
}
