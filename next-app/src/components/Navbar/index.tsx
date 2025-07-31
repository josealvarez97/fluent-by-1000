"use client";
import React, { useState, Fragment } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

interface NavBarProps {
  menuItems?: NavItem[];
}

const menu: NavItem[] = [
    { label: "Bible", href: "/" },
  //   { label: "Home", href: "/" },
  { label: "Frequency", href: "/frequency" },
  { label: "Input", href: "/input" },
  //   {
  //     label: "Books",
  //     children: [
  //       { label: "Genesis", href: "/books/genesis" },
  //       { label: "Exodus", href: "/books/exodus" },
  //     ],
  //   },
  //   { label: "About", href: "/about" },
];

const NavBar: React.FC<NavBarProps> = ({ menuItems = menu }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleToggleMobile = () => setMobileOpen((prev) => !prev);
  const handleSubMenu = (label: string) => {
    setOpenSubMenu((prev) => (prev === label ? null : label));
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-gray-800">
          FluentBy1000
        </Link>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.label} className="relative group">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="text-gray-700 hover:text-gray-900 focus:outline-none">
                  {item.label}
                </button>
              )}
              {item.children && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  {item.children.map((child) => (
                    <li
                      key={child.label}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      {child.href ? (
                        <Link
                          href={child.href}
                          className="block text-gray-600 hover:text-gray-800"
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <span className="block text-gray-600">
                          {child.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={handleToggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <Fragment key={item.label}>
                <li>
                  <div className="flex items-center justify-between">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="block py-2 text-gray-700 hover:text-gray-900"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="block py-2 text-gray-700">
                        {item.label}
                      </span>
                    )}
                    {item.children && (
                      <button
                        onClick={() => handleSubMenu(item.label)}
                        className="focus:outline-none"
                        aria-label="Toggle submenu"
                      >
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            openSubMenu === item.label ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.children && openSubMenu === item.label && (
                    <ul className="pl-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.href ? (
                            <Link
                              href={child.href}
                              className="block py-1 text-gray-600 hover:text-gray-800"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ) : (
                            <span className="block py-1 text-gray-600">
                              {child.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

// Usage Example:
// const menu: NavItem[] = [
//   { label: 'Home', href: '/' },
//   {
//     label: 'Books',
//     children: [
//       { label: 'Genesis', href: '/books/genesis' },
//       { label: 'Exodus', href: '/books/exodus' },
//     ],
//   },
//   { label: 'About', href: '/about' },
// ];
// <NavBar menuItems={menu} />;
