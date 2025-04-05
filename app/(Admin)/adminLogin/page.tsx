'use client';

import React from 'react';
import Link from 'next/link';

const AdminLogin = () => {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-8 bg-gray-100">
            <div className="flex flex-col bg-white w-full max-w-md p-8 rounded-lg shadow-lg border-t-4 border-blue-700">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-700 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold ml-3 text-gray-800">Admin Portal</h2>
                </div>

                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your admin email"
                            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <label htmlFor="password" className="text-gray-700 font-medium">
                                Admin Password
                            </label>
                            <Link href="/admin/forgot-password" className="text-blue-600 text-sm hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter admin password"
                            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-gray-700">Keep me signed in</span>
                        </label>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="bg-blue-700 cursor-pointer text-white py-3 px-4 rounded-md w-full font-medium hover:bg-blue-800 transition duration-200"
                        >
                            Sign In to Admin
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-sm">
                            Need help? <Link href="/admin/support" className="text-blue-600 hover:underline">Contact Support</Link>
                        </p>
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-center">
                        <Link href="/">
                            <button className="text-blue-700 cursor-pointer py-2 px-4 rounded-md border border-blue-700 hover:bg-blue-50 transition duration-200">
                                Back to Main Site
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="h-96 w-64 absolute bottom-0 right-0 hidden lg:block">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/admin-illustration.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
            </div>
        </div>
    );
};

export default AdminLogin;