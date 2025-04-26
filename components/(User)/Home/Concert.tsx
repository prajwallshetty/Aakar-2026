"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

const Concert = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-full py-12 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">Live Concert – Day 2</h2>
        <h3 className="text-3xl font-semibold mb-4">The Harmonic Vibes</h3>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Day 2 of Aakar 2025 will echo with raw energy and new beats as a talented new band steps into the spotlight <br />join us for a night of musical discovery and excitement!
        </p>

        <div className="relative w-full max-w-xl mx-auto cursor-pointer group" onClick={openModal}>
          <Image
            src="/Concert.png"
            alt="Concert Preview"
            width={800}
            height={450}
            className="rounded-[3rem] object-cover w-full h-auto shadow-lg group-hover:opacity-80 transition duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-3xl font-semibold">▶ Play Video</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl overflow-hidden max-w-3xl w-full">
            <div className="w-full aspect-video">
              <video
                className="w-full h-full object-cover cursor-pointer"
                src="/concert.mp4"
                muted
                loop
                autoPlay
                playsInline
                preload='none'
              />
            </div>
            <div className="text-right p-2">
              <Button
                onClick={closeModal}
                className="text-white bg-transparent text-sm cursor-pointer hover:text-red-400"
              >
                Close ✖
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Concert