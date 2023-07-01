"use client"
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  password: string;
};

const Settings = () => {
  const { data:session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("");
    }, 7000);

    return () => clearTimeout(timer);
  }, [status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    validateForm();
  }

  function validateForm() {
    if (formRef.current) {
      setIsFormValid(formRef.current.checkValidity());
    }
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch("/api/register", {
        method: "PUT",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json", "Authorization": `${session?.user?.email}` },
      });

      
      
      

      if(res.ok) {
        setStatus("User Updated successfully!");
        signOut();
        router.push("/login");
      } 

      if (typeof window !== "undefined" && window.Notification && Notification.permission === "granted") {
        new Notification("User Updated successfully!");
      }
    } catch (error) {
      console.log("Error : ", error);
      new Notification(" Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };


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

  function handleEdit() {
    setIsEdit(true);  
  }
  

  return (
    isLoading ? <Loader /> : 
    <div className="flex justify-center items-center h-[70vh] w-full flex-col">
      <h1 className="flex mb-8 text-3xl items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" w-28 h-14 text-3xl">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
      </svg>
      </h1>
      {!isEdit && <div className="w-96 bg-slate-100 border-2 border-solid border-slate-200 rounded p-5 box-border">
          <p className="py-2 px-3">Name: { session?.user?.name as string} </p>
          <p className="py-2 px-3">Email: {session?.user?.email as string}</p>
          <button className="w-[80%] bg-slate-800 py-2 px-3 rounded-md text-cyan-400 hover:border hover:border-solid hover:border-cyan-400 hover:text-white" onClick={handleEdit}>Edit</button>
      </div>}
      {isEdit &&  <form
        className="w-96 bg-slate-100 border-2 border-solid border-slate-200 rounded p-5 box-border"
        onSubmit={(e) => submitHandler(e)}
        ref={formRef}
      >
        <input
          placeholder="enter your name..."
          value={user.name}
          name="name"
          type="name"
          onChange={handleChange}
          className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"
          required
        />
        <input
          placeholder="enter your email..."
          value={user.email}
          name="email"
          type="email"
          onChange={handleChange}
          className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"
          required
        />
        <input
          placeholder="make a strong password"
          value={user.password}
          name="password"
          type="password"
          onChange={handleChange}
          className="w-[90%] mx-auto ml-4 text-slate-600 p-1 text-lg rounded-md mb-3"
          required
        />
        <input
          type="submit"
          value="Submit"
          disabled={isLoading || !isFormValid}
          className="w-[90%] mx-auto ml-4 text-slate-300 p-1 text-lg rounded-md bg-slate-700 hover:text-black hover:border-slate-800 hover:border-1 hover:bg-slate-200 hover:border-solid cursor-pointer box-border"
        />
      </form>}
      <div>
        {status === "error" && (
          <p className="bg-red-500 text-black mt-[1rem] p-3 rounded-sm">
            There was an error in editing. Please try again.
          </p>
        )}
        
      </div>
    </div>
  );
};

export default Settings;
