"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { verifyotpSchema } from "@/schemas/verifyotpSchema";

export default function VerifyOtp() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof confirmPas>>({
        resolver: zodResolver(confirmPas),
        defaultValues: {
            email: "",
            otp: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof confirmPas>) => {

    }

    return (
        <div>

        </div>
    );
}
