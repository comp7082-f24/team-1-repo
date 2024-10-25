import React, { useEffect, useState } from 'react';
import traveltime from "../images/traveltime.png";

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/isauth', {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await response.json();
                setIsAuthenticated(data.authenticated);
                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/signout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setUser(null);
                window.location.href = '/';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className='flex border-b py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50'>
            <div className='flex flex-wrap items-center gap-4 w-full'>
                <a href="/"><img src={traveltime} alt="logo" className='w-36' /></a>

                {/* Hamburger */}
                <button onClick={toggleMenu} className="lg:hidden ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Links section */}
                <div className={`lg:flex lg:items-center lg:ml-auto ${menuOpen ? 'block' : 'hidden'} w-full lg:w-auto`}>
                    <ul className='lg:flex lg:gap-x-8 text-center'>
                        <li className='max-lg:border-b max-lg:py-3'><a href='/' className='hover:text-[#007bff] block'>Home</a></li>
                        <li className='max-lg:border-b max-lg:py-3'><a href='javascript:void(0)' className='hover:text-[#007bff] block'>Contact</a></li>
                        {isAuthenticated ? (
                            <>
                                <li className='max-lg:border-b max-lg:py-3'><a href='/profile' className='hover:text-[#007bff] block'>{user?.username || 'User'}</a></li>
                                <li className='max-lg:border-b max-lg:py-3'><a onClick={handleLogout} className='hover:text-[#007bff] block'>Sign out</a></li>
                            </>
                        ) : (
                            <>
                                <li className='max-lg:border-b max-lg:py-3'><a href='/signup' className='hover:text-[#007bff] block'>Sign up</a></li>
                                <li className='max-lg:border-b max-lg:py-3'><a href='/signin' className='hover:text-[#007bff] block'>Sign in</a></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Navbar;