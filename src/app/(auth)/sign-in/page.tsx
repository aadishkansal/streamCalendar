"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import googleIcon1 from '../../../asset/googleIcon1.svg';
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const {
    register,        
    handleSubmit,     
    formState: { errors },
    watch // Add watch to the destructured useForm return
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema), 
  });

  // Move watch usage inside component after useForm hook
  const watchedValues = watch();
  const isFormValid = watchedValues.identifier?.trim() && watchedValues.password?.trim();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      console.log("error signing in");
      setIsSubmitting(false);
      return;
    }

    if (result?.ok) {
      console.log(result);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Navbar/>
      <section className="flex justify-between">
        {/* Left Side (Hidden on Small Screens) */}
        <div className="hidden lg:flex bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 backdrop-blur-4xl brightness-120h-screen w-[500px]"></div>

        {/* Right Side - Form Section */}
        <div className="flex flex-col justify-center items-center w-full gap-10 h-screen">
          <h1 className="font-['Inter'] text-[24px] font-bold max-md:text-[20px]">
            Sign in to Stream <span className="text-[#5D57EE]">Calendar</span>
          </h1>

          {/* Sign in with Google */}
          <Button
            type="button"
            title="Sign in with Google"
            variant="btn_big1"
            icon={googleIcon1}
            onClick={() => {}}
          />

          <h2 className="-mt-6 -mb-8">---------- or ----------</h2>

          {/* Sign In Form */}
          <form className="max-md:flex-col max-md:ml-5 mr-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mt-3 mb-3">
              <h6 className="font-['Inter'] text-[16px] font-semibold">Email</h6>
              <input
                className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
                type="text"
                {...register("identifier")} // Connects to useForm
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center">
                <h6 className="font-['Inter'] text-[16px] font-semibold">Password</h6>
                <Link
                  href="/verify-otp"
                  className="text-[#5D57EE] text-sm font-medium hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative mb-3">
                <input
                  className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 pr-12 max-md:w-[360px]"
                  type={showPassword ? "text" : "password"}
                  {...register("password")} // Connects to useForm
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Sign in Button */}
            <Button
              type="submit"
              title="Sign in"
              variant="btn_big2"
              onClick={() => {}}
              disabled={!isFormValid || isSubmitting} // Enable button validation
            />
          </form>
        </div>
      </section>
    </>
  );
}