"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Footer from "../components/Footer";
import PlansPageWrapper from "../components/PageWrapper";
import { ArrowLeft } from "lucide-react";

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div>
        <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div>
        <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div>
        <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="h-10 bg-slate-200 rounded-full"></div>
    </div>
  );
}

function ClassicContactForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setShowSkeleton(true);
    setMessage({ type: "", text: "" });

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setShowSkeleton(false);

      // Simulate success
      const isSuccess = true;

      if (isSuccess) {
        setMessage({
          type: "success",
          text: "We successfully received your query. We will reach you soon!",
        });
        e.currentTarget.reset();
      } else {
        setMessage({
          type: "error",
          text: "Failed to send message. Please try again.",
        });
      }
    }, 1500);
  };

  return (
    <>

      <div className="fixed top-20 lg:left-44 left-4 z-50">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full bg-white border border-slate-200 hover:bg-[#5d57ee]/10 text-[#5d57ee] shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <section className="container mx-auto px-4 py-28 md:px-6 md:py-24 lg:py-32 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-lg">
          <div className="mb-10 mt-6 text-center">
            <h2 className="mb-2 text-3xl font-bold text-[#5d57ee] tracking-tight sm:text-4xl">
              Help & Support
            </h2>
            <p className="text-muted-foreground text-gray-600">
              We'd love to hear from you. Please fill out the form below and
              we'll get back to you as soon as possible.
            </p>
          </div>

          <Card className="p-6 border shadow-xl border-slate-200">
            <CardContent>
              {showSkeleton ? (
                <SkeletonLoader />
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <Label
                      htmlFor="name"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="rounded-xl border border-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      required
                      className="rounded-xl border border-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this regarding?"
                      required
                      className="rounded-xl border border-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Your message"
                      required
                      className="resize-none rounded-xl border border-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full text-white bg-gradient-to-r from-[#5d57ee] to-[#353188] transition-all duration-300 ease-in-out hover:from-[#353188] hover:to-[#5d57ee] hover:shadow-lg border-none outline-none font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>

                  {message.text && (
                    <div
                      className={`text-center text-sm font-medium p-3 rounded-lg ${
                        message.type === "success"
                          ? "text-green-700 bg-green-50 border border-green-200"
                          : "text-red-700 bg-red-50 border border-red-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <p className="text-muted-foreground text-center text-sm text-gray-500">
                    We'll respond to your message within 1–2 business days.
                  </p>
                </form>                               
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ContactCards() {
  return (
    <PlansPageWrapper>
      <ClassicContactForm />
    </PlansPageWrapper>
  );
}   