import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Footer from '../components/Footer';
import PlansPageWrapper from "../components/PageWrapper";


function ClassicContactForm() {
  return (
    <>
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-24 lg:py-32 2xl:max-w-[1400px] ">
      <div className="mx-auto max-w-lg ">
        <div className="mb-10 mt-6 text-center " >
          <h2 className="mb-2 text-3xl font-bold text-[#5d57ee] tracking-tight sm:text-4xl">
Help & support
          </h2>
          <p className="text-muted-foreground">
            I'd love to hear from you. Please fill out the form below and
            I'll get back to you as soon as possible.
          </p>
        </div>

        <Card className="p-6 border shadow-xl border-slate-200">
          <CardContent>
            <form className="space-y-6 ">
              <div>
                <Label htmlFor="name" className="mb-2 block font-semibold ">
                  Name
                </Label>
                <Input id="name" name="name" placeholder="Your name" required  className='rounded-xl border border-slate-400'/>
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  required
                  className='rounded-xl border border-slate-400'
                />
              </div>

              <div>
                <Label htmlFor="subject" className="mb-2 block font-semibold">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What's this regarding?"
                  required
                  className='rounded-xl border border-slate-400'
                />
              </div>

              <div>
                <Label htmlFor="message" className="mb-2 block font-semibold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Your message"
                  required
                  className="resize-none rounded-xl border border-slate-400"
                  
                />
              </div>

              <Button type="submit" className="w-full rounded-full  text-white bg-gradient-to-r from-[#5d57ee] to-[#353188]  transition-all duration-300 ease-in-out hover:from-[#353188] hover:to-[#5d57ee] hover:shadow-lg border-none outline-none font-semibold">
                Send Message
              </Button>

              <p className="text-muted-foreground text-center text-sm">
                I'll respond to your message within 1-2 business days.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      
    </section>
    <Footer/>
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