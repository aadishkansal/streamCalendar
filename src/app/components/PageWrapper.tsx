
"use client";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import MainNavBar from "./MainNavBar";
// import MainNavBar from "../components/MainNavBar";

interface PlansPageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PlansPageWrapperProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center ml-2">
        {isAuthenticated ? <MainNavBar /> : <Navbar />}
      </div>
      {children}
    </>
  );
}