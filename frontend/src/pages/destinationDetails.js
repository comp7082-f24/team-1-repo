import React, { useState, useEffect } from 'react';
import { SunIcon, BellIcon, ExternalLinkIcon} from '@heroicons/react/solid';
import placeholder from '../images/placeholder.png'

function DestinationDetails() {
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        document.title = "Destination Details";
    }, []);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <div className="sm:px-10 mt-6 mx-auto p-4 relative z-10">
            <div className="mb-6 flex space-x-8 items-center">
                {/** location */}
                <div className="items-center border border-black rounded-md w-1/4">
                    <input
                        type="text"
                        id="location1"
                        placeholder="From location"
                        className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="items-center border border-black rounded-md w-1/4">
                    <input
                        type="text"
                        id="location2"
                        placeholder="To location"
                        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/** date thing */}
                <div className="items-center border border-gray-300 rounded-md w-1/3 flex-none">
                    <input
                        type="text"
                        id="date"
                        placeholder=""
                        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>

                {/** days flexibility */}
                <div className="items-center border border-black rounded-md w-1/4">
                    <input
                        type="text"
                        id="flexibility"
                        placeholder="days flexibility"
                        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/** trip summary */}
            <p className="text-4xl font-bold mb-6">Trip Summary</p>
            <div className="flex items-center w-full justify-between space-x-4"> 
                <div className="flex items-center space-x-5">
                    <SunIcon className="w-6 h-6" />
                    <p className="text-2xl">5</p>
                    <SunIcon className="w-6 h-6" />
                    <p className="text-2xl">5</p>
                    <SunIcon className="w-6 h-6" />
                    <p className="text-2xl">5</p>
                </div>
                <div className="flex items-center">
                    <p className="text-2xl ml-20">5 activities planned</p>
                </div>
                <div className="flex items-center">
                    <a href="javascript:void(0)" className="text-2xl ml-20 text-[#007bff] hover:text-[#0062cc] underline">
                        See detailed weather data
                    </a>
                </div>
                <div className="flex items-center ml-20">
                    <button className="flex items-center border border-black px-2 py-2 ml-8 rounded">
                        <BellIcon className="w-6 h-6 mr-2" />
                        Notify for weather change alert when approaching travel date
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-center items-start border border-black rounded-md mt-10">

                {/** Top section with cards and calendar */}
                <div className="flex w-full">
                    {/** left: cards */}
                    <div className="flex flex-col ml-4 items-center w-1/3">
                        <div className="w-full m-4 mb-0">
                            <div className="rounded-lg">
                                <button
                                    className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-200 focus:outline-none"
                                    onClick={() => toggleAnswer(0)}
                                >
                                    <span>Monday Jan. 5th 2025</span>
                                    <svg
                                        className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === 0 ? 'rotate-180' : 'rotate-0'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15l-3-3h6l-3 3zm0 0l3-3H9l3 3z"
                                        />
                                    </svg>
                                </button>
                                <div className={`${openIndex === 0 ? 'block' : 'hidden'} p-4`}>
                                    {/** card content */}
                                    <div className="items-center border border-black rounded-md">
                                        <div class="flex justify-end items-center">
                                            <button class="text-xl font-bold mt-2 mr-2">✖</button>
                                        </div>
                                        <div class="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
                                            <img class="w-full h-40 object-cover" src={placeholder} />
                                            <div class="p-4">
                                                <div class="flex justify-between items-center">
                                                    <a href="#" class="text-blue-600 hover:underline font-semibold">
                                                        Rome: Priority Access Colosseum, Roman Forum & Palatine Tour
                                                    </a>
                                                    <a href="#">
                                                        <svg class="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8l-5-3z" />
                                                        </svg>
                                                    </a>
                                                </div>
                                                <p class="mt-2 text-sm text-gray-600">5 hours • Skip the line • Small group</p>
                                                <div class="flex justify-between items-center mt-2">
                                                    <div>
                                                        <p class="text-sm">8:30 AM ~ 12:30 PM</p>
                                                    </div>
                                                    <p class="text-sm font-semibold">Jan. 5th 2025</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center p-4 border-t border-gray-200">
                                                <SunIcon className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full m-4">
                            <div className="rounded-lg">
                                <button
                                    className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-200 focus:outline-none"
                                    onClick={() => toggleAnswer(1)}
                                >
                                    <span>Monday Jan. 5th 2025</span>
                                    <svg
                                        className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === 1 ? 'rotate-180' : 'rotate-0'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15l-3-3h6l-3 3zm0 0l3-3H9l3 3z"
                                        />
                                    </svg>
                                </button>
                                <div className={`${openIndex === 1 ? 'block' : 'hidden'} p-4`}>
                                    <p>content</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** right: map */}
                    <div className="w-2/3 p-4">
                        <div className="border border-gray-300 rounded-lg shadow-md p-6">
                            <p>MAP</p>
                        </div>
                    </div>
                </div>

                {/** bottom: cost */}
                <div className="flex w-full">
                <div className="w-full p-2 ml-4 mt-4">
                    <p className="text-4xl font-bold mb-6">Total Estimated Cost: $555</p>
                </div>
                    <div className="w-1/3 p-4">
                        <div className="border border-gray-300 rounded-lg shadow-md p-4 flex items-center">
                            <ExternalLinkIcon className="w-5 h-5 mr-2" />
                            <p className="text-base">Open all activities for booking</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default DestinationDetails;
