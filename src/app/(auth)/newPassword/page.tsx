"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/components/ui/Button";
import { confirmPasswordSchema } from "@/schemas/confirmPasswordSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Navbar from "@/app/components/Navbar";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Extract email from URL

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmPasswordSchema>>({
    resolver: zodResolver(confirmPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof confirmPasswordSchema>) => {
    try {
      const response = await axios.post("/api/set-new-pass", { ...data, email });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
    }
  };

  return (<>
  <Navbar/>
    <section className="flex justify-between">
      <div className="hidden lg:flex  bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 h-screen w-[500px]"></div>

      <div className="flex flex-col justify-center items-center w-full gap-10 h-screen">
        <h1 className="font-['inter'] text-[24px] font-bold max-md:text-[20px]">
          Change Password
        </h1>

        <form className="max-md:flex-col max-md:ml-5 mr-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3 mb-3">
            <h6 className="font-['inter'] text-[16px] font-semibold">New Password</h6>
            <input
              className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
              type="password"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <h6 className="font-['inter'] text-[16px] font-semibold">Confirm Password</h6>
            <input
              className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" title="Submit" variant="btn_big1" onClick={() => {}} />
        </form>
      </div>
    </section></>
  );
}