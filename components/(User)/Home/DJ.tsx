import Image from 'next/image'
import React from 'react'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const DJ = () => {

  return (
    <div className="w-full py-12 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">DJ Night – Day 1</h2>
        <h3 className="text-3xl font-semibold mb-4">Pulse Night</h3>
        <p className={`text-lg md:text-xl text-gray-300 mb-8 ${montserrat.className}`}>
          Day 1 of Aakar 2025 will end on a high note with the electrifying DJ Night featuring VDJ Toxic!<br/>
          Get ready to experience unforgettable beats and explosive energy that will light up the night.
        </p>

        <div className="relative w-full max-w-xl mx-auto group">
          <Link href="https://www.instagram.com/vdj_toxic_india?igsh=MWJveTZuY3NyY250Mg==" rel="noopener noreferrer" className='cursor-pointer' target="_blank">
            <Image
              src="/dj.png"
              alt="DJ Performance Preview"
              width={800}
              height={450}
              className="rounded-3xl object-cover w-full h-auto shadow-lg transition duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DJ