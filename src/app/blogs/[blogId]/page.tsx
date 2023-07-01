import React, { FC } from "react";
import { RxAvatar } from "react-icons/rx";

interface IProps {};

const Blog:FC<IProps> = (props) => {
    return (
        <div className="p-10 max-w-[80vw] mx-auto flex flex-col items-center justify-normal">
            <main className="w-[95%] sm:w-[75%] md:w-[65%] bg-slate-100 p-3 rounded-sm mx-auto mb-[1rem] ${index === 0 || index ===1 || index === 2 ? '' : 'cursor-pointer '}">
                <div className="flex justify-between flex-col-reverse">
                    <p className="py-3 text-2xl font-bold max-w-[300px] sm:w-[100%] whitespace-normal text-justify">Title lknol ldjaljlkl nkjn djkan iodho nal jns njkba</p>
                    <div className="flex justify-between items-center ml-0 mr-auto">
                        <div>
                            <RxAvatar className="text-4xl mr-[1.5rem] "/>
                        </div>
                    </div>
                </div>
                <section className="tracking-wide text-justify ${index === 0 || index ===1 || index === 2 ? '' : 'line-clamp-3'}">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Fuga fugiat, dolorem molestiae ex nisi suscipit blanditiis? 
                    Unde accusamus facilis iure officia qui dolorum, reprehenderit, 
                    alias, adipisci earum iusto reiciendis autem magni.
                    Adipisci in hic repudiandae deserunt nulla, aut error laboriosam.
                </section>
                <section className="flex justify-start items-start mt-[2rem] ${index === 0 || index ===1 || index === 2 ? '' : 'hidden '}">
                    <div className="mr-[4px]">
                        <RxAvatar className="text-[26px] mt-[4px]"/>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-black">12/34/56</p>
                        <p className="text-[13px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, non!</p>
                    </div>
                </section>
            </main>
        </div>
    )
};

export default Blog;