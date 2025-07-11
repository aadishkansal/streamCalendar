"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigationLink } from "../constants";
import Button from "./ui/Button";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
const MainNavbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const onSubmit = async () => {
    router.push("/sign-up");
  };
  const [credit, setCredit] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = async () => {
    await signOut();
    router.replace("/");
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
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center bg-slate-50 drop-shadow-xl rounded-xl fixed max-container p-4 py-1 mr-24 ml-24 mt-2 z-10">
      {/* Left section - Logo */}
      <div className="flex-shrink-0">
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
              className="ml-2"
              src="/StreamCalendar.svg"
              alt="streamcalander"
              width={153}
              height={30}
            />
          </div>
        </Link>
      </div>

      {/* Center section - Navigation Links */}
      <div className="flex justify-center flex-1 px-24">
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
      </div>

      {/* Right section - Credit & User */}
      <div className="flex justify-end items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-4 whitespace-nowrap font-medium text-base">
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

        <div className="relative inline-block" ref={dropdownRef}>
          <img
            src="/user1.svg"
            alt="User"
            className="min-w-10 min-h-10 rounded-full cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-40 bg-white rounded-xl font-semibold shadow-lg z-10 transition-all duration-300">
              <div className="px-4 py-2 text-base">Hi {user?.name}</div>
              <ul className="flex items-center gap-2 px-4 py-2 cursor-pointer">
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
  );
};

export default MainNavbar;
