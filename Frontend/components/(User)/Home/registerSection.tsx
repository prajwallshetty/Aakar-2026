import React from 'react'

const RegisterSection = () => {
    return (
        <section className="flex items-center justify-center min-h-screen text-white p-6 relative">
            <div className="text-center"> <h2 className="text-[71.7px] font-semibold tracking-normal mb-15 uppercase font-[GameOfSquids] leading-[100%]">
                REGISTER NOW </h2>
                <br className='mb-10'></br>
                <p className="text-3xl mb-8"> Don't miss out on the ultimate techno-cultural experience!
                    <br /> Register now and be part of the excitement at <span className="text-red-500 font-bold">AAKAR 2025</span>
                </p>
                <br />
                <button className='bg-[#AA1F26] hover:bg-red-700 text-white font-semibold py-4 px-7 rounded-full text-3xl leading-none'>Register Now</button>
            </div>
        </section>
    )
}

export default RegisterSection

