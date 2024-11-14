import { useCallback, useState, useEffect } from "react";
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

const GEOAPIFY_API_KEY = "1bff187db2c849e1a26c02a3c16c8462";

function ActivitiesPlanner() {
  const [tripPlan, setTripPlan] = useTripPlanData();
  const [availableActivities, _setAvailableActivities] = useState([]);
  const [locationData] = useLocationData();
  const [weatherData] = useWeather();
  const [calendarApi, setCalendarApi] = useState(null);
  const [dateSelected, setDateSelected] = useState(
    weatherData["start"] ?? new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState(null);
  const [, setTabSelected] = useState(0);
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
    Object.keys(tripPlan ?? {}).forEach((d) => {
      tripPlan[d]?.forEach((e) => api?.addEvent({ ...e, title: e.name }));
    });

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
    setTripPlan((plan) => ({
      ...plan,
      [dateSelected]: [...(plan?.[dateSelected] ?? []), newEvent],
    }));
  }

  function handleRemoveEvent(event) {
    const eventStart = event?.start?.split("T")[0];
    const ce = calendarApi.getEventById(event.id);
    setAvailableActivities((ae) => [...ae, event]);
    setTripPlan((tp) => ({
      ...tp,
      [eventStart]: tp?.[eventStart]?.filter((ev) => ev.id !== event.id) ?? [],
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

  return (
    <div>
      <div className="w-[95%] m-4 mx-auto p-4 grid grid-cols-12 gap-4">
        <WikiIntro />
      </div>
      <div class="w-[95%] m-4 mx-auto p-4 border-2 rounded-md grid grid-cols-12 gap-4 h-[1200px]">
        <div class="flex flex-col h-[1100px] box-border align-center col-span-4 border-2 p-2 rounded-md overflow-hidden">
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
                      <ul class="flex flex-col h-[900px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
                        {error && <div>{error}</div>}
                        {!availableActivities.length &&
                          !error &&
                          new Array(10).fill(null).map((item) => (
                            <div class="border border-[#ccc] shadow rounded-md p-4 m-4 mr-6 h-[300px]">
                              <div class="animate-pulse flex space-x-4">
                                <div class="flex-1 space-y-6 py-4">
                                  <div class="h-4 bg-slate-700 rounded"></div>
                                  <div class="h-2 bg-slate-700 rounded"></div>
                                  <div class="h-2 bg-slate-700 rounded"></div>
                                  <div class="space-y-4">
                                    <div class="grid grid-cols-12 gap-4">
                                      <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                                      <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                                    </div>
                                    <div class="grid grid-cols-12 gap-4">
                                      <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                                      <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                                    </div>
                                    <div class="grid grid-cols-12 gap-4">
                                      <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                                      <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                                    </div>
                                  </div>
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
                      <ul class="flex flex-col h-[1100px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
                        {tripPlan?.[dateSelected]?.map((event) => (
                          <li key={event.id}>
                            <EventCard
                              event={event}
                              onRemoveEvent={handleRemoveEvent}
                              isAdded={true}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>
        <div class="col-span-8">
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
