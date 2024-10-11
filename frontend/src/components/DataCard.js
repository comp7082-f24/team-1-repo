// src/components/DataCard.js
import React from 'react';

function DataCard({ date, temperature, precipitation }) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Weather for {date}</h2>
      <p className="text-gray-700 mb-2">Temperature: {temperature.toFixed(2)}°C</p>
      <p className="text-gray-700 mb-2">Precipitation: {precipitation.toFixed(2)} mm</p>
      <p className="text-gray-500 text-xs">Data based on weather history over the past 5 years.</p>
    </div>
  );
}

export default DataCard;
