"use client"

import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import Link  from 'next/link';

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


const Liked = () => {

    const { data: session } = useSession();
    const email= session?.user?.email;
    const [blogs, setBlogs] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);


    async function getBlogs() {
        const res = await fetch("/api/blogs", {
            method: "GET",
        });
        const data = await res.json();
        setBlogs(data);
    }

    async function getUsers() {
        const res = await fetch("/api/users", {
            method: "GET",
        });
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        getBlogs();
        getUsers();
    }, [])


    // const id = users.find((user) => user.email === email)[0].id;
    const id = users.find((user) => user.email === email)?.id;
    const likedBlogs = blogs.filter((blog) => blog.authorId === id && blog.liked === true);

    console.log("likedBlogs", likedBlogs);
    

    

    return (
        (likedBlogs === null || likedBlogs === undefined || likedBlogs.length <= 0) ? 
        (<div className="flex justify-center items-center h-[70vh] w-[100vw] text-xl flex-col">
            <p>You Have Not Liked Any Blogs</p> 
            <Link href="/blogs" className="w-[200px] text-center align-bottom py-auto  h-[40px] rounded-md text-slate-50 bg-slate-900 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-solid hover:border-slate-900">Checkout Our Blogs</Link>
        </div> )
        :
        likedBlogs.map((blog) => {
            return (
            <div className="p-10 max-w-[80vw] mx-auto flex flex-col items-center justify-normal" key={blog.id}>
                <main className="w-[95%] sm:w-[75%] md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem] ${index === 0 || index ===1 || index === 2 ? '' : 'cursor-pointer '}">
                    <div className="flex justify-between flex-col-reverse">
                        <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">{blog.title}</p>
                        <div className="flex justify-between items-center ml-0 mr-auto">
                            <div>
                                <RxAvatar className="text-4xl mr-[1.5rem] "/>
                            </div>
                        </div>
                    </div>
                    <section className="tracking-wide text-justify ${index === 0 || index ===1 || index === 2 ? '' : 'line-clamp-3'}">
                        {blog.body}
                    </section>
                </main>
            </div>

            )
        })
        
    )
};

export default Liked;