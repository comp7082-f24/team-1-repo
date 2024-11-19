import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BellIcon } from "@heroicons/react/solid";
import placeholder from "../images/placeholder.png";
import MapComponent from "../components/MapComponent"; // Import the MapComponent
import { WMO_CODE_MAP } from "../utils/weatherCode";

function DestinationDetails() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [isWeatherAlertSet, setIsWeatherAlertSet] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track which dropdown is open
  const weatherCodes = [0, 3, 61, 71];

  useEffect(() => {
    document.title = "Destination Details";
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/isauth", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          setUser(data.user);
        } else {
          window.location.href = "/signin";
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/events/${user.id}`);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [user]);

  const handleWeatherAlertClick = () => {
    setIsWeatherAlertSet((prevState) => !prevState); // Toggle the state
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <div className="sm:px-10 mt-6 mx-auto p-4 relative z-10">
      {/** trip summary */}
      <p className="text-4xl font-bold mb-6">Trip Summary</p>
      <div className="flex items-center w-full justify-between space-x-4">
        {/* Weather summary section */}
        <div className="flex items-center justify-evenly w-1/4  ">
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
        <div className="flex items-center justify-center w-1/4 ">
          <p className="text-2xl">{events?.length || 0} activities planned</p>
        </div>

        {/* See detailed weather data 
        <div className="flex items-center justify-center w-1/4 ">
          <a
            href="javascript:void(0)"
            className="text-2xl text-[#007bff] hover:text-[#0062cc] underline"
          >
            See Detailed Weather
          </a>
        </div>*/}

        {/* Weather alert button with bell */}
        <div className="flex items-center justify-center w-1/4 ">
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
            {events.map((event, index) => (
              <div key={index} className="w-full m-4 mb-0">
                <div className="rounded-lg">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleAnswer(index)}
                  >
                    <span>{event.date || "No date available"}</span>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : "rotate-0"
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
                  <div className={`${openIndex === index ? "block" : "hidden"} p-4`}>
                    {/** Card content */}
                    <div className="items-center border border-black rounded-md">
                      <div className="flex justify-end items-center">
                        <button className="text-xl font-bold mt-2 mr-2">✖</button>
                      </div>
                      <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                          className="w-full h-40 object-cover"
                          src={event.image || placeholder}
                          alt={event.title || "Event Image"}
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <a
                              href="#"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              {event.title || "Untitled Event"}
                            </a>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {event.description || "No description available"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <p className="text-sm">{event.time || "No time specified"}</p>
                            </div>
                            <p className="text-sm font-semibold">{event.date || "No date"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                />
                {/* Pass actual location data */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
