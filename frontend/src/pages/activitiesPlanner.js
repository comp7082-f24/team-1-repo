import { useCallback, useState } from "react";
import Calendar from "../components/calendar/calendar";
import EventCard from "../components/eventCard/eventCard";
import Tabs from "../components/Tabs/tabs";

let eventGuid = 0;

function createEventId() {
  return String(eventGuid++);
}

const mockWeatherData = new Array(30)
  .fill(null)
  .map(
    () => ["sunny", "rainy", "cloudy", "windy"]?.[Math.floor(Math.random() * 4)]
  )
  .reduce(
    (acc, item, i) => ({
      ...acc,
      [`2024-10-${`${1 + i}`.padStart(2, "0")}`]: item,
    }),
    {}
  );

const mockEvents = new Array(30)
  .fill(null)
  .map((_, i) => ({
    id: createEventId(),
    title: "Test",
    start: `2024-10-${i % 3 ? i : 1 + i}T00:00:00.000-07:00`,
    seats: Math.floor(Math.random() * 4),
    end: `2024-10-${i % 3 ? i : i + 2}T00:00:00.000-07:00`,
    allDay: true,
    duration: 2.5,
    labels: ["Skip the line", "Small group"],
    href: "https://www.tripadvisor.ca/Attraction_Review-g294074-d2536796-Reviews-Plaza_de_Mercado_Paloquemao-Bogota.html",
    image:
      "https://www.thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg",
  }))
  .reduce(
    (acc, item, i) => ({
      ...acc,
      [item.start.split("T")[0]]: [
        ...(acc?.[item.start.split("T")[0]] ?? []),
        item,
      ],
    }),
    {}
  );

function ActivitiesPlanner({
  startDate = "2024-10-09T00:00:00-07:00",
  events = {
    "2024-10-09T00:00:00-07:00": [],
  },
}) {
  const [calendarApi, setCalendarApi] = useState(null);
  const [tripPlan, setTripPlan] = useState({});
  const [availableEvents, setAvailableEvents] = useState(mockEvents);
  const [dateSelected, setDateSelected] = useState(startDate);
  const [_, setTabSelected] = useState(0);

  const handleCalendarInitialization = useCallback((api) => {
    api?.select(startDate);
    setCalendarApi(api);
  }, []);

  function handleDateSelected(selectInfo) {
    setDateSelected(selectInfo.startStr);
  }

  function handleAddEvent(event) {
    calendarApi.addEvent(event);
    const eventStart = event?.start?.split("T")[0];

    setAvailableEvents((ae) => ({
      ...ae,
      [eventStart]: ae?.[eventStart]?.filter((ev) => ev.id !== event.id),
    }));
    setTripPlan((plan) => ({
      ...plan,
      [eventStart]: [...(plan?.[eventStart] ?? []), event],
    }));
  }

  function handleRemoveEvent(event) {
    const eventStart = event?.start?.split("T")[0];
    const ce = calendarApi.getEventById(event.id);

    setAvailableEvents((ae) => ({
      ...ae,
      [eventStart]: [
        ...(ae?.[eventStart]?.filter((ev) => ev.id !== event.id) ?? []),
        event,
      ],
    }));
    setTripPlan((tp) => ({
      ...tp,
      [eventStart]: tp?.[eventStart]?.filter((ev) => ev.id !== event.id) ?? [],
    }));
    ce?.remove();
  }

  function handleTabChange(value) {
    setTabSelected(value);
  }

  return (
    <div class="w-[95%] m-4 mx-auto p-4 border-2 rounded-md grid grid-cols-12 gap-4 h-[1000px]">
      <div class="flex flex-col h-[950px] box-border align-center col-span-4 border-2 p-2 rounded-md overflow-hidden">
        <Tabs
          onTabChange={handleTabChange}
          defaultActiveId={"activities-available"}
          data={[
            {
              id: "activities-available",
              name: "Activities Available",
              content: (
                <ul class="flex flex-col h-[900px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
                  {availableEvents?.[dateSelected]?.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} onAddEvent={handleAddEvent} />
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "activities-added",
              name: "Activities Added",
              content: (
                <ul class="flex flex-col h-[900px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
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
              ),
            },
          ]}
        />
      </div>
      <div class="col-span-8">
        <Calendar
          // initialEvents={mockReservedEvents}
          initialDaySelected={dateSelected}
          onCalendarInitialized={handleCalendarInitialization}
          // onEventAdded={handleEventAdded}
          // onEventRemoved={handleEventRemoved}
          onDateSelected={handleDateSelected}
          weatherData={mockWeatherData}
        />
      </div>
    </div>
  );
}

export default ActivitiesPlanner;
