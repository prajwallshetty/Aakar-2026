import { Inter } from 'next/font/google'
import React from 'react'
const inter = Inter({ subsets: ["latin"], weight: "400" })
const RegisterSection = () => {
    return (
        <section className="flex items-center justify-center min-h-screen text-white p-6 relative">
            <div className="text-center"> <h2 className="text-3xl md:text-7xl font-semibold tracking-normal mb-15 uppercase font-[GameOfSquids] leading-[100%] ">
                REGISTER NOW </h2>
                <br className='mb-10'></br>
                <p className={"text-2xl mb-8 font-[Inter] line-height:100% letter-spacing:0% " + inter.className}> Don't miss out on the ultimate techno-cultural experience!
                    <br /> Register now and be part of the excitement at <img className='w-30 h-auto inline-block ml-2' src="Aakarlogo.svg" alt="Logo" />
                </p>
                <br />
                <button className='bg-[#AA1F26] hover:bg-red-700 text-white font-[Inter] font-semibold py-4 px-7 rounded-full text-xl leading-none'>Register Now</button>
            </div>
        </section >
    )
}

export default RegisterSection

