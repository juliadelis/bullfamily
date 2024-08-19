"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { isAdmin } from "@/utils/isAdmin";
import NavLink from "./NavLink";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import MenuOverlay from "./MenuOverlay";

const Navbar = () => {
  const [isAdminBoolean, setIsAdminBoolean] = useState<boolean>(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    isAdmin().then((data) => {
      setIsAdminBoolean(Boolean(data));
    });
  }, []);

  const navLinks = [
    {
      title: "HOME",
      path: "/",
    },
    {
      title: "IMÓVEL",
      path: "/imovel",
    },
    {
      title: "RELATÓRIOS",
      path: "/relatorios",
    },
    {
      title: "GANHOS MENSAIS",
      path: "/relatorios/ganhos-e-perdas-totais-do-mes",
    },
    {
      title: "INADIMPLENTES",
      path: "/inadimplentes",
    },
    {
      title: "IMÓVEIS VAGOS",
      path: "/relatorios/imoveis-vagos-neste-mes",
    },

    isAdminBoolean
      ? { title: "ADMINISTRADOR", path: "/admin" }
      : { title: "", path: "" },
  ];

  return (
    <nav className="fixed mx-auto border-b bg-[white] border-b-[#94A3B8] top-0 left-0 right-0 z-50">
      <div className="flex flex-row container py-2  items-center justify-between mx-auto px-4 ">
        <Link
          href="/"
          className="text-[18px] text-black font-semibold w-[127px]">
          Bull Family Real State
        </Link>

        <div className="mobile-menu block md:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-black text-black ">
              <RxHamburgerMenu className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-black text-black ">
              <IoCloseOutline className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-6 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/usuario"
          className="hidden md:block py-2 pl-3 pr-4 font-medium text-black text-[14px] rounded md^:p-0">
          USUÁRIO
        </Link>
      </div>

      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
