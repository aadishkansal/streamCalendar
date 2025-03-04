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
            name: "",
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

    return()
};

export default page;