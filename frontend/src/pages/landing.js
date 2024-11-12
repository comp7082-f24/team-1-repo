import React, { useState, useEffect } from "react";
import { SearchIcon, LocationMarkerIcon } from "@heroicons/react/solid";
import "../App.css";
import { useLocationData, useWeather } from "../utils/contexts";
import DataCard from "../components/DataCard";
import QueryCard from "../components/queryCard/queryCard";
import PopupModal from "../components/queryCard/popupModal";
import placeholder from "../images/placeholder.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [, setLocationData] = useLocationData();
  const [weatherData, setWeatherData] = useWeather();
  const [showModal, setShowModal] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [cardInfoArray, setCardInfoArray] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (data) => {
    setSelectedCardData(data);
    setShowModal(true);
  };

  const handleClosePopup = () => {
    setShowModal(false);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = () => {
    if (!location || !startDate || !endDate) {
      alert("Please fill out all fields before searching.");
      return;
    }

    fetch(`/getcoordinates?location=${location}`)
    .then((response) => response.json())
    .then((data) => {
      const latitude = data.latitude;
      const longitude = data.longitude;
      setLocationData({ location, longitude, latitude });
        
      fetch(`/getweather`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({startDate: startDate, endDate: endDate, latitude: latitude, longitude: longitude})})
      .then((response) => response.json())
      .then((data) => {
        const averagedData = data.averagedData;
            
        fetch(`/getrealweather`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({startDate: startDate, endDate: endDate, latitude: latitude, longitude: longitude, averagedData: averagedData})})
        .then((response) => response.json())
        .then((data) => {
          const weatherDataResult = data.weatherDataResult;
          setWeatherData(weatherDataResult);
          navigate("/planner");
        })
        .catch((error) => console.error(error))
      })
      .catch((error) => console.error(error))
    })
    .catch((error) => console.error(error))
  };

  const saveQuery = async () => {
    if (!location || !startDate || !endDate) {
      return;
    }

    try {
      const authResponse = await fetch("/isauth", {
        method: "POST",
        credentials: "include",
      });
      const authData = await authResponse.json();
      // path if user is signed in
      if (authData.authenticated) {
        const response = await fetch("/savequery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: authData.user.id,
            searchQuery: location,
            startDate,
            endDate,
          }),
        });
        if (!response.ok) {
          console.error("Something went wrong");
        }
        // path if they are signed out
      } else {
        const response = await fetch("/savequery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            searchQuery: location,
            startDate,
            endDate,
          }),
        });
        if (!response.ok) {
          console.error("Something went wrong");
        }
      }
    } catch (error) {
      console.error("Unexpected Error: ", error);
    }
  };

  useEffect(() => {
    document.title = "Travel Time";

    const fetchPopularQueryAndWikiData = async () => {
      try {
        // Fetch popular queries from the database
        const queryResponse = await fetch("/popularqueries");
        if (!queryResponse.ok) {
          throw new Error("Couldn't fetch queries");
        }
        const popularQueryData = await queryResponse.json();

        // Fetch data from Wikipedia based on popular queries
        const wikiDataArray = await Promise.all(
          popularQueryData.map(async (query) => {
            const wikiResponse = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                query._id
              )}`
            );
            if (!wikiResponse.ok) {
              throw new Error("Location not found.");
            }
            const wikiData = await wikiResponse.json();
            return { ...wikiData, count: query.count };
          })
        );
        setCardInfoArray(wikiDataArray);
      } catch (error) {
        console.error(error);

        // dummy data
        const dummyData = [
          {
            _id: "vancouver",
            count: 4,
          },
          {
            _id: "bangkok",
            count: 2,
          },
          {
            _id: "stockholm",
            count: 1,
          },
          {
            _id: "rome",
            count: 1,
          },
        ];

        // Fetch Wikipedia data for dummy data
        try {
          const dummyWikiDataArray = await Promise.all(
            dummyData.map(async (query) => {
              const wikiResponse = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                  query._id
                )}`
              );
              if (!wikiResponse.ok) {
                throw new Error("Location not found.");
              }
              const wikiData = await wikiResponse.json();
              return { ...wikiData, count: query.count };
            })
          );
          setCardInfoArray(dummyWikiDataArray);
        } catch (wikiError) {
          console.error(wikiError);
        }
      }
    };

    fetchPopularQueryAndWikiData();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center">
        {/* PopupModal Component */}
        {showModal && (
          <PopupModal data={selectedCardData} onClose={handleClosePopup} />
        )}
      </div>
      {/* Top section */}
      <div className="mx-auto p-4 relative">
        <div className="max-w-6xl mx-auto p-4 mt-10 mb-20 relative">
          <p className="mb-10 mt-10 text-6xl">Plan Your Next Trip</p>
          <p className="mt-10 mb-10 text-3xl">
            Check for weather predictions and activities to better plan your
            trip
          </p>

          {/* Location and Date inputs */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Location
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Location"
                  className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="location-icon"
                />
                <span className="p-1" id="location-icon">
                  <LocationMarkerIcon
                    className="h-5 w-5 mr-2"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <p className="text-gray-500 text-xs">Please enter a location</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="start-date"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Start Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="start-date-icon"
                />
              </div>
              <p className="text-gray-500 text-xs">
                Please enter the start date of your trip
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="end-date"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                End Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="end-date-icon"
                />
              </div>
              <p className="text-gray-500 text-xs">
                Please enter the end date of your trip
              </p>
            </div>

            {/** Handle search and save query */}
            <button
              onClick={() => {
                handleSearch();
                saveQuery();
              }}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center"
            >
              Search
              <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="bg" />
      </div>

      {/* Display DataCard when dailyWeatherData is available */}
      {weatherData?.length > 0 && (
        <div className="max-w-6xl mx-auto p-4 mb-10">
          {weatherData.map((data, index) => (
            <DataCard
              key={index}
              location={location}
              date={data.date}
              temperature={data.averageTemperature}
              precipitation={data.averagePrecipitation}
            />
          ))}
        </div>
      )}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto p-4 mb-10">
          <h2 className="mb-4 mt-20 text-6xl">Most Popular Queries</h2>
          <p className="mb-10 text-gray-500">Quality as judged by customers</p>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            {cardInfoArray.map((info, index) => (
              <QueryCard
                key={index}
                index={index}
                thumbnail={
                  info.originalimage?.source
                    ? info.originalimage.source
                    : placeholder
                }
                data={info}
                onClick={() => handleCardClick(info)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
