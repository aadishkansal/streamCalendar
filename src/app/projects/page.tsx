import { Suspense } from "react";
import Projects from "./Projects";

export default function ProjectsPage() {
  return (
    <div className="flex justify-center">
      <Suspense fallback={<div className="p-6 text-gray-600">Loading Projects...</div>}>
        <Projects />
      </Suspense>
    </div>
  );
}
