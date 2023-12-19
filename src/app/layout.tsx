import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  title: "Sutthisan Gas",
  description: "Mono repo for Sutthisan Gas",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-[100vw]",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <Providers env={env.NEXT_PUBLIC_ENV}>{children}</Providers>
      </body>
    </html>
  );
}
