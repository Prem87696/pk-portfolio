import React from 'react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight mb-8">About Me</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
          Hello! I'm a passionate software engineer with a focus on building scalable and performant web applications. I enjoy tackling complex problems and turning them into simple, elegant solutions.
        </p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
          My journey in software development started years ago, and since then, I've had the privilege of working with various technologies and frameworks. I specialize in React, Node.js, and cloud infrastructure.
        </p>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vite'].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
