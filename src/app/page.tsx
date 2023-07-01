"use client"

import React, { MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFrameLoad = () => {
    setIsLoading(!isLoading);
  };

  const handleClick = (event: MouseEvent<HTMLIFrameElement>) => {
    event.preventDefault();
    // Optionally, you can perform any other desired actions here
    // If you want to remain on the current site, you can do nothing or display a message to the user
  };

  useEffect(() => {
    handleFrameLoad();
  }, []);

  return (
    <>
      <main className="w-[80vw] mx-auto flex justify-between items-center flex-col-reverse sm:flex-row md:flex-row lg:flex-row h-[70vh] mb-[200px]">
        <div className="">
          <h1 className="text-blue-400 text-3xl font-semibold sm:text-5xl">Stay curious</h1>
          <h3 className="mb-9 mt-4">
            Discover stories, thinking, and expertise from writers on any topic.
          </h3>
          <Link
            href="/write"
            className="my-[10px] w-[60px] bg-slate-800 border-solid px-5 py-3 rounded-md border-[1px] border-slate-400 text-white hover:bg-slate-200 hover:text-slate-800 hover:border-slate-800 ease-in-out transition-all transition-2s"
          >
            Start writing
          </Link>
        </div>
        <div className="w-[300px] h-[400px] sm:w-[600px] sm:h-[400px] md:w-[800px] md:h-[500px]">
          {
            
          
            <iframe
              className="w-full h-full pointer-events-none"
              src="https://embed.lottiefiles.com/animation/32624"
              onClick={handleClick}
              onLoad={handleFrameLoad}
            ></iframe>
            ||
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          }
        </div>
      </main>
      <section className="w-[80vw] mx-auto flex justify-between items-center gap-4 flex-col sm:flex-row md:flex-row lg:flex-row h-[70vh]">
        <div className="w-[300px] h-[400px] sm:w-[600px] sm:h-[400px] md:w-[800px] md:h-[500px]">
          {
            
          
            <iframe
              className="w-full h-full pointer-events-none"
              src="https://embed.lottiefiles.com/animation/69297"
              onClick={handleClick}
              onLoad={handleFrameLoad}
            ></iframe>

            ||  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          }
        </div>
        <div>
          <blockquote className="text-xl font-thin text-black mb-4">
            “Never trust anyone who has not brought a book with them.”
          </blockquote>
          <p className="pb-8">
            <strong>― Lemony Snicket, Horseradish</strong>
          </p>
          <Link
            href="/blogs"
            className="my-[10px] w-[60px] bg-slate-800 border-solid px-5 py-3 rounded-md border-[1px] border-slate-400 text-white hover:bg-slate-200 hover:text-slate-800 hover:border-slate-800 ease-in-out transition-all transition-2s"
          >
            Start Reading
          </Link>
        </div>
      </section>
    </>
  );
}
