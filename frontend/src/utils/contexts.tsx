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

interface IPlaceData {
  id: string | number;
  lat: number;
  lon: number;
  name: string;
  opening_hours: string;
  website: string;
  country: string;
  contact: { phone?: string };
  facilities: { wheelchair?: boolean; toilets?: boolean };
}

interface ITripPlanData {
  [date: string]: IPlaceData[];
}

const WeatherContext = createContext<any>(null);
const LocationContext = createContext<any>(null);
const TripPlanContext = createContext<any>(null);

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

export function useTripPlanData() {
  const [tripPlanContext, setTripPlanContext] = useContext(TripPlanContext);

  function setTripPlan(updateTp: (oldTp: ITripPlanData) => ITripPlanData) {
    setTripPlanContext((oldTp: ITripPlanData) => {
      const newTp = updateTp(oldTp);
      sessionStorage.setItem("trip-plan", JSON.stringify(newTp));

      return newTp;
    });
  }

  function getTripPlan() {
    if (Object.keys(tripPlanContext ?? {}).length) return tripPlanContext;
    const weatherString = sessionStorage.getItem("trip-plan");
    if (weatherString) {
      setTripPlanContext(JSON.parse(weatherString));
      return JSON.parse(weatherString) ?? [];
    }
  }

  return [getTripPlan(), setTripPlan];
}

export function AppContextProvider(props: any) {
  const [weatherContext, setWeatherContext] = useState({});
  const [locationContext, setLocationContext] = useState({});
  const [tripPlanContext, setTripPlanContext] = useState({});

  return (
    <LocationContext.Provider value={[locationContext, setLocationContext]}>
      <WeatherContext.Provider value={[weatherContext, setWeatherContext]}>
        <TripPlanContext.Provider value={[tripPlanContext, setTripPlanContext]}>
          {props.children}
        </TripPlanContext.Provider>
      </WeatherContext.Provider>
    </LocationContext.Provider>
  );
}
