'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='shadow-xl bg-slate-400 h-20 rounded-md'>
        <h2 className='font-medium'>Something went wrong in Uploading Blog</h2>
        <button
            className='bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mx-auto'
            onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
            }
        >
            Try again
        </button>
      </div>
    </div>
  )
}