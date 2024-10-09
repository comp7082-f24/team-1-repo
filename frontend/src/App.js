import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import placeholder from './images/placeholder.png'
import { SearchIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />  
      {/** top section */}
      <div className="mx-auto p-4 relative z-10">
        <div className="max-w-6xl mx-auto p-4 mt-10 mb-20 relative z-10">
          <p className="mb-10 mt-10 text-6xl">Plan Your Next Trip</p>
          <p className="mt-10 mb-10 text-3xl">Check for weather predictions and activities to better plan your trip</p>

          {/** location date */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input type="text" id="location" placeholder="Location" className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" aria-describedby="location-icon" />
                <span className="p-1" id="location-icon">
                  <LocationMarkerIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                </span>
              </div>
              <p className="text-gray-500 text-xs">Please enter a location</p>
            </div>

            <div className="mb-4">
              <label htmlFor="start-date" className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="date"
                  id="start-date"
                  className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="start-date-icon"
                />
              </div>
              <p className="text-gray-500 text-xs">Please enter the start date of your trip</p>
            </div>

            <div className="mb-4">
              <label htmlFor="end-date" className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="date"
                  id="end-date"
                  className="flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="end-date-icon"
                />
              </div>
              <p className="text-gray-500 text-xs">Please enter the end date of your trip</p>
            </div>

            <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
              Search
              <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
            </button>
            
          </div>
        </div>
        <div className="blurred-bg"/>
      </div>

      {/* Bottom section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto p-4 mb-10">
          <h2 className="mb-4 mt-20 text-6xl">Most Popular Queries</h2>
          <p className="mb-10 text-gray-500">Quality as judged by customers</p>

          <div className="grid grid-cols-2 gap-4">

            {/** placeholder, find a better way to display items. for now just hardcoding 4 */}
            <div class="flex flex-col bg-white rounded-lg shadow-md">
              <div class="relative h-48">
                <img src={placeholder} alt="Activity Image" class="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"></img>
              </div>
              <div class="p-4 flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-bold">Destination</h2>
                  <p class="text-gray-500">Information</p>
                  <p class="text-gray-500">...</p>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-1">★★★★★</span>
                    <span class="text-gray-500">5.0</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                    Search
                    <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white rounded-lg shadow-md">
              <div class="relative h-48">
                <img src={placeholder} alt="Activity Image" class="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"></img>
              </div>
              <div class="p-4 flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-bold">Destination</h2>
                  <p class="text-gray-500">Information</p>
                  <p class="text-gray-500">...</p>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-1">★★★★★</span>
                    <span class="text-gray-500">5.0</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                    Search
                    <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white rounded-lg shadow-md">
              <div class="relative h-48">
                <img src={placeholder} alt="Activity Image" class="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"></img>
              </div>
              <div class="p-4 flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-bold">Destination</h2>
                  <p class="text-gray-500">Information</p>
                  <p class="text-gray-500">...</p>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-1">★★★★★</span>
                    <span class="text-gray-500">5.0</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                    Search
                    <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white rounded-lg shadow-md">
              <div class="relative h-48">
                <img src={placeholder} alt="Activity Image" class="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"></img>
              </div>
              <div class="p-4 flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-bold">Destination</h2>
                  <p class="text-gray-500">Information</p>
                  <p class="text-gray-500">...</p>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-1">★★★★★</span>
                    <span class="text-gray-500">5.0</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                    Search
                    <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

