// src/app/newPassword/page.tsx
import VerifyOtp from "./VerifyOtp";

export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? "";
  return <VerifyOtp email={email} />;
}
