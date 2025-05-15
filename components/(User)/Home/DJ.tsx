import Image from 'next/image'
import React from 'react'

const DJ = () => {

  return (
    <div className="w-full py-12 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">DJ Night – Day 1</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Day 1 of Aakar 2025 will end on a high note with the electrifying DJ Night !! Get ready to experience the unforgettable beats and energy that will light up the night. Stay tuned for more details!!
        </p>

        <div className="relative w-full max-w-xl mx-auto group">
          <Image
            src="/dj.png"
            alt="DJ Performance Preview"
            width={800}
            height={450}
            className="rounded-3xl object-cover w-full h-auto shadow-lg transition duration-300"
          />
        </div>
      </div>
    </div>
  )
}

export default DJ