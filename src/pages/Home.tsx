import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-3xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Building digital <br className="hidden md:block" />
        <span className="text-zinc-500 dark:text-zinc-400">experiences.</span>
      </h1>
      <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl">
        I'm a senior full-stack engineer specializing in building exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/projects"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          View Projects
          <ArrowRight size={18} />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white px-6 py-3 rounded-md font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
}
