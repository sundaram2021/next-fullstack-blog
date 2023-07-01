"use client"

import React, { useState } from "react";
import Loader from "../components/Loader";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import Model from "../components/Model";

type BodyProps = {
    title: string,
    body: string
}

const Write = () => {
    const router = useRouter();
    const { data: session } = useSession()
    const email = session?.user?.email ;
    console.log(session);
    
    const [isLoading, setIsLoading] = useState(false)
    const [body, setBody] = useState<BodyProps>({
        title: "",
        body: ""
    })

    const inputHandler = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setBody({...body, [e.target.name]: e.target.value})
    }

    const submitBlog = async(e: React.FormEvent) => {
       e.preventDefault();

       try {
        setIsLoading(true)
        const res = await fetch("/api/blog",{
            method: "POST",
            body: JSON.stringify({...body, email}),
            headers: {"Content-Type": "application/json"}
        })

        console.log(res);
        if (typeof window !== "undefined" && window.Notification && Notification.permission === "granted") {
            new Notification("Blog is sucessfully submitted");
          }
        router.push("/")
        
       } catch (error) {
        console.log('errorr', error);
        
       }finally {
        setIsLoading(false)
       }
    }

    if (isLoading) {
        return <Loader />
    }

    return <div className=" max-w-[95vw] bg-slate-50 pd-10 flex justify-center items-center flex-col h-[80vh]">
        {
           !session?.user && 
           (
              <Model />
           )
        }
        <div className="w-[350px] sm:w-[75%] md:w-[65%]"> 
            <input type="text" name="title" className="w-full mb-5 p-4 border-grey-100 border-[0.8px] rounded-md text:lg" placeholder="title.." onChange={(e) => inputHandler(e)} />
            <textarea className="w-full mb-5 p-4 h-[40vh] border-grey-100 border-[0.8px] rounded-md text:md" name="body" onChange={(e) => inputHandler(e)}/>
            <input type="submit" disabled={isLoading} onClick={submitBlog} className="w-full mb-5 p-2 border-grey-100 border-[0.8px] rounded-md text:lg bg-slate-700 hover:bg-slate-500 cursor-pointer text-slate-100"/>
        </div>
    </div>
};

export default Write;