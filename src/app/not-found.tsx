"use client";
import GitFooter from "@/components/common/git-footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <main className=" min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="font-bold text-4xl mb-2">404 | Page Not Found</h1>
        <p className="text-sm text-muted-foreground">
          Not found a path that you are looking for. ({pathName})
        </p>

        <div className="mt-10">
          <Button onClick={() => router.back()}>Back to Previous Page</Button>
        </div>
      </div>
      <Separator />
      <GitFooter />
    </main>
  );
}
