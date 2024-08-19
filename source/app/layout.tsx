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
      <body className="bg-background flex text-foreground overflow-x-hidden ">
        {/* <Sidebar /> */}
        <Navbar />
        <main className="h-screen mt-[70px] pb-[70px] ">
          <img
            src="https://res.cloudinary.com/df7wdqak7/image/upload/v1715622122/background_szvaad.png"
            alt="bg"
            className="-z-10 fixed h-auto w-full object-cover min-h-full overflow-hidden "
          />
          <div className="z-6 ">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
