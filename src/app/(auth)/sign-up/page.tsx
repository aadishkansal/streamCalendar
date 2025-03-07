"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { debounce } from "lodash";

const SignUpPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
    });

    // Debounced username check function
    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (username.length < 3) {
                setUsernameAvailable(null);
                setIsCheckingUsername(false);
                return;
            }

            setIsCheckingUsername(true);
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                setUsernameAvailable(response.data.success);
            } catch (error) {
                console.error("Error checking username:", error);
                setUsernameAvailable(null);
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500), // 500ms debounce time
        []
    );

    // Effect to trigger debounce when username changes
    useEffect(() => {
        if (username) checkUsername(username);
    }, [username, checkUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!checkBox || usernameAvailable === false){
            console.log("checkBox has to be clicked");
            return;
        }; // Prevent submission if username is taken

        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.log(axiosError.response?.data.message ?? "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex justify-between">
            {/* Left Side */}
            <div className="hidden lg:flex bg-[#5D57EE80] h-screen w-[500px]"></div>

            {/* Right Side - Form Section */}
            <div className="flex flex-col justify-center items-center w-full gap-10 h-screen">
                <h1 className="font-['Inter'] text-[24px] font-bold max-md:text-[20px]">
                    Sign up to Stream <span className="text-[#5D57EE]">Calendar</span>
                </h1>

                <form className="max-md:flex-col max-md:ml-5 mr-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name & Username */}
                    <div className="flex justify-between gap-12 max-md:flex-col max-md:gap-4">
                        <div>
                            <h6 className="font-['Inter'] text-[16px] font-semibold">Name</h6>
                            <input
                                type="text"
                                className="border border-[#5D57EE80] rounded-xl w-[200px] h-12 p-4 max-md:w-[360px]"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div>
                            <h6 className="font-['Inter'] text-[16px] font-semibold">Username</h6>
                            <input
                                type="text"
                                className="border border-[#5D57EE80] rounded-xl w-[200px] h-12 p-4 max-md:w-[360px]"
                                {...register("username")}
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setValue("username", e.target.value); // Ensure it updates form state
                                }}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            
                            {/* Username availability feedback */}
                            {isCheckingUsername && (
                                <p className="text-blue-500 text-sm">Checking...</p>
                            )}
                            {usernameAvailable === false && (
                                <p className="text-red-500 text-sm">Username is already taken</p>
                            )}
                            {usernameAvailable === true && (
                                <p className="text-green-500 text-sm">Username is available</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-3 mb-3">
                        <h6 className="font-['Inter'] text-[16px] font-semibold">Email</h6>
                        <input
                            type="email"
                            className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <h6 className="font-['Inter'] text-[16px] font-semibold">Password</h6>
                        <input
                            type="password"
                            className="border border-[#5D57EE80] rounded-xl w-[540px] h-12 p-4 max-md:w-[360px]"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex gap-2 mt-3">
                        <input
                            type="checkbox"
                            className="border border-[#5D57EE80] rounded-xl size-6"
                            onChange={() => setCheckBox(!checkBox)}
                        />
                        <label className="text-[12px]">
                            I agree with StreamCalendar’s Terms of Service, Privacy Policy, and <br className="hidden md:block" />
                            default Notification Settings.
                        </label>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                        type="submit"
                        title="Sign up"
                        variant="btn_big1"
                        onClick={() => {}}
                        //disabled={!checkBox || isSubmitting || usernameAvailable === false || isCheckingUsername} // Prevent submission if username is taken or still checking
                    />
                </form>

                <h6 className="text-sm">
                    Already have an account? <Link href="/sign-in">Sign In</Link>
                </h6>
            </div>
        </section>
    );
};

export default SignUpPage;