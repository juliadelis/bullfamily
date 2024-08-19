"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface Props {
  children: string;
  href: string;
}

export const SidebarItem = ({ children, href }: Props) => {
  const pathname = usePathname();
  const isSelected = useMemo(
    () => (pathname.includes(href) && href !== "/") || href === pathname,
    [pathname]
  );

  return (
    <Link
      className={`${
        isSelected ? "bg-white w-full text-black py-8 pl-8 rounded-l-full" : ""
      } transition-all ease-in-out`}
      href={href}
    >
      {children}
    </Link>
  );
};
