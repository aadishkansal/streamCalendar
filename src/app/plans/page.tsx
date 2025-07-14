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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";
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
      {
        name: "Open/High/Low/Close",
        free: true,
        premium: true,
      },
      {
        name: "Price-volume difference indicator",
        free: true,
        premium: true,
      },
    ],
  },
  {
    type: "On-chain data",
    features: [
      {
        name: "Network growth",
        free: true,
        premium: true,
      },
      {
        name: "Average token age consumed",
        free: true,
        premium: true,
      },
      {
        name: "Exchange flow",
        free: false,
        premium: true,
      },
      {
        name: "Total ERC20 exchange funds flow",
        free: false,
        premium: true,
      },
    ],
  },
  {
    type: "Social data",
    features: [
      {
        name: "Dev activity",
        free: false,
        premium: true,
      },
      {
        name: "Topic search",
        free: true,
        premium: true,
      },
      {
        name: "Relative social dominance",
        free: true,
        premium: true,
      },
    ],
  },
];

function PricingContent() {
  return (
    <>
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 pb-2 text-4xl font-bold text-[#5d57ee] tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-sm">
            Whatever your status, our offers evolve according to your needs.
          </p>
          <h2 className="scroll-m-20 pb-2 mt-10 text-2xl font-bold text-black tracking-tight transition-colors first:mt-0">
            Plans
          </h2>
        </div>
       
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:items-center">
          {/* Free Plan Card */}
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
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">1 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Plan features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl font-medium border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Sign up
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan Card */}
          <Card className="border-[#5d57ee] border flex flex-col">
            <CardHeader className="text-center text-xl pb-2">
              <Badge className="uppercase w-max font-semibold bg-[#5d57ee] text-white rounded-xl self-center mb-3">
                Most popular
              </Badge>
              <CardTitle className="!mb-7">Yearly plan</CardTitle>
              <span className="font-bold text-5xl">₹39</span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              All the basics for starting a new business
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">2 users</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Plan features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl font-medium border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Get Pro plan
              </Button>
            </CardFooter>
          </Card>

          {/* Monthly Plan Card */}
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
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">5 users</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Plan features</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                  <span className="text-muted-foreground">Product support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl font-medium border border-slate-500 hover:bg-[#5d57ee] hover:text-white">
                Get Pro plan
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Comparison table */}
        <div className="mt-20 lg:mt-32">
          <div className="lg:text-center mb-10 lg:mb-20">
            <h3 className="text-2xl font-semibold dark:text-white">
              Compare plans
            </h3>
          </div>
          
          {/* Desktop table */}
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-3/12 text-primary">Plans</TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Free
                </TableHead>
                <TableHead className="w-2/12 text-primary text-lg font-medium text-center">
                  Premium
                </TableHead>
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
                    <TableRow
                      key={feature.name}
                      className="text-muted-foreground"
                    >
                      <TableCell>{feature.name}</TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {feature.free ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <MinusIcon className="h-5 w-5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mx-auto w-min">
                          {feature.premium ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <MinusIcon className="h-5 w-5" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {/* Mobile tables */}
          <div className="space-y-12 lg:hidden">
            {/* Free Plan Mobile */}
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Free Plan</h4>
              </div>
              <Table>
                <TableBody>
                  {planFeatures.map((featureType) => (
                    <React.Fragment key={featureType.type}>
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableCell
                          colSpan={2}
                          className="w-10/12 text-primary font-bold"
                        >
                          {featureType.type}
                        </TableCell>
                      </TableRow>
                      {featureType.features.map((feature) => (
                        <TableRow
                          className="text-muted-foreground"
                          key={feature.name}
                        >
                          <TableCell className="w-11/12">
                            {feature.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {feature.free ? (
                              <CheckIcon className="h-5 w-5" />
                            ) : (
                              <MinusIcon className="h-5 w-5" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </section>

            {/* Premium Plan Mobile */}
            <section>
              <div className="mb-4">
                <h4 className="text-xl font-medium">Premium Plan</h4>
              </div>
              <Table>
                <TableBody>
                  {planFeatures.map((featureType) => (
                    <React.Fragment key={featureType.type}>
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableCell
                          colSpan={2}
                          className="w-10/12 text-primary font-bold"
                        >
                          {featureType.type}
                        </TableCell>
                      </TableRow>
                      {featureType.features.map((feature) => (
                        <TableRow
                          className="text-muted-foreground"
                          key={feature.name}
                        >
                          <TableCell className="w-11/12">
                            {feature.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {feature.premium ? (
                              <CheckIcon className="h-5 w-5" />
                            ) : (
                              <MinusIcon className="h-5 w-5" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </section>
          </div>
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