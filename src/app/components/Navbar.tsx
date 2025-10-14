"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { navLinks } from "../constants";
import Button from "./ui/Button";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const onSubmit = async () => {
    router.push("/o-sign-up");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between w-screen items-center bg-slate-50 drop-shadow-xl rounded-xl fixed max-container p-4 py-3 mt-2 z-50">
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between w-full">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col justify-center items-center w-6 h-6 space-y-1"
          >
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          {/* Logo - Mobile */}
          <Link href="/" className="flex items-center mx-auto">
            <Image src="/streamlogo.svg" alt="logo" width={24} height={24} />
            <Image
              className="ml-1"
              src="/StreamCalendar.svg"
              alt="streamcalendar"
              width={100}
              height={20}
            />
          </Link>

          {/* User Menu Icon */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="flex flex-col absolute justify-center items-center right-0 w-40 bg-white rounded-xl mt-4 shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  href="/sign-in"
                  className="block px-4 py-2 text-base text-center font-bold hover:text-[#5d57ee] text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Login
                </Link>
                <div className="px-4 py-2">
                  <Button
                    type="button"
                    title="Sign up"
                    variant="btn_purple"
                    onClick={() => {
                      onSubmit();
                      setIsUserMenuOpen(false);
                      
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex relative justify-between items-center w-full -m-2">
          {/* Logo - Desktop */}
          <Link href="/" className="flex items-center">
            <Image src="/streamlogo.svg" alt="logo" width={40} height={60} />
            <Image
              className="ml-2"
              src="/StreamCalendar.svg"
              alt="streamcalendar"
              width={153}
              height={30}
            />
          </Link>

          {/* Navigation Links - Centered */}
          <ul className="  flex gap-8 mt-2 items-center text-[16px]">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className="text-[#221f1f] font-semibold font-['inter'] flexCenter cursor-pointer transition-all pb-1.5 hover:text-[#5d57ee]"
              >
                {link.label}
              </Link>
            ))}
          </ul>

          {/* Auth Buttons - Desktop */}
          <div className="flex justify-between items-center">
            <Link
              href="/sign-in"
              className="px-2 text-[16px] font-['inter'] font-semibold hover:text-[#5d57ee] transition-colors"
            >
              Login
            </Link>
            <Button
              type="button"
              title="Sign up"
              variant="btn_purple"
              onClick={onSubmit}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 pt-20">
          <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <div className="flex-1 px-6 py-8">
              <ul className="space-y-6">
                {navLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="block text-xl font-semibold font-['inter'] text-gray-800 hover:text-[#5d57ee] transition-colors py-3"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Menu Button */}
            <div className="p-6 mb-24">
              <button
                onClick={closeMobileMenu}
                className="w-full bg-gray-100 rounded-xl text-gray-700 py-3 px-4 font-semibold hover:bg-gray-200 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;