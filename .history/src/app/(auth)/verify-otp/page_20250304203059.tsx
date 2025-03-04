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

  const form = useForm<z.infer<typeof verifyotpSchema>>({
    resolver: zodResolver(verify),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verify>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "Login failed",
        description:
          result.error === "CredentialsSignIn"
            ? "Incorrect username or password"
            : result.error,
        variant: "destructive",
      });
      return;
    }

    if (result?.url) {
      router.replace("/"); //user page
    }
  };

  return(
    <div>

    </div>
  );
}
