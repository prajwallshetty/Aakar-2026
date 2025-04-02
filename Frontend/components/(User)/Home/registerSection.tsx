import { Inter } from 'next/font/google'
import React from 'react'
const inter = Inter({ subsets: ["latin"], weight: "400" })
const RegisterSection = () => {
    return (
        <section className="flex items-center justify-center text-white px-6 py-12 relative">
            <div className="text-center "> <h2 className="text-3xl md:text-5xl font-light pb-12">
                Register Now</h2>
                <p className={"text-2xl py-8 font-[Inter] line-height:100% letter-spacing:0% " + inter.className}> Don't miss out on the ultimate techno-cultural experience!
                    <br /> Register now and be part of the excitement at <img className='w-30 h-auto inline-block ml-2' src="Aakarlogo.svg" alt="Logo" />
                </p>
                <button className='bg-[#AA1F26] hover:bg-red-700 text-white font-[Inter] font-light py-4 px-6 rounded-full text-xl leading-none'>Register Now</button>
            </div>
        </section >
    )
}

export default RegisterSection

