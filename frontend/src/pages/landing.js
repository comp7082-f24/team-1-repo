import React, { useState, useEffect } from 'react';
import { SearchIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import '../App.css';
import DataCard from '../components/DataCard';
import QueryCard from '../components/queryCard/queryCard';
import PopupModal from '../components/queryCard/popupModal';
import placeholder from '../images/placeholder.png';

function LandingPage() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyWeatherData, setDailyWeatherData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [cardInfoArray, setCardInfoArray] = useState([]);
  const [popularQueries, setPopularQueries] = useState([]);

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
      alert('Please fill out all fields before searching.');
      return;
    }

    // The +T00:00:00 is to deal with a possible of by one bug, related to javascript Date objects, and timezones.
    const startYear = new Date(startDate + "T00:00:00").getFullYear();
    const endYear = new Date(endDate + "T00:00:00").getFullYear();
    const years_of_data = 5; // We'll gather data for the last 5 years

    let URL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        let longitude = data.results[0].longitude;
        let latitude = data.results[0].latitude;

        const fetchWeatherData = async () => {
          const startDay = startDate.split('-')[2];
          const endDay = endDate.split('-')[2];
          const startMonth = startDate.split('-')[1];
          const endMonth = endDate.split('-')[1];

          const queryEndYear = new Date().getFullYear() - 1; // queryEndYear is one year less than the current year. This is to prevent querying the api for dates that don't have weather data yet, because they are in the future.
          const queryStartYear = (startYear - (endYear - queryEndYear)); // queryStartYear is found by getting the diffrence between endYear and queryEndYear, and applying the same diffrence to startYear.

          let promises = []; // Array to store the promises from the multiple weather api calls in the next block.

          for (let i = 0; i < years_of_data; i++) {
            const start = `${startMonth}-${startDay}`;
            const end = `${endMonth}-${endDay}`;

            const URL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${queryStartYear - i}-${start}&end_date=${queryEndYear - i}-${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum`;

            promises[i] = fetch(URL).then(Response => Response.json()); // This will have the resolved promise be a json object instead of a response object.
          }

          /* Promise.all accepts an iterable of promises, like an array, and will run the .then code, once all of the promises in the iterable have resolved,
           or it will run the .catch code if any of the promises reject or if there is an error in the .then block. Using Promise.all means we can send our api
           requests at the same time instead of sequentionally, and also don't need to worry about the order they resolve in.*/
          Promise.all(promises)
            .then(responses => {
              const date = new Date(startDate + "T00:00:00"); // The +T00:00:00 is to deal with a possible of by one bug, related to javascript Date objects, and timezones.
              const averagedData = [];

              // For each day of data, initialize the array entry for the given day.
              for (let day = 0; day < responses[0].daily.time.length; day++) {
                averagedData[day] = {
                  date: date.toDateString(),
                  averageTemperature: 0,
                  averagePrecipitation: 0,
                }

                // For each year of data, add the data to the days average, while dividing it by the number of years of data, so the average will be accurate.
                for (let year = 0; year < years_of_data; year++) {
                  averagedData[day].averageTemperature += (responses[year].daily.temperature_2m_mean[day]) / years_of_data;
                  averagedData[day].averagePrecipitation += (responses[year].daily.precipitation_sum[day]) / years_of_data;
                }
                date.setDate(date.getDate() + 1); // Increment the date by 1.
              }
              setDailyWeatherData(averagedData); // Send the data, so it will appear on the frontend.
            })
            .catch(error => {
              console.error(error);
            })
        };
        fetchWeatherData();
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
      });
  };

  useEffect(() => {
    const fetchPopularQueryAndWikiData = async () => {
      try {
        // Fetch popular queries from the database
        const queryResponse = await fetch('/popularqueries');
        if (!queryResponse.ok) {
          throw new Error("Couldn't fetch queries");
        }
        const popularQueryData = await queryResponse.json();
        setPopularQueries(popularQueryData);

        // Fetch data from Wikipedia based on popular queries
        const wikiDataArray = await Promise.all(
          popularQueryData.map(async (query) => {
            const wikiResponse = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query._id)}`
            );
            if (!wikiResponse.ok) {
              throw new Error('Location not found.');
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
            "_id": "vancouver",
            "count": 4
          },
          {
            "_id": "bangkok",
            "count": 2
          },
          {
            "_id": "stockholm",
            "count": 1
          },
          {
            "_id": "rome",
            "count": 1
          }
        ];
        setPopularQueries(dummyData);

        // Fetch Wikipedia data for dummy data
        try {
          const dummyWikiDataArray = await Promise.all(
            dummyData.map(async (query) => {
              const wikiResponse = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query._id)}`
              );
              if (!wikiResponse.ok) {
                throw new Error('Location not found.');
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
          <PopupModal
            data={selectedCardData}
            onClose={handleClosePopup}
          />
        )}
      </div>
      {/* Top section */}
      <div className="mx-auto p-4 relative">
        <div className="max-w-6xl mx-auto p-4 mt-10 mb-20 relative">
          <p className="mb-10 mt-10 text-6xl">Plan Your Next Trip</p>
          <p className="mt-10 mb-10 text-3xl">
            Check for weather predictions and activities to better plan your trip
          </p>

          {/* Location and Date inputs */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
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
                  <LocationMarkerIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                </span>
              </div>
              <p className="text-gray-500 text-xs">Please enter a location</p>
            </div>

            <div className="mb-4">
              <label htmlFor="start-date" className="block text-gray-700 text-sm font-bold mb-2">
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
              <p className="text-gray-500 text-xs">Please enter the start date of your trip</p>
            </div>

            <div className="mb-4">
              <label htmlFor="end-date" className="block text-gray-700 text-sm font-bold mb-2">
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
              <p className="text-gray-500 text-xs">Please enter the end date of your trip</p>
            </div>

            <button
              onClick={handleSearch}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center"
            >
              Search
              <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="blurred-bg" />
      </div>

      {/* Display DataCard when dailyWeatherData is available */}
      {dailyWeatherData.length > 0 && (
        <div className="max-w-6xl mx-auto p-4 mb-10">
          {dailyWeatherData.map((data, index) => (
            <DataCard
              key={index}
              date={data.date}
              temperature={data.averageTemperature}
              precipitation={data.averagePrecipitation}
            />
          ))}
        </div>
      )}


      {/* Bottom section */}
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
                thumbnail={info.originalimage?.source ? info.originalimage.source : placeholder}
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
