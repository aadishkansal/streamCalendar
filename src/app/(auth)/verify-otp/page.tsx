"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/app/components/ui/Button";
import Navbar from "@/app/components/Navbar";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setIsOtpExpired(true);
    }
  }, [isOtpSent, timer]);

  // Send OTP API Call
  const handleSendOtp = async () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }
    try {
      const response = await axios.post("/api/send-otp", { email });
      if (response.data.success) {
        setIsOtpSent(true);
        setTimer(120);
        alert(response.data.message); // “OTP successfully sent…”
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          alert("Email not found. Please sign up first.");
        } else if (status === 400 && data.message === "OTP already sent") {
          alert("OTP already sent. Please wait before requesting again.");
        } else {
          alert("Error sending OTP. Please try again.");
        }
      } else {
        alert("Network error. Check your connection.");
      }
    }
  };

  // Verify OTP API Call
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await axios.post("/api/verify-otp", { email, otp });
      if (response.data.success) {
        router.push(`/newPassword?email=${encodeURIComponent(email)}`);
      } else {
        // expired or wrong
        if (response.data.message === "OTP has expired") {
          alert("OTP expired. Please resend.");
          setIsOtpExpired(true);
        } else {
          alert("Incorrect OTP. Please try again.");
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error verifying OTP. Please try again.");
      }
      setIsOtpExpired(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post("/api/send-otp", { email });
      if (response.data.success) {
        setTimer(120);
        setIsOtpExpired(false);
        setIsOtpSent(true);
        alert("OTP resent successfully. Check your inbox.");
      }
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response.data.message === "OTP already sent"
      ) {
        alert("OTP already sent. Please wait before requesting again.");
      } else {
        alert("Error resending OTP. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="flex justify-between ">
        <div className=" hidden lg:flex bg-gradient-to-tr from-[#5d57ee]/90 to-purple-400 h-screen w-[500px]"></div>

        <div className="flex flex-col justify-center items-center w-full gap-6 h-screen">
          <h1 className="font-['inter'] text-[24px] font-bold max-md:text-[20px]">
            Forgot <span className="text-[#5D57EE]">Password?</span>
          </h1>

          {/* Email Input */}
          <div className="w-[540px] max-md:w-[360px]">
            <h6 className="font-['inter'] text-[16px] font-semibold">Email</h6>
            <input
              className="border border-[#5D57EE80] rounded-xl w-full h-12 p-4"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* OTP Input & Timer */}
          {isOtpSent && (
            <div className="w-[540px] max-md:w-[360px]">
              <div className="flex justify-between items-center">
                <h6 className="font-['inter'] text-[16px] font-semibold">
                  Enter OTP
                </h6>
                <p className="text-[#5D57EE] text-sm font-medium">
                  {isOtpExpired ? (
                    <span className="text-red-500">OTP Expired</span>
                  ) : (
                    `Time left: ${Math.floor(timer / 60)}:${timer % 60}`
                  )}
                </p>
              </div>
              <input
                className={`border border-[#5D57EE80] rounded-xl w-full h-12 p-4 ${isOtpExpired ? "border-red-500" : ""}`}
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                disabled={isOtpExpired}
              />
            </div>
          )}

          {/* Buttons */}
          {!isOtpSent ? (
            <Button
              title="Send OTP"
              type="button"
              variant="btn_big1"
              onClick={handleSendOtp}
              disabled={!email.trim()}
            />
          ) : isOtpExpired ? (
            <Button
              title="Resend OTP"
              type="button"
              variant="btn_big1"
              onClick={handleResendOtp}
            />
          ) : (
            <Button
              title={isVerifying ? "Verifying..." : "Verify & Reset Password"}
              type="button"
              variant="btn_big2"
              onClick={handleVerifyOtp}
              disabled={!email.trim()}
            />
          )}

          {/* Back to Sign In */}
          <h6 className="text-sm">
            Remember your password?{" "}
            <a href="/sign-in" className="text-[#5D57EE] hover:underline">
              Sign In
            </a>
          </h6>
        </div>
      </section>
    </>
  );
}
