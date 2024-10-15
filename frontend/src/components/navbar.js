import React, { useEffect, useState } from 'react';
import traveltime from "../images/traveltime.png";

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/isauth', {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("data: ", data);
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


    return (
        <header className='flex border-b py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50'>
            <div className='flex flex-wrap items-center gap-4 w-full'>
                <a href="/"><img src={traveltime} alt="logo" className='w-36' /></a>

                <div id="collapseMenu"
                    className='lg:!flex lg:flex-auto lg:ml-12 max-lg:hidden max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
                    <button id="toggleClose" className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-black" viewBox="0 0 320.591 320.591">
                            <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                            <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
                        </svg>
                    </button>

                    <div className="lg:!flex lg:flex-auto max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                        <ul className='lg:flex lg:gap-x-8 max-lg:space-y-2'>
                            <li className='mb-6 hidden max-lg:block'>
                                <a href="javascript:void(0)"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" className='w-36' /></a>
                            </li>
                            <li className='max-lg:border-b max-lg:py-3'><a href='/' className='hover:text-[#007bff] block'>Home</a></li>
                            <li className='max-lg:border-b max-lg:py-3'><a href='javascript:void(0)' className='hover:text-[#007bff] block'>Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='flex items-center ml-auto space-x-6 whitespace-nowrap'>
                {isAuthenticated ? (
                    <>
                        <span>{user?.username || 'User'}</span>
                        <button onClick={handleLogout} className='hover:text-[#007bff]'>Sign out</button>
                    </>
                ) : (
                    <>
                        <a href='/signup' className='hover:text-[#007bff]'>Sign up</a>
                        <a href='/signin' className='hover:text-[#007bff]'>Sign in</a>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;