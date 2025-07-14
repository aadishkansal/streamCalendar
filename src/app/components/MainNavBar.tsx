"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { navigationLink } from "../constants";
import Button from "./ui/Button";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

import { useSession } from "next-auth/react";
import { FlameIcon, Settings, User2Icon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const MainNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  
  // Check if current page is the specific calendar route
  const isCalendarPage = pathname.startsWith('/calendar');  
  const onSubmit = async () => {
    router.push("/plans");
  };
  
  const onSettings = async () => {
    router.push("/settings");
  }

  const [credit, setCredit] = useState<number>(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const calendarRef = useRef(null);
const userDropdownRef = useRef(null);
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };
  
  useEffect(() => {
    if (session?.user?.projectIds) {
      const used = session.user.projectIds.length;
      setCredit(2 - used);
    }
  }, [session]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !(calendarRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !(userDropdownRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideMenu = (e: MouseEvent) => {
      if (isMobileMenuOpen && !(e.target as HTMLElement).closest('.mobile-menu-overlay')) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideMenu);
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="flex justify-between items-center w-screen bg-slate-50 drop-shadow-xl rounded-xl fixed max-container p-4 py-1 mr-28 ml-24 mt-2 z-50">
        {/* Left section - Hamburger + Logo */}
        <div className="flex items-center justify-between  mobile-menu-overlay gap-3">
          {/* Hamburger Menu - Only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col justify-center lg:hidden items-center w-6 h-6 space-y-1"
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

          {/* Logo */}
          <Link href="/">
            <div className="items-center flex">
              <Image
                className=""
                src="/streamlogo.svg"
                alt="logo"
                width={40}
                height={60}
              />
              <Image
                className="ml-2 hidden sm:block"
                src="/StreamCalendar.svg"
                alt="streamcalander"
                width={153}
                height={30}
              />
              {/* Mobile logo text */}
              <Image
                            className="ml-1 sm:hidden"
                            src="/StreamCalendar.svg"
                            alt="streamcalendar"
                            width={100}
                            height={20}
                          />
            </div>
          </Link>
        </div>

        {/* Center section - Navigation Links (Desktop only) */}
        <div className="hidden lg:flex justify-center flex-1 px-24">
          {!isCalendarPage && (
            <ul className="hidden h-full gap-8 lg:flex items-center text-[16px] mt-2">
              {navigationLink.map((link) => (
                <Link
                  href={link.href}
                  key={link.key}
                  className="text-[#221f1f] font-semibold whitespace-nowrap font-['inter'] flexCenter cursor-pointer transition-all pb-1.5 hover:text-[#5d57ee]"
                >
                  {link.label}
                </Link>
              ))}
            </ul>
          )}
        </div>

        {/* Right section - Credit & User (Desktop) / User only (Mobile) */}
        <div className="flex justify-end items-center gap-6 flex-shrink-0">
          {/* Credit section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 whitespace-nowrap font-medium text-base">
            Credit: {credit} left
            <Button
              type="button"
              icon="/upgrade.svg"
              title="Upgrade"
              variant="btn_purple"
              onClick={onSubmit}
              className="!w-[145px]"
            />
          </div>

<div className="lg:hidden relative inline-flex flex-row items-center" ref={calendarRef}>

  <FlameIcon
    className="w-6 h-6"
    onClick={() => setIsCalendarOpen((prev) => !prev)}
    style={{
      stroke: 'url(#halfOrangeGradient)',
    }}
  />

  {/* SVG gradient definition (invisible container) */}
  <svg width="0" height="0">
    <defs>
      <linearGradient id="halfOrangeGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="50%" stopColor="#c86300" />
        <stop offset="50%" stopColor="#f97316" />
      </linearGradient>
    </defs>
  </svg>


  <span className="text-base font-semibold text-gray-700 mt-1">3</span>
  {isCalendarOpen && (
    <div className="absolute right-0 mt-96 w-60 bg-white rounded-xl font-semibold shadow-lg z-10 transition-all duration-300">
     <Calendar className="w-full h-full" 
     showOutsideDays={false}/>
    </div>)}


</div>

          {/* User dropdown */}
          <div className="relative inline-block" ref={userDropdownRef}>
            <img
              src="/user1.svg"
              alt="User"
              className="min-w-10 min-h-10 rounded-full cursor-pointer"
              onClick={() => setIsUserDropdownOpen((prev) => !prev)}
            />

            {isUserDropdownOpen&& (
              <div className="absolute right-0 mt-4 w-40 bg-white rounded-xl font-semibold shadow-lg z-10 transition-all duration-300">
                <ul className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                  <User2Icon/>
                  <span className="text-base">
                    Hi {user?.name}
                  </span>
                </ul>
                
                {/* Credit section - Visible on mobile only */}
                <div className="md:hidden px-3 py-2 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Credit: {credit} left
                  </div>
                  <Button
                    type="button"
                    icon="/upgrade.svg"
                    title="Upgrade"
                    variant="btn_purple"
                    onClick={() => {
                      onSubmit();
                      setIsUserDropdownOpen(false);
                    }}
                    className="!w-full !text-sm !py-2"
                  />
                </div>
                
                <ul className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:border hover:bg-slate-200 ">
                  <Settings/>
                  <span className="text-base" onClick={onSettings}>
                    Settings
                  </span>
                </ul>
                <ul className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:border hover:bg-slate-200 rounded-b-xl">
                  <img src="/logout.svg" alt="Logout" className="w-5 h-5" />
                  <span className="text-base" onClick={handleLogout}>
                    Log Out
                  </span>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 mobile-menu-overlay bg-white z-40 pt-20">
          <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <div className="flex-1 px-6 py-8">
              <ul className="space-y-6">
                {navigationLink.map((link) => (
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
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={closeMobileMenu}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
};

export default MainNavbar;