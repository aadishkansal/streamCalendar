"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "../constants";
import Button from "./ui/Button";

const Navbar = () => {
  const router=useRouter();
  const onSubmit = async () => {
    router.push("/sign-up");
  };
  
  return (
    <nav className=" flex justify-between place-items-center bg-slate-50 drop-shadow-xl rounded-xl  gap-44 fixed max-container p-4  py-1 mr-24 ml-24 mt-2 z-10">
      <div>
        <Link href="/">
        <div className="items-center flex ">
          {" "}
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
      <div>
      <ul className="hidden h-full gap-8 lg:flex items-center text-16 mt-2 ">
        {navLinks.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className=" text-#221f1f font-semibold font-['inter'] flexCenter cursor-pointer transition-all pb-1.5 hover:text-[#5d57ee] "
          >
            {link.label}
          </Link>
        ))}
      </ul>
      </div>
      <div className="flex justify-between place-items-center">
      <a className="px-2 text-16 font-['inter'] font-semibold  ">Login</a>
      <Button 
      type="button"
      title="Sign up"
      variant="btn_purple"
      onClick={onSubmit}

      />
      </div>
    
    </nav>
  );
};

export default Navbar;
