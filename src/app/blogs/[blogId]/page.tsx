"use client"

import React, { FC, useState , useEffect} from "react";
import { RxAvatar } from "react-icons/rx";

import { useParams } from 'next/navigation';
import { DateTime } from "luxon";

interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    posts: Post[];
    comments: Comment[];
  }
  
  interface Post {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    title: string;
    body: string;
    author: User;
    authorId: string;
    comments: Comment[];
    liked: boolean;
    saved: boolean;
  }

const Blog = () => {
    const { id } = useParams();
    const [data, setData] = useState<Post>()

    const getBlogs = async(id: string) => {
        const data = await fetch(`api/blog/${id}`)
        const json = await data.json();
        setData(json)
    }

    useEffect(() => {
        getBlogs(id)
    })

    return (
        <div className="lg:p-10 md:max-w-[80vw] max-w-[100vw] mx-auto flex flex-col items-center justify-normal">
            <main className="w-full md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem] ${index === 0 || index ===1 || index === 2 ? '' : 'cursor-pointer '}">
                <div className="flex justify-between flex-col-reverse">
                    <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">{data?.title}</p>
                    <div className="flex justify-between items-center ml-0 mr-auto">
                        <div>
                            <RxAvatar className="text-4xl mr-[1.5rem] "/>
                        </div>
                    </div>
                </div>
                <section className="tracking-wide text-justify ${index === 0 || index ===1 || index === 2 ? '' : 'line-clamp-3'}">{data?.body}
                </section>
                <section className="flex justify-start items-start mt-[2rem] ${index === 0 || index ===1 || index === 2 ? '' : 'hidden '}">
                    <div className="mr-[4px]">
                        <RxAvatar className="text-[26px] mt-[4px]"/>
                    </div>
                    {/* <div>
                        <p className="text-[8px] font-bold text-black">{data?.author}</p>
                        <p className="text-[13px]">{}</p>
                    </div> */}
                </section>
            </main>
        </div>
    )
};

export default Blog;