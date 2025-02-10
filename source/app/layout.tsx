"use client";

import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
//import { headers } from "next/headers";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { URL } from "url";
import "./globals.css";
import Navbar from "@/components/navBar";
import NewNavbar from "@/components/newNavBar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Bulls Family Real State",
//   description: "",
// };

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  if (path.includes("login")) {
    return (
      <html lang="pt-BR" className={inter.className}>
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-background text-foreground">
          <main className="min-h-screen">{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="bg-background flex text-foreground overflow-x-hidden justify-between">
        <div className="hidden md:block">
          <NewNavbar />
        </div>

        <div className="md:mt-[54px]">
          <Sidebar />
        </div>

        <main className="h-screen mt-[54px] w-screen p-4 md:p-0 md:ml-[234px] ">
          <div className="z-6 ">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
