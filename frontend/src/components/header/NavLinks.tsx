"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  mobile?: boolean;
}

const navBarItems = [
  { title: "Home", path: "/" },
  { title: "Services", path: "/services" },
  { title: "About Us", path: "/about" },
  { title: "Pages", path: "/pages" },
  { title: "Contact", path: "/contact" },
];

const NavLinks: React.FC<NavLinksProps> = ({ mobile = false }) => {
  const pathname = usePathname();

  return (
    <ul
      className={`w-full flex gap-6 ${
        mobile
          ? "flex-col items-start"
          : "flex-row items-center h-full space-x-5 mb-0"
      }`}
    >
      {navBarItems.map((link) => (
        <li
          key={link.title}
          className={`list-none m-0 p-1 ${
            mobile ? "" : "ml-5"
          } dark:text-white`}
        >
          <Link
            href={link.path}
            className={`relative overflow-hidden transition-colors ${
              pathname === link.path ? "text-accent" : "hover:text-accent"
            }`}
          >
            {link.title}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 w-full bg-accent transition-transform duration-200 ${
                pathname === link.path ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ transformOrigin: "left" }}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
