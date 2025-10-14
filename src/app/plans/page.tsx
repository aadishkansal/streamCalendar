"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import Footer from "../components/Footer";
import PlansPageWrapper from "../components/PageWrapper";

interface PlanFeature {
  type: string;
  features: {
    name: string;
    free: boolean;
    premium: boolean;
  }[];
}

const planFeatures: PlanFeature[] = [
  {
    type: "Financial data",
    features: [
      { name: "Open/High/Low/Close", free: true, premium: true },
      { name: "Price-volume difference indicator", free: true, premium: true },
    ],
  },
  {
    type: "On-chain data",
    features: [
      { name: "Network growth", free: true, premium: true },
      { name: "Average token age consumed", free: true, premium: true },
      { name: "Exchange flow", free: false, premium: true },
      { name: "Total ERC20 exchange funds flow", free: false, premium: true },
    ],
  },
  {
    type: "Social data",
    features: [
      { name: "Dev activity", free: false, premium: true },
      { name: "Topic search", free: true, premium: true },
      { name: "Relative social dominance", free: true, premium: true },
    ],
  },
];

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-24 animate-pulse">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto mb-3"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto"></div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-xl p-6 bg-gray-100 flex flex-col justify-between h-[380px]"
          >
            <div>
              <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 w-1/3 bg-gray-400 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="mt-8 h-10 bg-gray-400 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // simulate loading
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-4xl font-bold text-[#5d57ee] tracking-tight">
            Pricing
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Whatever your status, our offers evolve according to your needs.
          </p>
          <h2 className="mt-10 text-2xl font-bold text-black">Plans</h2>
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:items-center">
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader className="text-center text-xl pb-2">
              <CardTitle className="mb-7">Free plan</CardTitle>
              <span className="font-bold text-4xl">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Forever free
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>1 user</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Plan features</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Sign up
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className="border-[#5d57ee] border flex flex-col">
            <CardHeader className="text-center text-xl pb-2">
              <Badge className="uppercase font-semibold bg-[#5d57ee] text-white rounded-xl self-center mb-3">
                Most popular
              </Badge>
              <CardTitle className="mb-7">Yearly plan</CardTitle>
              <span className="font-bold text-5xl">₹39</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              All the basics for starting a new business
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>2 users</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Plan features</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Get Pro plan
              </Button>
            </CardFooter>
          </Card>

          {/* Monthly Plan */}
          <Card className="flex flex-col">
            <CardHeader className="text-center text-xl pb-2">
              <CardTitle className="mb-7">Monthly plan</CardTitle>
              <span className="font-bold text-4xl">₹89</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              Everything you need for a growing business
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>5 users</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Plan features</span>
                </li>
                <li className="flex space-x-2 items-center">
                  <CheckIcon className="h-4 w-4" /> <span>Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Get Pro plan
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 lg:mt-32">
          <div className="lg:text-center mb-10 lg:mb-20">
            <h3 className="text-2xl font-semibold">Compare plans</h3>
          </div>
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-3/12 text-primary">Plans</TableHead>
                <TableHead className="text-center text-lg">Free</TableHead>
                <TableHead className="text-center text-lg">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((featureType) => (
                <React.Fragment key={featureType.type}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-bold">
                      {featureType.type}
                    </TableCell>
                  </TableRow>
                  {featureType.features.map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell className="text-center">
                        {feature.free ? (
                          <CheckIcon className="h-5 w-5 mx-auto" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.premium ? (
                          <CheckIcon className="h-5 w-5 mx-auto" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function PricingSectionCards() {
  return (
    <PlansPageWrapper>
      <PricingContent />
    </PlansPageWrapper>
  );
}