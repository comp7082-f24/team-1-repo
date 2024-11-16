import React, { useState, useEffect } from "react";
import { BellIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import placeholder from "../images/placeholder.png";
import MapComponent from "../components/MapComponent"; // Import the MapComponent
import { WMO_CODE_MAP } from ".././utils/weatherCode";

function DestinationDetails() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isWeatherAlertSet, setIsWeatherAlertSet] = useState(false);
  const weatherCodes = [0, 3, 61, 71];

  useEffect(() => {
    document.title = "Destination Details";
  }, []);

  const handleWeatherAlertClick = () => {
    setIsWeatherAlertSet((prevState) => !prevState); // Toggle the state
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="sm:px-10 mt-6 mx-auto p-4 relative z-10">
      {/** trip summary */}
      <p className="text-4xl font-bold mb-6">Trip Summary</p>
      <div className="flex items-center w-full justify-between space-x-4">
        {/* Weather summary section */}
        <div className="flex items-center justify-evenly w-1/4 border border-black">
          {weatherCodes.map((code, index) => {
            const weather = WMO_CODE_MAP[code]?.day; // Get day weather info
            return (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={weather?.image || ""}
                  alt={weather?.description || "Weather Icon"}
                  title={weather?.description || "Weather Icon"}
                  className="w-10 h-10" // Make the icons bigger
                />
                <p className="text-2xl">5</p>
              </div>
            );
          })}
        </div>

        {/* Activities planned */}
        <div className="flex items-center justify-center w-1/4 border border-black">
          <p className="text-2xl">? activities planned</p>
        </div>

        {/* See detailed weather data */}
        <div className="flex items-center justify-center w-1/4 border border-black">
          <a
            href="javascript:void(0)"
            className="text-2xl text-[#007bff] hover:text-[#0062cc] underline"
          >
            See Detailed Weather 
          </a>
        </div>

        {/* Weather alert button with bell */}
        <div className="flex items-center justify-center w-1/4 border border-black">
          <button
            className={`p-2 rounded flex items-center justify-center space-x-2 ${
              isWeatherAlertSet
                ? "bg-yellow-300 text-black"
                : "bg-blue-500 text-white"
            }`}
            onClick={handleWeatherAlertClick}
            style={{ minWidth: "180px" }}
          >
            <BellIcon
              className={`w-6 h-6 ${
                isWeatherAlertSet ? "text-yellow-400" : "text-gray-500"
              }`}
            />
            <span>
              {isWeatherAlertSet ? "Weather Alerted" : "Weather Change Alert"}
            </span>
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
                    className={`w-6 h-6 transform transition-transform duration-200 ${
                      openIndex === 0 ? "rotate-180" : "rotate-0"
                    }`}
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
                <div className={`${openIndex === 0 ? "block" : "hidden"} p-4`}>
                  {/** card content */}
                  <div className="items-center border border-black rounded-md">
                    <div className="flex justify-end items-center">
                      <button className="text-xl font-bold mt-2 mr-2">✖</button>
                    </div>
                    <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        className="w-full h-40 object-cover"
                        src={placeholder}
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <a
                            href="#"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Rome: Priority Access Colosseum, Roman Forum &
                            Palatine Tour
                          </a>
                          <a href="#">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8l-5-3z"
                              />
                            </svg>
                          </a>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          5 hours • Skip the line • Small group
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm">8:30 AM ~ 12:30 PM</p>
                          </div>
                          <p className="text-sm font-semibold">Jan. 5th 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border-t border-gray-200">
                        <img
                          src={WMO_CODE_MAP[0]?.day?.image || ""}
                          alt={WMO_CODE_MAP[0]?.day?.description || "Sunny"}
                          title={WMO_CODE_MAP[0]?.day?.description || "Sunny"}
                          className="w-6 h-6"
                        />
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
                    className={`w-6 h-6 transform transition-transform duration-200 ${
                      openIndex === 1 ? "rotate-180" : "rotate-0"
                    }`}
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
                <div className={`${openIndex === 1 ? "block" : "hidden"} p-4`}>
                  <p>content</p>
                </div>
              </div>
            </div>
          </div>

          {/** right: map */}
          <div className="w-2/3 p-4">
            <div className="border border-gray-300 rounded-lg shadow-md p-6">
              <div className="flex w-full">{/* Cards for activities */}</div>

              {/* Updated map section */}
              <div>
                <MapComponent
                  location={{ latitude: 0, longitude: 0 }}
                  className="w-full h-full"
                />{" "}
                {/* Pass actual location data */}
              </div>
            </div>
          </div>
        </div>

        {/** bottom: cost */}
        <div className="flex w-full">
          <div className="w-full p-2 ml-4 mt-4">
            <p className="text-4xl font-bold mb-6">
              Total Estimated Cost: $555
            </p>
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
