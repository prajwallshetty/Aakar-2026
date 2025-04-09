import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4 animate-pulse">
        🎉 Registration Successful!
      </h1>
      <p className="text-lg md:text-xl text-white mb-6 max-w-xl">
        You're officially registered for 
        <span className="inline-block align-middle ml-2">
          <Image
            className="w-[80px] h-auto inline-block"
            src="/logo.png"
            width={100}
            height={100}
            alt="Aakar Logo"
          />
        </span>
        Get ready for an unforgettable fest full of thrill, creativity, and memories.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 shadow-lg"
      >
        Go to Homepage
      </Link>
    </div>
  )
}

export default PaymentSuccessPage