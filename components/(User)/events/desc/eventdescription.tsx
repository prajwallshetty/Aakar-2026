import React from 'react'
import Link from 'next/link'

const Eventdescription = () => {
    return (
        <div className="min-h-screen  text-white flex flex-col items-center justify-center px-6 p-10">
            <div className="mt-24 w-full flex flex-col md:flex-row items-center justify-center  text-center md:text-left">
                <div className="md:w-1/2 flex-flex-col justify-center space-y-4 ">
                    <h1 className="text-5xl font-bold text-white tracking-wider neon-text">BLITZBOT SOCCER</h1>
                    <p className="text-gray-300 max-w-md relative top-5">
                        BlitzBot Soccer offers a dynamic twist to traditional soccer, featuring high-speed matches played by robots. With rapid actions and energetic gameplay, it's an exhilarating spectacle for both players and spectators.
                    </p>
                    <div className="flex flex-col space-y-2 text-3xl text-white relative top-7 ">
                        <p>⚪ May 9th</p>
                        <p>⚪ 10 PM</p>
                        <p>⚪ ₹300/P</p>
                    </div>
                    <Link href="/register">
                        <button className="bg-red-600 hover:bg-red-800 text-white py-2 px-25 rounded-lg mt-4 relative top-1">Register</button>
                    </Link>
                </div>

                <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                    <div className="w-90 h-100 bg-gray-400 rounded-xl"></div>
                </div>
            </div>


            {/* <div className='md:w-1/2 h-2/3 flex justify-center  md:mt-0 bg-red-500 w-full bg-opacity-30 mt-20 rounded-lg text-center'> */}
            <div>
                <h2 className="text-3xl font-semibold mt-12 flex justify-center" >RULES</h2>
                <p className="text-gray-300 max-w-md relative top-5 flx justify-center">
                   The game is played on a designated arena with obstacles and a goal at each end.
                    One ball is placed in the center of the arena at the start of each match.
                    Robots are placed at their respective goal posts at the start of each match.
                    Time Limit: The game has a set time limit (e.g., 3 minutes).
                    Movement: Robots can be controlled by participants (wired, wireless, or autonomous).
                    Scoring: Robots can push or hit the ball to score by sending it into the opponent's goal.
                </p>
            </div>
            {/* </div> */}




            <div className="bg-red-500 w-full   bg-opacity-30 mt-12 p-4 rounded-lg text-center">
                <h2 className="text-xl font-semibold">Event Coordinators</h2>
                <div className="flex flex-col md:flex-row justify-center mt-5 space-y-4 md:space-y-0 md:space-x-6 gap-20">
                    <div className="bg-gray-800 px-15 py-4 rounded-lg">
                        <p className="text-white">Gagan Rao</p>
                        <p className="text-gray-300">📞 948042128</p>
                    </div>
                    <div className="bg-gray-800 px-15 py-4 rounded-lg">
                        <p className="text-white">Anup Krishna N</p>
                        <p className="text-gray-300">📞 6364000253</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Eventdescription