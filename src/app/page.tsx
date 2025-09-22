import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// Import the actual homepage content
import CalendarApp from './components/CalendarApp';
import Navbar from './components/Navbar';
import Hero, { BackgroundBeamsWithCollisionDemo } from './components/Hero';
import PricingSectionCards from './plans/page';
import Footer from './components/Footer';
//import { FeaturesSectionDemo } from './components/Features';

export default async function RootPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/dashboard');
  }
  
  // Return the actual homepage content instead of dynamic import
  return (
    <>
      <Navbar />
      <BackgroundBeamsWithCollisionDemo />
      {/* <FeaturesSectionDemo /> */}
      <PricingSectionCards />
      <Footer />
    </>
  );
}
