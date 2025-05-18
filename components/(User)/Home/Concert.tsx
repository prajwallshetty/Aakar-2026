import Image from 'next/image'
import React from 'react'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const Concert = () => {

  return (
    <div className="w-full py-12 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">Live Concert – Day 2</h2>
        <h3 className="text-3xl font-semibold mb-4">The Harmonic Vibes</h3>
        <p className={`text-lg md:text-xl text-gray-300 mb-8 ${montserrat.className}`}>
          Day 2 of Aakar 2025 will echo with raw energy and new beats as Rythm Mates steps into the spotlight.<br />
          Join us for a night of musical discovery and excitement!
        </p>

        <div className="relative w-full max-w-xl mx-auto group">
          <Link href="https://www.instagram.com/bandrhythmmates?igsh=MTd2aHg4anlidW5vdw==" rel='noopener noreferrer' className='cursor-pointer' target="_blank">
            <Image
              src="/Concert.png"
              alt="Concert Preview"
              width={800}
              height={450}
              className="rounded-[3rem] object-cover w-full h-auto shadow-lg transition duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Concert