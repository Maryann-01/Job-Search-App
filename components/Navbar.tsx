"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext'; 
const Navbar = () => {
    const { user, logout } = useAuth(); 
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    const getLinkClass = (href: string) => {
        const baseClasses = "px-2 py-1 rounded transition duration-200 text-sm sm:text-base";
        const activeClasses = "text-[#0057ff]";
        const inactiveClasses = "text-gray-500 hover:text-[#0057ff]";
        return `${baseClasses} ${pathname === href ? activeClasses : inactiveClasses}`;
    };
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="flex justify-between items-center p-3 shadow-md relative">
            <h1 className="text-xl sm:text-2xl font-bold">JobSearcher</h1>

            <div className="hidden md:flex gap-4">
                <Link href="/">
                    <span className={getLinkClass("/")}>Home</span>
                </Link>
                <Link href="/about">
                    <span className={getLinkClass("/about")}>About</span>
                </Link>
                <Link href="/jobs">
                    <span className={getLinkClass("/jobs")}>Jobs</span>
                </Link>
                <Link href="/contact">
                    <span className={getLinkClass("/contact")}>Contact</span>
                </Link>
            </div>
            <div className="hidden md:block">
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="border border-[#0057ff] text-gray-500 hover:bg-[#0057ff] hover:text-white mr-4 px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="border border-[#0057ff] text-gray-500 hover:bg-[#0057ff] hover:text-white mr-4 px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
                    >
                        Login
                    </Link>
                )}
            </div>

            <div className="md:hidden">
                <button
                    onClick={() => setMobileNavOpen(!isMobileNavOpen)}
                    className="text-gray-500"
                >
                    {isMobileNavOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {isMobileNavOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md flex flex-col gap-2 p-4 md:hidden">
                    <Link href="/" onClick={() => setMobileNavOpen(false)}>
                        <span className={getLinkClass("/")}>Home</span>
                    </Link>
                    <Link href="/about" onClick={() => setMobileNavOpen(false)}>
                        <span className={getLinkClass("/about")}>About</span>
                    </Link>
                    <Link href="/jobs" onClick={() => setMobileNavOpen(false)}>
                        <span className={getLinkClass("/jobs")}>Jobs</span>
                    </Link>
                    <Link href="/contact" onClick={() => setMobileNavOpen(false)}>
                        <span className={getLinkClass("/contact")}>Contact</span>
                    </Link>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="border border-[#0057ff] text-gray-500 hover:bg-[#0057ff] hover:text-white mr-4 px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileNavOpen(false)}
                            className="border border-[#0057ff] text-gray-500 hover:bg-[#0057ff] hover:text-white mr-4 px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
                        >
                            Login
                        </Link>
                    )}
                    
                </div>
            )}
        </nav>
    );
};

export default Navbar;