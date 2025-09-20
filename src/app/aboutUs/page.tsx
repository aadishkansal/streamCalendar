import React from "react";
import PlansPageWrapper from "../components/PageWrapper";

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Frontend Developer",
    img: "https://via.placeholder.com/150",
    bio: "Passionate about crafting engaging and responsive UIs. Loves React, Next.js, and Tailwind.",
  },
  {
    name: "Brian Smith",
    role: "Backend Developer",
    img: "https://via.placeholder.com/150",
    bio: "Specializes in building scalable backend systems with Node.js, Express, and MongoDB.",
  },
  {
    name: "Charlie Lee",
    role: "Data Engineer",
    img: "https://via.placeholder.com/150",
    bio: "Focused on data pipelines, cloud services (AWS/Azure), and making data accessible to apps.",
  },
];

const AboutUs = () => {
  return (
    <section className="bg-gray-50 mt-12 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-lg text-gray-600 mb-12">
          We are a team of three passionate developers building modern, 
          scalable, and user-friendly software solutions. 
        </p>

        {/* Team Members */}
        <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full mx-auto border-4 border-indigo-500 shadow-md"
              />
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
              <p className="mt-4 text-gray-500 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function About() {
  return (
    <PlansPageWrapper>
      <AboutUs/>
    </PlansPageWrapper>
  );
}
