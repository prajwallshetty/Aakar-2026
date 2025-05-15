import Image from 'next/image'
import React from 'react'

const Concert = () => {

  return (
    <div className="w-full py-12 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">Live Concert – Day 2</h2>
        <h3 className="text-3xl font-semibold mb-4">The Harmonic Vibes</h3>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Day 2 of Aakar 2025 will echo with raw energy and new beats as a talented new band steps into the spotlight <br />join us for a night of musical discovery and excitement!
        </p>

        <div className="relative w-full max-w-xl mx-auto group">
          <Image
            src="/Concert.png"
            alt="Concert Preview"
            width={800}
            height={450}
            className="rounded-[3rem] object-cover w-full h-auto shadow-lg transition duration-300"
          />
        </div>
      </div>
    </div>
  )
}

export default Concert