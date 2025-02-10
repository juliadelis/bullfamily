"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface SidebarItemProps {
  children?: React.ReactNode;
  text: string;
  href?: string;
  icon?: React.ReactNode;
}

export const SidebarItem = ({
  children,
  href,
  icon,
  text,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = useMemo(() => {
    const normalizedPath = pathname.replace(/\/$/, "");
    const normalizedHref = href?.replace(/\/$/, ""); // Remove barra final, se houver

    return normalizedPath === normalizedHref;
  }, [pathname, href]);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const textChild = typeof children === "string" ? children : null;
  const nodeChildren = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  const hasChildren = nodeChildren.length > 0;

  return (
    <div className="w-full">
      <div
        className={`flex items-center cursor-pointer transition-all ease-in-out ${
          isSelected ? "bg-[#D6D3D0] text-black" : ""
        } py-[2px] pl-6 pr-4 font-semibold`}
        onClick={hasChildren ? toggleExpand : undefined}>
        <span className="flex items-center justify-center w-5 h-5">
          {icon ||
            (hasChildren ? (
              isExpanded ? (
                <FiChevronDown />
              ) : (
                <FiChevronRight />
              )
            ) : null)}
        </span>
        {href ? (
          <Link href={href} className="flex-1">
            {text}
          </Link>
        ) : (
          <p className="flex-1">{text}</p>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {nodeChildren.map((child, index) => (
            <div key={index}>{child}</div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SubSidebarItemProps {
  children: string;
  href: string;
}

export const SubSidebarItem = ({ children, href }: SubSidebarItemProps) => {
  const pathname = usePathname();
  const isSelected = useMemo(
    () => (pathname.includes(href) && href !== "/") || href === pathname,
    [pathname]
  );

  return (
    <Link
      className={`block  transition-all ease-in-out py-[2px] pl-11 pr-4`}
      href={href}>
      {children}
    </Link>
  );
};
