"use client"

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { RxAvatar } from 'react-icons/rx';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiFillCaretDown } from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
import { signOut, useSession } from "next-auth/react"; 
import { MdSettings } from 'react-icons/md' ;
import { RiLoginCircleFill } from 'react-icons/ri' ;
// import { Post } from "@prisma/client";
import { DateTime } from "luxon";
import { RiAdminFill } from 'react-icons/ri';

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


const Navbar = () => {
    const { data: session }  = useSession();
    const email = session?.user?.email ;
    const [ hamb, setHamb ]=  useState<Boolean>(false);
    const [show, setShow] = useState<Boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [blogs, setBlogs] = useState<Post[]>([]); // [{}
    // const [filteredData, setFilteredData] = useState<Post[]>([]);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const handleHamb = () => {
        setHamb(!hamb);
    }

    const handleClick = () => {
       setShow(!show);
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);   
        setSearchValue(e.target.value);
        
        if(searchValue.length > 0){ 
            setBlogs(blogs.filter((blog) => blog.title.toLowerCase().includes(searchValue.toLowerCase())));
        }  
    }

    const filterSearch = async() => {
        const res = await fetch("/api/blogs",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        const data:Post[] = await res.json();
        setBlogs(data);
    }
    // const filteredValues = useMemo(() => {
    //     if (searchValue.length > 0) {
    //       return blogs.filter((blog) =>
    //         blog.title.toLowerCase().includes(searchValue.toLowerCase())
    //       );
    //     } else {
    //       return blogs;
    //     }
    // }, [searchValue]);

    // const filter = useMemo(() => {
    //     return blogs.filter((blog) => blog.title.toLowerCase().includes(searchValue.toLowerCase()))
    // }, [searchValue]);
    

    // setBlogs(filter);

    useEffect(() => {
        filterSearch();        
    }, [])

    // console.log("filteredData : ",filteredData);
    

    return <div className="">
        <div className="w-[100vw] bg-slate-100">
            <nav className="flex justify-between items-center max-w-[90vw] mx-auto p-10 relative">
                <div className="mr-auto flex justify-around items-center">
                    <h1 className="text-2xl cursor-pointer"><Link href='/'>BlogPedia</Link></h1>
                    <div className="flex justify-between items-center relative w-[230px] sm:w-[420px] md:w-[500px] ml-4">
                        <AiOutlineSearch className="text-xl mr-[10px] cursor-pointer z-10" />
                        <input type="text" className="w-[85%] h-[30px] pl-6 rounded-md  bg-slate-200 text-gray-900 focus:outline-none focus:bg-gray-300 absolute left-0 " onChange={onChangeHandler} placeholder="Search" />
                    </div>
                </div>
                {session?.user && searchValue.length > 0 && (
                        <div className="w-[230px] sm:w-[420px] md:w-[500px] bg-slate-200 text-slate-600 absolute z-30 top-[74px] left-[167px] rounded-md">
                            {blogs.map((blog) => (
                                <div className="hover:bg-slate-300 cursor-pointer w-full py-3 px-2" key={blog.id}>
                                    <Link href={`/blogs/${blog.id}`}><p className="text-slate-600">{blog.title}</p></Link>
                                </div>
                            ))}
                        </div>
                )}
                <div className="relative w-[100%]">
                    <ul className={`w-[90.1vw] absolute top-[7.9vh] right-[-9.9vw] sm:pl-6 md:left-[-20.9vh] z-50 ml-0 mr-auto bg-slate-100 ${!hamb ? "mt-[-140vh]" : ""} transition-all ease-in-out duration-600 md:flex md:relative md:justify-end md:items-center md:w-min md:ml-auto md:mr-[-9rem] md:mt-0 md:top-0`}>
                        <li><Link href="/" className="h-[50px] block  hover:bg-slate-200 rounded-lg     text-lg pl-[6vh] py-4 bottom-[2rem] w-[100%] md:pl-0 md:bottom-0 md:w-[120px]  md:text-center  hover:ease-in-out ">Home</Link></li>
                        <li><Link href="/blogs" className="h-[50px] text-lg pl-[6vh] rounded-lg block hover:bg-slate-200 py-4 bottom-[2rem] w-[100%] md:pl-0 md:bottom-0 md:w-[120px]  md:text-center ">Blogs</Link></li>
                        <li><Link href="/write" className="h-[50px] text-lg pl-[6vh] py-4 bottom-[2rem] rounded-lg w-[100%] md:pl-0 md:bottom-0 md:w-[120px]  md:text-center block hover:bg-slate-200">Write</Link></li>
                        {(!session?.user)  && (<li><Link href="/login" className="h-[50px] rounded-lg text-lg pl-[6vh] py-4 bottom-[2rem] w-[100%] md:pl-0 md:bottom-0 md:w-[120px]  md:text-center block hover:bg-slate-200">Login</Link></li>)}
                    </ul>
                </div>
                <div className="flex justify-around items-center ">
                    <GiHamburgerMenu className="text-xl mr-[10px] cursor-pointer md:hidden" onClick={handleHamb}/>
                    <RxAvatar className="text-4xl cursor-pointer" onClick={handleClick} />
                    <AiFillCaretDown className="cursor-pointer text-[13px]" onClick={handleClick} />
                </div>
                { show &&
                    (
                    <section className="absolute flex flex-col right-10 top-[12vh] px-1 w-[230px] py-5 z-40 rounded-md shadow-2xl bg-slate-800 text-white border-[.5px]">
                        <Link href="/user" className="mb-2 flex justify-center items-center gap-1 py-2 hover:rounded-md hover:bg-slate-700 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" w-8 h-6 border-l-0 border-gray-400 border-solid border-t-0 border-r border-b-0 flex-grow-1">
                                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                            </svg>
                            <p className="mx-auto flex-grow-3">
                                Profile
                            </p>
                        </Link>
                        
                        <Link href="/register" className="mb-2 flex justify-center items-center gap-1 py-2 hover:rounded-md hover:bg-slate-700 cursor-pointer">
                            <RiLoginCircleFill className="w-8 h-6 border-l-0 border-gray-400 border-solid border-t-0 border-r border-b-0 flex-grow-1" />
                            <p className="mx-auto flex-grow-3">
                                Register
                            </p>
                        </Link>
                        
                        <Link href="/settings" className="mb-2 flex justify-center items-center gap-1 py-2 hover:rounded-md hover:bg-slate-700 cursor-pointer">
                            <MdSettings className="w-8 h-6 border-l-0 border-gray-400 border-solid border-t-0 border-r border-b-0 flex-grow-1" />
                            <p className="mx-auto flex-grow-3">
                                Settings
                            </p>
                        </Link>
                        { email === adminEmail &&
                            <Link href="/admin" className="mb-2 flex justify-center items-center gap-1 py-2 hover:rounded-md hover:bg-slate-700 cursor-pointer">
                            <RiAdminFill className="w-8 h-6 border-l-0 border-gray-400 border-solid border-t-0 border-r border-b-0 flex-grow-1" />
                            <p className="mx-auto flex-grow-3">
                                Admin
                            </p>
                        </Link>}
                        <button className="bg-white text-slate-900 rounded-sm mt-1 mb-none hover:bg-slate-800 hover:border hover:border-solid hover:border-slate-100 hover:text-white hover:rounded-lg h-8" onClick={() => signOut()}>Sign Out</button>
                    </section>
                    )
                }
            </nav>
        </div>
    </div>
};

export default Navbar;

