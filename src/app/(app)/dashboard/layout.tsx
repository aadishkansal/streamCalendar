// app/(dashboard)/layout.tsx

import Footer from "@/app/components/Footer"
import MainNavbar from "@/app/components/MainNavBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar/>
      <main className="flex-1">
        {children}
      </main>
      <Footer/>
    </div>
  )
}