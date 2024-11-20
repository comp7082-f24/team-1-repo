import React, { useState, useEffect } from "react";
import axios from "axios";
import { BellIcon } from "@heroicons/react/solid";
import placeholder from "../images/placeholder.png";
import MapComponent from "../components/MapComponent";
import { WMO_CODE_MAP } from "../utils/weatherCode";

function DestinationDetails() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [isWeatherAlertSet, setIsWeatherAlertSet] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [weatherSummary, setWeatherSummary] = useState({});

  // Helper function to get WMO code from weather condition
  const getWMOCodeFromCondition = (condition) => {
    const lowerCondition = condition.toLowerCase();

    for (const [code, data] of Object.entries(WMO_CODE_MAP)) {
      if (data.day.description.toLowerCase() === lowerCondition) {
        return code;
      }
    }

    for (const [code, data] of Object.entries(WMO_CODE_MAP)) {
      if (
        data.day.description.toLowerCase().includes(lowerCondition) ||
        lowerCondition.includes(data.day.description.toLowerCase())
      ) {
        return code;
      }
    }

    return "0";
  };

  const summarizeWeather = (events) => {
    const summary = {};

    events.forEach((event) => {
      if (event.weather?.condition) {
        const condition = event.weather.condition;
        const wmoCode = getWMOCodeFromCondition(condition);
        const weatherType = WMO_CODE_MAP[wmoCode].day.description;

        summary[wmoCode] = {
          count: (summary[wmoCode]?.count || 0) + 1,
          description: weatherType,
          image: WMO_CODE_MAP[wmoCode].day.image,
        };
      }
    });

    setWeatherSummary(summary);
  };

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
        const updatedEvents = response.data.events.map((event) => ({
          ...event,
          date: new Date(event.date),
        }));
        updatedEvents.sort((a, b) => a.date - b.date);
        setEvents(updatedEvents);
        summarizeWeather(updatedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]);

  const handleWeatherAlertClick = () => {
    setIsWeatherAlertSet((prev) => !prev);
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleRemoveEvent = async (eventId) => {
    try {
      if (!eventId) {
        console.error("Error: eventId is undefined.");
        return;
      }
      await axios.post("/removeEvent", { userId: user.id, eventId });
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Error removing event:", error);
    }
  };

  const EventCard = ({ event, index, isOpen }) => (
    <div className="items-center border border-black rounded-md">
      <div className="flex justify-end items-center">
        <button
          className="text-xl font-bold mt-2 mr-2"
          onClick={() => handleRemoveEvent(event._id)}
        >
          ✖
        </button>
      </div>
      <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
        <img
          className="w-full h-40 object-cover"
          src={event.image || placeholder}
          alt={event.title || "Event Image"}
        />
        <div className="p-4">
          <div className="flex justify-between items-center">
            <a href="#" className="text-blue-600 hover:underline font-semibold">
              {event.title || "Untitled Event"}
            </a>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Event Index: {index}, Open Status: {isOpen ? "Open" : "Closed"}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {event.description || "No description available"}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm">{event.time || "No time specified"}</p>
            </div>
            <p className="text-sm font-semibold">{event.date.toLocaleDateString() || "No date"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sm:px-10 mt-6 mx-auto p-4 relative z-10">
      <p className="text-4xl font-bold mb-6">Trip Summary</p>

      <div className="flex items-center w-full justify-between space-x-4">
        <div className="flex items-center justify-evenly w-1/2">
          {Object.entries(weatherSummary).map(([code, data], index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <img
                  src={data.image}
                  alt={`${data.description} Weather Icon`}
                  title={`${data.description}`}
                  className="w-10 h-10"
                />
                <p className="text-sm">{data.count}</p>
                <p className="text-xs text-gray-600">{data.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center w-1/4">
          <p className="text-2xl">{events?.length || 0} activities planned</p>
        </div>

        <div className="flex items-center justify-center w-1/4">
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
        <div className="flex w-full">
          <div className="flex flex-col ml-4 items-center w-1/3">
            {events.map((event, index) => (
              <div key={index} className="w-full m-4 mb-0">
                <div className="rounded-lg">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleAnswer(index)}
                  >
                    <span>{event.date.toLocaleDateString() || "No date available"}</span>
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
                  <div
                    className={`${
                      openIndex === index ? "block" : "hidden"
                    } p-4`}
                  >
                    <EventCard
                      event={event}
                      index={index}
                      isOpen={openIndex === index}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-2/3 p-4">
            <div className="border border-gray-300 rounded-lg shadow-md p-6">
              <MapComponent
                location={{ latitude: 0, longitude: 0 }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
