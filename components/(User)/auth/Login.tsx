"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
                setIsLoading(false)
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-8" >
            <div className="flex flex-col bg-white w-100 p-6 rounded shadow-md">
                <h2 className="text-black text-lg font-semibold mb-4 flex justify-center">Login</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className="text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-100 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className="text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-100 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-pink-800 text-white py-2 px-4 rounded-full hover:bg-pink-700 w-full sm:w-32 cursor-pointer disabled:opacity-70">
                            {isLoading ? 'Loading...' : 'Login'}
                        </Button>
                        <Link href="/register">
                            <Button type="button" className="text-pink-800 py-2 px-4 rounded-full border-pink-800 border-2 w-full sm:w-32 cursor-pointer">
                                Register
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
            <div className="h-96 w-68 bg-transparent absolute bottom-0 left-[-38] hidden md:block">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-ch.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
            </div>
        </div>
    )
}

export default Login