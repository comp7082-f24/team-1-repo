import React, { createContext, useContext, useState } from "react";

interface IWeatherData {
  [date: string]: {
    averageTemperature?: number;
    weatherCode?: number;
    averagePrecipitation?: number;
  };
}

interface ILocationData {
  location?: string;
  latitude?: number;
  longitude?: number;
}
// {
//   latitude: 52.52,
//   longitude: 13.419998,
//   generationtime_ms: 0.051021575927734375,
//   utc_offset_seconds: 7200,
//   timezone: "Europe/Berlin",
//   timezone_abbreviation: "CEST",
//   elevation: 46.0,
//   daily_units: { time: "iso8601", weather_code: "wmo code" },
//   daily: {
//     time: [
//       "2024-10-18",
//       "2024-10-19",
//       "2024-10-20",
//       "2024-10-21",
//       "2024-10-22",
//       "2024-10-23",
//       "2024-10-24",
//     ],
//     weather_code: [3, 3, 3, 3, 61, 3, 45],
//   },
// }

const WeatherContext = createContext<any>(null);
const LocationContext = createContext<any>(null);

export function useWeather() {
  const [weatherContext, setWeatherContext] = useContext(WeatherContext);

  function setWeatherData(data: IWeatherData) {
    setWeatherContext(data);
    localStorage.setItem("weather", JSON.stringify(data));
  }

  function getWeatherData() {
    if (Object.keys(weatherContext ?? {}).length) return weatherContext;
    const weatherString = localStorage.getItem("weather");
    if (weatherString) {
      setWeatherContext(JSON.parse(weatherString));
      return JSON.parse(weatherString) ?? [];
    }
  }

  return [getWeatherData(), setWeatherData];
}

export function useLocationData() {
  const [locationContext, setLocationContext] = useContext(LocationContext);

  function setLocationData(data: ILocationData) {
    localStorage.setItem("location", JSON.stringify(data));
    setLocationContext(data);
  }

  function getLocationData() {
    if (Object.keys(locationContext ?? {}).length) return locationContext;
    const weatherString = localStorage.getItem("location");
    if (weatherString) {
      setLocationContext(JSON.parse(weatherString));
      return JSON.parse(weatherString) ?? [];
    }
  }

  return [getLocationData(), setLocationData];
}

export function AppContextProvider(props: any) {
  const [weatherContext, setWeatherContext] = useState({});
  const [locationContext, setLocationContext] = useState({});

  return (
    <LocationContext.Provider value={[locationContext, setLocationContext]}>
      <WeatherContext.Provider value={[weatherContext, setWeatherContext]}>
        {props.children}
      </WeatherContext.Provider>
    </LocationContext.Provider>
  );
}
