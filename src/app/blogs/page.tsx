"use client"

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import { BsBookmarkDash, BsFillBookmarkCheckFill } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx"; 
// import { Post, User, Comment, Like, Save } from "@prisma/client"; // Assuming User is the interface 
import Loading from "./loading";
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

interface Blog extends Post {
  comments: Comment[];
}



const Blogs = () => {
  const blogAuthorRef = useRef(null);
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comment, setComment] = useState("");

  const email = session?.user?.email;

  async function getBlogs() {
    const res = await fetch("/api/blogs", {
      method: "GET",
    });

    const allBlogs = await res.json();
    setBlogs(allBlogs);
  }

  async function getUsers() {
    const res = await fetch("/api/users", {
      method: "GET",
    });

    const allUsers = await res.json();
    setUsers(allUsers);
  }


  const handleLike = async (blogId: string) => {
    setBlogs(blogs.map((blog) => (blog.id === blogId ? { ...blog, liked: !blog.liked  } : blog)))
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        body: JSON.stringify({ likedPostId: blogId, likedUserEmail: email }),
        headers: { "Content-Type": "application/json" },
      });

      const updatedBlogsData = await res.json();
      // setLikes(data);

      setBlogs(updatedBlogsData)
    } catch (error) {
      console.error("Error occurred while liking the post:", error);
    }
  };

  const handleSave = async (blogId: string) => {
    setBlogs(blogs.map((blog) => (blog.id === blogId ? { ...blog, saved: !blog.saved  } : blog)))
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ savedPostId: blogId, savedUserEmail: email }),
      });

      const data = await res.json();

      setBlogs(data);
    } catch (error) {
      console.error("Error occurred while saving the post:", error);
    }
  };

  useEffect(() => {
    getBlogs();
    getUsers();
  }, []);

  function CopyUrlButton(id:string, e : any) {
    e.preventDefault();
    const localUrl = process.env.NEXTAUTH_URL as string || "http://localhost:3000";
    console.log('url => ', localUrl);
    
    const url = `${localUrl}/${id}`
    navigator.clipboard.writeText(url);
    if (typeof window !== "undefined" && window.Notification && Notification.permission === "granted") {
      new Notification("Url is copied to clipboard");
    }
  };

  //write a function to submit comment to the api api/comments
  const submitComment = async (blogId: string) => {
    console.log("blogId", blogId);
    console.log("comment", comment);
    console.log("email", email);
    
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ blogId, comment, email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("data", data);
      await getBlogs();
    }
    catch (error) { 
      console.error("Error occurred while posting the comment:", error);
      if(typeof window !== "undefined" && window.Notification && Notification.permission === "granted"){
        new Notification("Error occurred while posting the comment");
      }
    }
  };

  console.log("blogs", blogs);

  // console.log("comments : ", blogs.comments.map((comment) => comment.comment));
  
  

  return (
    <>
      {blogs === undefined || blogs === null || blogs.length === 0 ? (
        // Placeholder loading UI
        <Loading />
      ) : (
        <div className="p-10 max-w-[80vw] mx-auto flex flex-col items-center justify-normal mt-8">
          {blogs.map((blog) => {
            const author = users.find((user) => user.id === blog.authorId);
            const authorName = author ? author.name : "";

            return (
              <main
                key={blog.id}
                className="w-[95%] sm:w-[90%] md:w-[75%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem]"
              >
                <div className="flex justify-between flex-col-reverse mb-4 relative">
                  
                  <div className="flex justify-between items-center ml-0 mr-auto mb-8">
                    <div className="flex justify-start items-center">
                      <div ref={blogAuthorRef} title={authorName}>
                        <RxAvatar className="text-4xl mr-[1.5rem]"  />
                      </div>
                      <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">
                        {blog.title}
                      </p>
                    </div>
                  </div>
                </div>
                
                <section className="tracking-wide text-justify mb-8">
                  {blog.body}
                </section>
                <section className="my-[1rem]">
                  <div className="flex justify-between items-center ml-auto mr-0">
                    {blog.liked ? (
                      <AiFillLike
                        className="text-2xl mr-[1.5rem] cursor-pointer hover:bg-slate-300 hover:rounded-md w-8 h-5"
                        onClick={() => handleLike(blog.id)}
                      />
                    ) : (
                      <AiOutlineLike
                        className="tex hover:bg-slate-300 hover:rounded-md w-8 h-5 cursor-pointer"
                        onClick={() => handleLike(blog.id)}
                      />
                    )}
                    <FaShareAlt
                      className="text-xl mr-[1.5rem] cursor-pointer text-center  hover:bg-slate-300 hover:rounded-md w-8 h-5"
                      onClick={(e) => CopyUrlButton(blog.id, e)}
                    />
                    {blog.saved ? (
                      <BsFillBookmarkCheckFill
                        className="text-xl mr-[1.5rem] cursor-pointer hover:bg-slate-300 hover:rounded-md w-8 h-5"
                        onClick={() => handleSave(blog.id)}
                      />
                    ) : (
                      <BsBookmarkDash
                        className="text-xl mr-[1.5rem] cursor-pointer hover:bg-slate-300 hover:rounded-md w-8 h-5"
                        onClick={() => handleSave(blog.id)}
                      />
                    )}
                  </div>
                </section>
                <section className="mt-[2rem]">
                  <input placeholder="comment..." type="text" className="bg-slate-100 border-b border-slate-400 mb-[10px] outline-none" onChange={(e) => setComment(e.target.value)} />
                  <input
                    type="submit"
                    value="Submit"
                    className="bg-slate-300 border-[1.2px] border-solid border-slate-400 px-2 py-[1px] ml-[3px] rounded-md cursor-pointer"
                    onClick={() => submitComment(blog.id)}
                  />
                </section>
                {(blog.comments && blog.comments.length > 0) && <p className=" mt-[2rem] mb-4">Comments....</p>}
                {blog.comments && blog.comments.length > 0 && (
                  blog.comments.map((comment) => {
                    const author:User = users.find((user) => user.id === comment.authorId) as User;
                    return (
                      <section className="flex justify-start items-start" key={comment.id}>
                        <div className="mr-[4px]" title={author.name}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[26px] mt-[4px]">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                          </svg> 
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-black">{comment.createdAt as unknown as string}</p>
                          <p className="text-[13px]">{comment.comment}</p>
                        </div>
                      </section>
                    );
                  })
                )}
              </main>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Blogs;
