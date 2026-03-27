"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

const menu = [
  { name: "Home", path: "/" },
  { name: "Models", path: "/models" },
  { name: "Services", path: "/services" },
  // { name: "Rates", path: "/rates" },
  { name: "Blogs", path: "/blogs" },
  { name: "Privacy & Policy", path: "/privacy-policy" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkBaseLight = "relative px-3 py-2 font-medium text-white transition-colors duration-300 hover:text-red-400 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-0 after:w-0 after:h-1 after:bg-red-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-6";

  const linkBaseDark = "relative px-3 py-2 font-medium text-white transition-colors duration-300 hover:text-red-400 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-0 after:w-0 after:h-1 after:bg-red-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-6";

  const isActive = (path: string, isDark: boolean) => {
    const linkBase = isDark ? linkBaseDark : linkBaseLight;
    return pathname === path ? `${linkBase} after:w-6` : linkBase;
  };

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-red-800 px-6" : isHome ? "bg-header" : "bg-red-700"}`}>
        <nav className="flex justify-between items-center px-5 py-5 md:px-10">
          <h1 className="text-2xl font-bold text-white pb-1">
            Swati<span className="text-red-300">Kaur</span>
          </h1>
          {/* Desktop-Menu */}
          <ul className="hidden text-md lg:flex items-center gap-5 pb-1">
            {menu.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={isActive(item.path, scrolled || isHome)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Link href="/contact-us" className="hidden md:flex items-center bg-red-400 tex t-md text-white px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
              Contact Us
              <span className="ml-1 w-6 h-6 flex items-center justify-center rounded-full bg-white text-red-400">
                <FaPhone size={12} />
              </span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden text-3xl transition-all duration-300 
              ${scrolled || isHome ? "text-white" : "text-white" }`}>
              {isOpen ? <IoMdClose /> : <FiMenu />}
            </button>
          </div>
        </nav>
        {/* Mobile-Menu */}
        {isOpen && (
          <div className={`lg:hidden p-5 border-t transition-all duration-300 
            ${scrolled || isHome ? "border-white/20 bg-header" : "bg-red-900"}`}>
            <ul className="flex flex-col items-center gap-3">
              {menu.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} onClick={() => setIsOpen(false)} className={`font-medium transition-colors duration-300 
                    ${scrolled || isHome ? pathname === item.path ? "text-red-400" : "text-white hover:text-red-400" : "text-white hover:text-red-600" }`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}