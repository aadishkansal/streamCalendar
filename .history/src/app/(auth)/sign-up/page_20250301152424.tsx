"use client"

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axioserror = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axioserror.response?.data.message ?? "Error checking username");  
                }  finally{
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    },[username]);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            toast({title: "success", description: response.data.message});
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({title: "Sign up failed", description: errorMessage ?? "An error occurred", variant: "destructive"});
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join My Blog App
                    </h1>
                    <p className="mb-4">Sign up to have your own blog account</p>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input
                            {...field}
                            onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                            }}
                        />
                        {isCheckingUsername && <Loader2 className="animate-spin"/>}
                        {!isCheckingUsername && usernameMessage && (
                            <p
                            className={`text-sm ${
                                usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"
                            }`}
                            aria-live="polite"
                            >
                                {usernameMessage}
                            </p>
                            )}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField 
                        name="email"
                        control={form.control}
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input {...field} name="email" />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({field})=> (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <Input {...field} type="password"/>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full' disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                </form>
                </Form>
                <div className="text-center mt-4">
                <p>
                    Already a member?{" "}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                        Sign in
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
};

export default page;