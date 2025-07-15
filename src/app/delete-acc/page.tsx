"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { confirmPasswordSchema } from "@/schemas/confirmPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import googleIcon1 from '../../asset/googleIcon1.svg';
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import MainNavbar from "@/app/components/MainNavBar";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function SignInForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<z.infer<typeof confirmPasswordSchema>>({
        resolver: zodResolver(confirmPasswordSchema),
    });

    const watchedValues = watch();
    const isFormValid = watchedValues.password?.trim() && watchedValues.confirmPassword?.trim();

    const onSubmit = async (data: z.infer<typeof confirmPasswordSchema>) => {
    setIsSubmitting(true);
    setError("");

    try {
        // Call the DELETE API endpoint to delete the user account
        const response = await axios.delete('/api/delete-user', {
            data: {
                password: data.password,
                confirmPassword: data.confirmPassword,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = response.data;

        if (result.success) {
            // Sign out the user after successful account deletion
            await signOut({ 
                redirect: false,
                callbackUrl: "/"
            });
            // Force redirect to home page (or sign-in page)
            router.push("/");
        }
    } catch (error: any) {
        console.error("Error deleting account:", error);
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError("An error occurred while deleting your account");
        }
        setIsSubmitting(false);
    }
};

    return (
        <>
            <MainNavbar />
            <section className="flex justify-between">
                {/* Left Side (Hidden on Small Screens) */}
                <div className="hidden lg:flex bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 backdrop-blur-4xl brightness-120 h-screen w-[500px]"></div>

                {/* Right Side - Form Section */}
                <div className="flex flex-col justify-center items-center w-full gap-10 h-screen">

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Delete Account</h2>
                        <p className="text-gray-600">Enter your password to confirm account deletion</p>
                    </div>

                    {/* Account Deletion Form */}
                    <form className="max-md:flex-col max-md:ml-5 mr-5" onSubmit={handleSubmit(onSubmit)}>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Password Input */}
                        <div className="mt-3 mb-3">
                            <h6 className="font-['Inter'] text-[16px] font-semibold">Password</h6>
                            <div className="relative">
                                <input
                                    className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 pr-12 max-md:w-[360px]"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password")}
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
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <h6 className="font-['Inter'] text-[16px] font-semibold">Confirm Password</h6>
                                <Link
                                    href="/verify-otp"
                                    className="text-[#5D57EE] text-sm font-medium hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>

                            <div className="relative">
                                <input
                                    className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 pr-12 max-md:w-[360px]"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Warning Message */}
                        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                            <p className="text-sm">
                                <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                            </p>
                        </div>

                        {/* Delete Account Button */}
                        <Button
                            type="submit"
                            title={isSubmitting ? "Deleting Account..." : "Delete Account"}
                            variant="btn_big2"
                            onClick={() => { }}
                            disabled={!isFormValid || isSubmitting}
                        />

                        {/* Cancel Link */}
                        <div className="text-center mt-4">
                            <Link
                                href="/dashboard"
                                className="text-[#5D57EE] text-sm font-medium hover:underline"
                            >
                                Cancel and go back to dashboard
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}