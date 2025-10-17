"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import googleIcon1 from "../../../asset/googleIcon1.svg";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";

interface LockoutData {
  attempts: number;
  lockedUntil: number | null;
}

function SignInFormInner() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [lockoutData, setLockoutData] = useState<LockoutData>({
    attempts: 0,
    lockedUntil: null,
  });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 10 * 60 * 1000;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // watch from react-hook-form
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const watchedValues = watch();
  const currentEmail = watchedValues.identifier?.trim().toLowerCase();
  const isFormValid =
    watchedValues.identifier?.trim() && watchedValues.password?.trim();

  useEffect(() => {
    if (currentEmail) {
      const stored = localStorage.getItem(`lockout_${currentEmail}`);
      if (stored) {
        const parsed: LockoutData = JSON.parse(stored);
        setLockoutData(parsed);
        if (parsed.lockedUntil && Date.now() < parsed.lockedUntil) {
          setRemainingTime(Math.ceil((parsed.lockedUntil - Date.now()) / 1000));
        }
      } else {
        setLockoutData({ attempts: 0, lockedUntil: null });
        setRemainingTime(0);
      }
      setErrorMessage(""); // clear any leftover errors when email changes
    }
  }, [currentEmail]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            if (currentEmail) {
              const resetData = { attempts: 0, lockedUntil: null };
              setLockoutData(resetData);
              localStorage.setItem(
                `lockout_${currentEmail}`,
                JSON.stringify(resetData)
              );
              setErrorMessage("");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime, currentEmail]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateLockoutData = (email: string, newData: LockoutData) => {
    setLockoutData(newData);
    localStorage.setItem(`lockout_${email}`, JSON.stringify(newData));
  };

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const email = data.identifier.trim().toLowerCase();

    if (lockoutData.lockedUntil && Date.now() < lockoutData.lockedUntil) {
      const remainingSecs = Math.ceil(
        (lockoutData.lockedUntil - Date.now()) / 1000
      );
      setRemainingTime(remainingSecs);
      setErrorMessage(
        `Too many failed attempts. Please try again in ${formatTime(remainingSecs)}.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      console.log("error signing in:", result.error);

      const newAttempts = lockoutData.attempts + 1;
      const remainingAttempts = MAX_ATTEMPTS - newAttempts;

      // Since your auth returns generic "Invalid credentials" for all errors,
      // we'll show a generic message with attempt counter
      let errorMsg = `Invalid credentials. ${remainingAttempts} attempt(s) remaining.`;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Lock the account
        const lockedUntil = Date.now() + LOCKOUT_DURATION;
        const newLockoutData: LockoutData = {
          attempts: newAttempts,
          lockedUntil,
        };
        updateLockoutData(email, newLockoutData);
        setRemainingTime(Math.ceil(LOCKOUT_DURATION / 1000));
        setErrorMessage(
          `Too many failed attempts. Your account is locked for ${formatTime(
            Math.ceil(LOCKOUT_DURATION / 1000)
          )}.`
        );
      } else {
        // Increment attempts
        const newLockoutData: LockoutData = {
          attempts: newAttempts,
          lockedUntil: null,
        };
        updateLockoutData(email, newLockoutData);
        setErrorMessage(errorMsg);
      }

      setIsSubmitting(false);
      return;
    }

    if (result?.ok) {
      // Reset lockout data on successful login
      const resetData = { attempts: 0, lockedUntil: null };
      updateLockoutData(email, resetData);
      console.log("Sign in successful");
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
  };

  const isLocked = !!(
    lockoutData.lockedUntil && Date.now() < lockoutData.lockedUntil
  );

  return (
    <>
      <Navbar />
      <section className="flex justify-between">
        {/* Left Side (Hidden on Small Screens) */}
        <div className="hidden lg:flex bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 backdrop-blur-4xl brightness-120 h-screen w-[500px]"></div>

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
            onClick={() => signIn("google", { callbackUrl: "/" })}
          />

          <h2 className="-mt-6 -mb-8">---------- or ----------</h2>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-[540px] max-md:w-[360px] -mt-6">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {isLocked && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-[540px] max-md:w-[360px] -mt-6">
              <span className="block sm:inline">
                Too many failed attempts. Try again in{" "}
                {formatTime(remainingTime)}.
              </span>
            </div>
          )}

          {/* Sign In Form */}
          <form
            className="max-md:flex-col max-md:ml-5 mr-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Input */}
            <div className="mt-3 mb-3">
              <h6 className="font-['Inter'] text-[16px] font-semibold">
                Email
              </h6>
              <input
                className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
                type="text"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center">
                <h6 className="font-['Inter'] text-[16px] font-semibold">
                  Password
                </h6>
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
                  {...register("password")}
                  disabled={isLocked}
                  onFocus={() => {
                    if (isLocked) {
                      setErrorMessage("");
                      setRemainingTime((prev) => prev);
                    }
                  }}
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
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {lockoutData.attempts > 0 && !isLocked && (
              <div className="mb-3 text-sm text-orange-600 font-medium">
                ⚠️ Warning: {MAX_ATTEMPTS - lockoutData.attempts} attempt(s)
                remaining before lockout
              </div>
            )}

            {/* Sign in Button */}
            <Button
              type="submit"
              title="Sign in"
              variant="btn_big2"
              onClick={() => {}}
              disabled={!isFormValid || isSubmitting || isLocked}
            />
          </form>
        </div>
      </section>
    </>
  );
}

export default function SignInForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <SignInFormInner />
    </Suspense>
  );
}
