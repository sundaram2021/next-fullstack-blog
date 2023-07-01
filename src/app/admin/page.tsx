"use client"
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useSession } from "next-auth/react";
// import { useClient } from "@prisma/client"; // Import useClient from "@prisma/client"
import { MdDelete } from 'react-icons/md';
import Loading from './loading'
import { DateTime } from "luxon";
import prisma from "../../../lib/prisma";

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

interface Comment {
    id: string;
    comment: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    post: Post;
    postId: string;
    author?: User;
    authorId?: string;
}  

  

export default function Admin() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [state, setState] = useState('blogs');
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

//   const client = useClient(); // Initialize the Prisma client

async function getBlogs() {
    const blogData = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
              },
            },
          },
        },
      },
    });
  
    const blogs:any = blogData.map((blog) => ({
      ...blog,
      createdAt: DateTime.fromJSDate(blog.createdAt),
      updatedAt: DateTime.fromJSDate(blog.updatedAt),
      author: {
        ...blog.author,
        posts: [],
        comments: [],
      },
      comments: blog.comments.map((comment) => ({
        ...comment,
        post: blog, // Set the 'post' property to the current blog
        author: {
          ...comment.author,
          posts: [],
          comments: [],
        },
      })),
    }));
  
    setBlogs(blogs);
  }
  
  
  async function getUsers() {
    const userData = await prisma.user.findMany();
    const users = userData.map((user) => ({
      ...user,
      posts: [],
      comments: [],
    }));
    setUsers(users);
  }

  useEffect(() => {
    getBlogs();
    getUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await prisma.post.delete({ where: { id } }); // Use the Prisma client to delete the blog
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
    alert("Blog Deleted Successfully");
  }

  const handleDeleteUser = async (id: string) => {
    await prisma.user.delete({ where: { id } }); // Use the Prisma client to delete the user
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    alert("User Deleted Successfully");
  }

  return (
    (email === "" || email === undefined || email === null) ?
      (<Loading />) :
      (blogs === null || blogs === undefined || blogs.length === 0 || email !== adminEmail) ?
        (<div className="flex justify-center items-center h-[40vh] w-[100vw] text-xl flex-col">
          <p>You are Not Admin</p>
          <Link href="/" className="w-[240px] text-center align-bottom py-auto  h-[40px] rounded-md text-slate-50 bg-slate-900 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-solid hover:border-slate-900">Go To HomePage</Link>
        </div>) :
        (<div className="p-10 max-w-[80vw] mx-auto flex flex-col items-center justify-normal">
          <p className="mb-[1rem] text-2xl " title={email as string}>
            Welcome Admin
          </p>
          <div className="flex  justify-center gap-2 items-center mb-4">
            <button className="w-[150px] text-center align-bottom py-auto  h-[30px] rounded-md text-slate-50 bg-slate-900 hover:text-slate-900 hover:bg-slate-50 hover:border hover:border-solid hover:border-slate-900" onClick={() => setState('blogs')}>Blogs</button>
            <button className="w-[150px] text-center align-bottom py-auto  h-[30px] rounded-md text-slate-900 bg-slate-100 border border-solid border-slate-800 hover:text-slate-100 hover:bg-slate-900 hover:border hover:border-solid hover:border-slate-900" onClick={() => setState('users')}>Users</button>
          </div>
          {state === 'blogs' ? (
            blogs.map((blog) => (
              <main className="w-[95%] sm:w-[75%] md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem]" key={blog.id}>
                <div className="flex justify-between items-center">
                  <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">{blog.title}</p>
                  <div className="flex items-center gap-5">
                    <MdDelete className="text-xl hover:text-2xl text-red-500 inline-block cursor-pointer" onClick={() => handleDelete(blog.id)} />
                  </div>
                </div>
                <section className="tracking-wide text-justify">
                  {blog.body}
                </section>
              </main>
            ))
          ) : (
            users.map((user) => (
              <main className="w-[95%] sm:w-[75%] md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem]" key={user.id}>
                <div className="flex justify-between items-center">
                  <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">{user.name}</p>
                  <div className="flex items-center gap-5">
                    <MdDelete className="text-xl hover:text-2xl text-red-500 inline-block cursor-pointer" onClick={() => handleDeleteUser(user.id)} />
                  </div>
                </div>
              </main>
            ))
          )}
        </div>)
      )
  
};
