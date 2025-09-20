// src/app/newPassword/page.tsx
import VerifyOtp from "./VerifyOtp";

export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  return <VerifyOtp email={searchParams.email ?? ""} />;
}
