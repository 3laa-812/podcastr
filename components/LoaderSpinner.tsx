import { Loader } from 'lucide-react'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
        <Loader className='animate-spin text-[#F97535]' size={40}/>
    </div>
  )
}

export default LoaderSpinner