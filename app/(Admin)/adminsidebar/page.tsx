"use client";
import React, { useState } from 'react';
import { Home, Info, Settings, Mail, Menu, ChevronRight } from 'lucide-react';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: <Home size={18} />, label: 'Home' },
        { icon: <Info size={18} />, label: 'About' },
        { icon: <Settings size={18} />, label: 'Services' },
        { icon: <Mail size={18} />, label: 'Contact' }
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`h-screen bg-black text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
            <div className="flex justify-between items-center p-4">
                {isOpen && <h1 className="text-xl font-bold">AdminLogin</h1>}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-300 hover:text-white"
                >
                    {isOpen ? <ChevronRight size={24} /> : <Menu size={24} />}
                </button>
            </div>
            <ul className="mt-2">
                {menuItems.map((item, index) => (
                    <li key={index} className="flex items-center p-3 hover:bg-gray-700 cursor-pointer">
                        <span className="text-gray-400">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.label}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;