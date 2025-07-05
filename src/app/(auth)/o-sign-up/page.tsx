"use client";
import Button from "@/app/components/ui/Button";
import googleIcon1 from "../../../asset/googleIcon1.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function oSignUp() {
  const router = useRouter();
  const onSubmit = async () => {
    router.push("/sign-up");
  };

  return (
    <div>
      <section className="flex justify-between ">
        <div className=" hidden lg:flex bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 backdrop-blur-4xl brightness-120 h-screen w-[500px]"></div>
        <div className="flex flex-col justify-center items-center w-full gap-12 h-screen">
          <h1 className="font-['inter'] text-[24px] font-bold max-md:text-[20px]">
            Sign up to Stream
            <span className="text-[#5D57EE]">Calendar </span>
          </h1>
          <Button
            type="button"
            title="Sign up with Google"
            variant="btn_big1"
            icon={googleIcon1}
            onClick={onSubmit}
          />
          <h2>---------- or ----------</h2>
          <Button
            type="button"
            title="Continue with email"
            variant="btn_big2"
            onClick={onSubmit}
          />
          <p className="text-center max-md:text-[12px]">
            By creating an account you agree with our Terms of Service, Privacy
            Policy,
            <br /> and our default Notification Settings.
          </p>
          <h6 className="text-sm">
            Already have an account? <Link href="/sign-in">Sign In</Link>
          </h6>
        </div>
      </section>
    </div>
  );
}
