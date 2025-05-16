import { Montserrat } from 'next/font/google'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const montserrat = Montserrat({ subsets: ['latin'], weight: '400' })

const RegisterSection = () => {
    return (
        <section className="flex items-center justify-center text-white px-6 pt-16 relative">
            <div className="text-center max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-light pb-6">Register Now</h2>

                <p className={`text-xl md:text-2xl py-6 ${montserrat.className}`}>
                    Don’t miss out on the ultimate techno-cultural experience!
                    <br />
                    Register now and be part of the excitement!
                    <br />
                    Participation is open to all UG and PG students.
                    <span className="inline-block align-middle ml-2">
                        <Image
                            className="w-[100px] h-auto inline-block"
                            src="/new_logo.png"
                            width={100}
                            height={100}
                            alt="Aakar Logo"
                        />
                    </span>
                </p>

                <Link href="/register">
                    <Button size={"lg"} className="mt-6 bg-[#AA1F26] hover:bg-red-700 cursor-pointer transition duration-300 text-white font-light py-8 px-8 rounded-full text-xl leading-none">
                        Register Now
                    </Button>
                </Link>
            </div>
        </section>
    )
}

export default RegisterSection