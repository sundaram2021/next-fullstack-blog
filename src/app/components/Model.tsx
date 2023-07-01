import Link from 'next/link'
import React from 'react'

function Model() {
  return (
    <dialog className="w-full h-[70vh] mt-20 flex justify-center flex-col items-center">
        <div className="w-[300px] bg-white shadow-lg h-[300px] flex flex-col border border-solid border-slate-500 justify-center items-center gap-5 rounded-md">
            <p className="text-slate-800 text-xl">Looks like you are not logged in</p>
            <Link href="/login" className="w-[90%] h-[30px] bg-black text-center text-white hover:bg-slate-100 hover:text-black hover:border-slate-700 rounded-r-lg">Login</Link>
        </div>
    </dialog>
  )
}

export default Model