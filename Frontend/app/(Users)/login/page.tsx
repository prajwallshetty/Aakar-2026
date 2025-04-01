import React from 'react'

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-8" >
       <div className="flex flex-col   bg-white w-100 p-6 rounded shadow-md">
      <h2 className="text-black text-lg font-semibold mb-4">Login</h2>
      <form className="flex flex-col gap-4">
        <div className='flex flex-col gap-2'>
        <label htmlFor="email" className="text-gray-700">
          Email 
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="border border-gray-100 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        </div>
        <div className='flex flex-col gap-2'>
        <label htmlFor="password" className="text-gray-700">
          Password
        </label>
        <input  
          type="password"
          id="password"
          placeholder="Enter password"
          className="border border-gray-100 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        </div>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <button className="bg-pink-800 text-white py-2 px-4 rounded-full  hover:bg-pink-700 w-full sm:w-32 cursor-pointer">
          Login
        </button>
        <button className=" text-pink-800 py-2 px-4 rounded-full  border-pink-800 border-2 w-full sm:w-32 cursor-pointer">
          {/* <span className='text-[10px] whitespace-nowrap'>New user?</span> */}
          Register
        </button>
        </div>

      </form>
    </div>
    <div className="h-96 w-68 bg-transparent absolute bottom-0 left-[-38] hidden sm:block">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-ch.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat"}}></div>
       </div>
    </div>
    
  )
}

export default page