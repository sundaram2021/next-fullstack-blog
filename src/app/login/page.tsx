"use client"
import React, {  useState, useEffect } from "react"
import Loader from "../components/Loader";
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

type User = {
    name: string,
    email: string,
    password: string,
}

const Login = () => {
    const router = useRouter()
    const [user, setUser] =  useState<User>({
        name: "",
        email: "",
        password: "",
    })
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('');
        }, 7000);

        return () => clearTimeout(timer);
    }, [status]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        const value = e.target.value;

        setUser((prevUser) => ({...prevUser, [name] : value}));
    }

    const submitHandler = async(e:React.FormEvent) => {
        // "use server"
        e.preventDefault();
        try {
            setIsLoading(true); // Set loading state to true
            const response = await signIn("credentials", {
                name: user.name,
                email: user.email,
                password: user.password,
                redirect: true,
                callbackUrl: "/"
            });
            
            if (response?.status === 200) {
                setUser({
                    name: "",
                    email: "",
                    password: ""
                })
                setStatus('success');
                new Notification("You are Logged in  Sucessfully !");
                router.push("/");
            }

        }catch (e) {
            console.log(e)
            setStatus('error');
            new Notification("There was an error in Logging. Please try again.");
        }finally {
            setIsLoading(false); // Set loading state to false
        }

    }

    const askNotificationPermission = () => {
      if (typeof window !== "undefined" && window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Notification permission granted!");
          }
        });
      }
    };

    if(typeof window !== "undefined" && window.Notification && Notification.permission !== "granted") {
        askNotificationPermission();
    }

    return (
    isLoading ? <Loader /> :
    <div className="flex justify-center items-center h-[70vh] w-full flex-col">
        <h1 className="flex mb-8 text-3xl items-center justify-center">Login 
            <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </h1>
        <form className="w-96 bg-slate-100 border-2 border-solid border-slate-200 rounded p-5 box-border" onSubmit={(e) => submitHandler(e)}>
           <input placeholder="enter name..." value={user.name} name="name" type="name" onChange={handleChange}  className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"/>
           <input placeholder="enter email..." value={user.email} name="email" type="email" onChange={handleChange}  className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"/>
           <input placeholder="enter password..." value={user.password} name="password" type="password" onChange={handleChange}  className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"/>
           <input type="submit" value="Login" disabled={isLoading} className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md bg-slate-400 hover:text-black hover:border-slate-800 hover:border-1 hover:bg-slate-200 hover:border-solid cursor-pointer box-border"/>
        </form>
        <div>
            {status === 'error' && <p className="bg-red-500 text-black mt-[1rem] p-3 rounded-sm">There was an error in Logging. Please try again.</p>}
            {status === 'success' && <p className="bg-green-600 text-white mt-[1rem] p-3 rounded-sm">You are Logged Successfully !</p>}
        </div>
        
    </div>)
};

export default Login;