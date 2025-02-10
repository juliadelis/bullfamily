"use client";

import { Button, ButtonGroup } from "@mui/material";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
}

interface SubMenuProps {
  menuItems: MenuItem[];
}

export default function SubMenu({ menuItems }: SubMenuProps) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto whitespace-nowrap pb-2">
      <ButtonGroup
        size="small"
        color="inherit"
        variant="text"
        aria-label="Basic button group"
        className="text-[12px] pb-2">
        {menuItems.map((item) => {
          pathname === item.href;

          return (
            <Button
              key={item.href}
              href={item.href}
              className={`text-[12px] whitespace-nowrap`}>
              {item.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
