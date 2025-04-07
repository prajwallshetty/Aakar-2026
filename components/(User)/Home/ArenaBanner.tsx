import React from 'react'

const ArenaBanner = () => {
    return (
        <div className="w-full text-white py-16 px-6 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-6xl font-extrabold tracking-wide leading-tight animate-pulse z-10 relative">
                All in or out
                <br />
                <span className="inline-block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#AA1F26] via-red-500 to-yellow-400 animate-textZoom">
                    Aakar is an ARENA
                </span>
            </h2>

            <div className="h-full w-[300px] absolute bottom-0 left-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-left"
                    style={{
                        backgroundImage: "url('/profile-ch-left.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }}
                />
            </div>

            <div className="h-full w-[300px] absolute bottom-0 right-0 hidden md:block z-0">
                <div
                    className="h-full w-full bg-cover bg-right"
                    style={{
                        backgroundImage: "url('/profile-ch-right.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }}
                />
            </div>
        </div>
    )
}

export default ArenaBanner