import React, { useState } from 'react';
import placeholder from '../images/placeholder.png';
import { SearchIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import '../App.css';
import DataCard from '../components/DataCard';

function LandingPage() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyWeatherData, setDailyWeatherData] = useState([]);

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
  
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    const years_of_data = 5; // We'll gather data for the last 5 years
  
    let URL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;
    
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        let longitude = data.results[0].longitude;
        let latitude = data.results[0].latitude;
  
        const fetchWeatherData = async () => {
          const collectedData = {};
          const startDay = startDate.split('-')[2];
          const endDay = endDate.split('-')[2];
          const startMonth = startDate.split('-')[1];
          const endMonth = endDate.split('-')[1];
  
          for (let i = 0; i < years_of_data; i++) {
            const start = `${startMonth}-${startDay}`;
            const end = `${endMonth}-${endDay}`;
            
            const URL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startYear - i}-${start}&end_date=${endYear - i}-${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum`;
  
            try {
              const response = await fetch(URL);
              const data = await response.json();
  
              // Loop over each day's weather and group by date
              data.daily.time.forEach((date, index) => {
                if (!collectedData[date]) {
                  collectedData[date] = {
                    totalTemp: 0,
                    totalPrecipitation: 0,
                    count: 0
                  };
                }
  
                collectedData[date].totalTemp += data.daily.temperature_2m_mean[index];
                collectedData[date].totalPrecipitation += data.daily.precipitation_sum[index];
                collectedData[date].count += 1;
              });
  
            } catch (error) {
              console.error(`Error fetching weather data for year ${startYear - i}:`, error);
            }
          }
  
          // Compute the average temperature and precipitation for the selected range
          const averagedData = Object.keys(collectedData).map((date) => ({
            date,
            averageTemperature: collectedData[date].totalTemp / collectedData[date].count,
            averagePrecipitation: collectedData[date].totalPrecipitation / collectedData[date].count,
          }));
  
          setDailyWeatherData(averagedData.filter(data => {
            const day = data.date.split('-')[2];
            return day >= startDay && day <= endDay;
          }));
        };
  
        fetchWeatherData();
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
      });
  };
  

  return (
    <div>
      {/* Top section */}
      <div className="mx-auto p-4 relative z-10">
        <div className="max-w-6xl mx-auto p-4 mt-10 mb-20 relative z-10">
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

          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col bg-white rounded-lg shadow-md">
                <div className="relative h-48">
                  <img
                    src={placeholder}
                    alt="Activity Image"
                    className="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Destination</h2>
                    <p className="text-gray-500">Information</p>
                    <p className="text-gray-500">...</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★★★★★</span>
                      <span className="text-gray-500">5.0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                      Search
                      <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
