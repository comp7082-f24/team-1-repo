import React, { useCallback, useState, useEffect } from "react";
import Calendar from "../components/calendar/calendar";
import EventCard from "../components/eventCard/eventCard";
import Tabs from "../components/Tabs/tabs";
import MapComponent from "../components/MapComponent";
import {
  useLocationData,
  useWeather,
  useTripPlanData,
} from "../utils/contexts";
import WikiIntro from "../components/WikiIntro";
import axios from "axios";
import { WMO_CODE_MAP } from "../utils/weatherCode";

const GEOAPIFY_API_KEY = "1bff187db2c849e1a26c02a3c16c8462";

function ActivitiesPlanner() {
  const [tripPlan, setTripPlan] = useTripPlanData();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableActivities, _setAvailableActivities] = useState([]);
  const [locationData] = useLocationData();
  const [weatherData] = useWeather();
  const [calendarApi, setCalendarApi] = useState(null);
  const [dateSelected, setDateSelected] = useState(
    tripPlan["start"] ?? new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState(null);
  const [, setTabSelected] = useState(0);
  const [saveButtonText, setSaveButtonText] = useState("Save Trip");

  const setAvailableActivities = useCallback(
    (modifier) =>
      _setAvailableActivities((ae) =>
        modifier(ae).sort((a, b) =>
          a.place_id < b.place_id ? -1 : a.place_id > b.place_id ? 1 : 0
        )
      ),
    [_setAvailableActivities]
  );

  const handleCalendarInitialization = useCallback((api) => {
    api?.select(dateSelected);
    for (const [, events] of Object.entries(tripPlan.plan ?? {})) {
      events?.forEach((e) => api?.addEvent({ ...e, title: e.name }));
    }
    setCalendarApi(api);
  }, []);

  function handleDateSelected(selectInfo) {
    setDateSelected(selectInfo.startStr);
  }

  function handleAddEvent(event) {
    const newEvent = {
      ...event,
      id: `${dateSelected}-${event.place_id}`,
      start: dateSelected,
    };
    calendarApi.addEvent({
      ...newEvent,
      title: event.name,
    });

    setAvailableActivities((ae) =>
      ae?.filter((ev) => ev.place_id !== event.place_id)
    );
    setTripPlan((oldTp) => ({
      ...oldTp,
      plan: {
        ...(oldTp?.plan ?? {}),
        [dateSelected]: [...(oldTp?.plan?.[dateSelected] ?? []), newEvent],
      },
    }));
  }

  function handleRemoveEvent(event) {
    const eventStart = event?.start?.split("T")[0];
    const ce = calendarApi.getEventById(event.id);
    setAvailableActivities((ae) => [...ae, event]);
    setTripPlan((tp) => ({
      ...tp,
      plan: {
        ...(tp.plan ?? {}),
        [eventStart]:
          tp?.plan?.[eventStart]?.filter((ev) => ev.id !== event.id) ?? [],
      },
    }));
    ce?.remove();
  }

  function handleTabChange(value) {
    setTabSelected(value);
  }

  useEffect(() => {
    document.title = "Activities Planner";
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=entertainment,tourism&limit=10&apiKey=${GEOAPIFY_API_KEY}&filter=circle:${locationData.longitude},${locationData.latitude},10000`
        );
        if (!response.ok) {
          throw new Error("Error fetching activities");
        }
        const data = await response.json();
        setAvailableActivities(() => data.features.map((f) => f.properties));
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message);
      }
    };

    if (locationData.latitude && locationData.longitude) {
      fetchActivities();
    }
  }, [locationData.latitude, locationData.longitude]);

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

  const saveTrip = async (events) => {
    if (!events.length) {
      alert("No events to save for the selected date.");
      return;
    }

    try {
      const payload = events.map((event) => {
        const dateStr = dateSelected;
        const weatherCode = weatherData?.[dateStr]?.weatherCode;
        const weatherDescription =
          weatherCode !== undefined
            ? WMO_CODE_MAP[weatherCode]?.day?.description ?? "Unknown"
            : "Unknown";
        return {
          title: event.name,
          date: dateSelected,
          description: event.description ?? "No description available",
          location: { address: event.formatted, city: event.city },
          weather: {
            temperature: weatherData?.[dateStr]?.temperature ?? "Unknown",
            condition: weatherDescription,
            name: weatherDescription,
          },
        };
      });

      const response = await axios.post("/saveevent", {
        userId: user.id,
        events: payload,
      });

      if (response.status === 200) {
        setSaveButtonText("Saved");
        setTimeout(() => {
          setSaveButtonText("Save Trip");
        }, 5000);
        alert("Trip saved successfully!");
      }
      alert("Trip saved successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Error saving trip. Please try again.");
    }
  };

  return (
    <div>
      <div className="w-[95%] m-4 mx-auto p-4">
        <WikiIntro />
      </div>
      <div className="w-[95%] m-4 mx-auto p-4 border-2 rounded-md grid grid-cols-1 md:grid-cols-12 gap-4 h-[1200px] mb-[1100px] md:mb-4">

        <div className="flex flex-col h-[1100px] col-span-1 md:col-span-4 border-2 p-2 rounded-md overflow-hidden">
          <Tabs
            onTabChange={handleTabChange}
            defaultActiveId={"activities-available"}
            data={[
              {
                id: "activities-available",
                name: "Activities Available",
                content: (
                  <>
                    {locationData?.latitude && locationData?.longitude ? (
                      <ul className="flex flex-col h-[1050px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
                        {error && <div>{error}</div>}
                        {!availableActivities.length &&
                          !error &&
                          new Array(10).fill(null).map((item, index) => (
                            <div
                              key={index}
                              className="border border-[#ccc] shadow rounded-md p-4 m-4 mr-6 h-[300px]"
                            >
                              <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-6 py-4">
                                  <div className="h-4 bg-slate-700 rounded"></div>
                                  <div className="h-2 bg-slate-700 rounded"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        {availableActivities?.map((event) => (
                          <li key={event.id}>
                            <EventCard
                              event={event}
                              onAddEvent={handleAddEvent}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex justify-center p-4 m-4">
                        Please enter a location to search for activities.
                      </div>
                    )}
                  </>
                ),
              },
              {
                id: "activities-added",
                name: "Activities Added",
                content: (
                  <>
                    {tripPlan && (
                      <div className="relative h-full">
                        <ul className="flex flex-col h-[1050px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
                          {tripPlan?.plan?.[dateSelected]?.map((event) => (
                            <li key={event.id}>
                              <EventCard
                                event={event}
                                onRemoveEvent={handleRemoveEvent}
                                isAdded={true}
                              />
                            </li>
                          ))}
                        </ul>
                        <button
                          className="bottom-10 right-4 bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 mb-8 sm:mb-4"
                          onClick={() => saveTrip(tripPlan.plan[dateSelected] ?? [])}
                          style={{ position: "absolute" }}
                        >
                          {saveButtonText}
                        </button>

                      </div>
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="col-span-1 md:col-span-8">
          <Calendar
            initialDaySelected={dateSelected}
            onCalendarInitialized={handleCalendarInitialization}
            onDateSelected={handleDateSelected}
            weatherData={weatherData}
          />
          <MapComponent location={locationData?.location} />
        </div>
      </div>
    </div>
  );
}

export default ActivitiesPlanner;
