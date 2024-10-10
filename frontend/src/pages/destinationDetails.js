import { SunIcon, BellIcon } from '@heroicons/react/solid';

function DestinationDetails() {
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
            <div className="flex items-center space-x-10"> 
                <div className="flex items-center space-x-1">
                    <SunIcon className="w-6 h-6" />
                    <p className="text-2xl">5</p>
                </div>
                <div className="flex items-center space-x-1">
                    <SunIcon className="w-6 h-6" />
                    <p className="text-2xl">5</p>
                </div>
                <div className="flex items-center space-x-1">
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
                    <button className="flex items-center border border-black px-4 py-2 rounded">
                        <BellIcon className="w-6 h-6 mr-2" />
                        Notify for weather change alert when approaching travel date
                    </button>
                </div>
            </div>

            
        </div>
    );
}

export default DestinationDetails;
