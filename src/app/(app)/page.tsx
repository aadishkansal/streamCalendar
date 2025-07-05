import Hero from "../components/Hero";
import Image from "next/image";
import Streaks from "../components/Streaks";
import Sidebbar from "../components/Sidebbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Render from "../components/Render";




export default function Home() {
  return (
  <div className="flex flex-col">
<Navbar/>
<Hero/>
<Footer/>
  </div> 
);
}
