"use client"

import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { MdDelete } from 'react-icons/md';
import Loading from './loading'
import { DateTime } from "luxon";
import { redirect } from "next/navigation";

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

export default function User(){

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login");
        }
    });
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
    }, []);

    const id = users.find((user) => user.email === email)?.id;
    const userArticles = blogs.filter((blog) => blog.authorId === id);
    const likes = blogs.filter((blog) => blog.liked === true);
    const saved = blogs.filter((blog) => blog.saved === true);
    const totalLikes = likes.length;
    const totalSaved = saved.length;


    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/blogs/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        const data = await res.json();
        setBlogs(data)
        alert("Blog Deleted Successfully")
    }    

    return (
        (email === "" || email === undefined || email === null) ? 
        (<Loading />) 
        :
        (<div className="p-10 max-w-[80vw] mx-auto flex flex-col items-center justify-normal">
            <p className="mb-[1rem] text-2xl ">
                Welcome {email}
            </p>
            <section className="w-[75%] mb-[1rem] bg-slate-800 text-white p-5">
                Stats of your Blogs
                <li>Number of Likes :  {totalLikes}</li>
                <li>Number of Saved :  {totalSaved}</li>
            </section>
            <div className="flex  justify-center gap-2 items-center">
                <Link href="/user/likedblogs" className="w-[150px] text-center align-bottom py-auto  h-[30px] rounded-md text-slate-50 bg-slate-900 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-solid hover:border-slate-900">Your Liked Blogs</Link>
                <Link href="/user/savedblogs" className="w-[150px] text-center align-bottom py-auto  h-[30px] rounded-md text-slate-900 bg-slate-100 border border-solid border-slate-800 hover:text-slate-100 hover:bg-slate-900 hover:border hover:border-solid hover:border-slate-900">Your Saved Blogs</Link>
            </div>
            <h1>Your Articles</h1>
            {
                (userArticles === null || userArticles === undefined || userArticles.length === 0) ?
                (<div className="flex justify-center items-center h-[40vh] w-[100vw] text-xl flex-col">
                    <p>You Have Not Written Any Blogs</p> 
                    <Link href="/write" className="w-[240px] text-center align-bottom py-auto  h-[40px] rounded-md text-slate-50 bg-slate-900 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-solid hover:border-slate-900">Publish you First Blog</Link>
                </div> )
                :
                (userArticles.map((blog) => {
                    return(
                        <main className="w-[95%] sm:w-[75%] md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem] ${index === 0 || index ===1 || index === 2 ? '' : 'cursor-pointer '}" key={blog.id} >
                            <div className="flex justify-between items-center">
                                <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify" >{blog.title}</p>
                                <div className="flex items-center gap-5">
                                    <MdDelete className="text-xl hover:text-2xl text-red-500 inline-block cursor-pointer" onClick={() => handleDelete(blog.id)} />
                                </div>
                            </div>
                            <section className="tracking-wide text-justify ${index === 0 || index ===1 || index === 2 ? '' : 'line-clamp-3'}">
                                {blog.body}
                            </section>
                        </main>
                    )
                }))   
            }
        </div>)
    )
};
