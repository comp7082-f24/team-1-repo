import { useCallback, useState } from "react";
import Calendar from "../components/calendar/calendar";
import EventCard from "../components/eventCard/eventCard";
import Tabs from "../components/Tabs/tabs";

let eventGuid = 0;

function createEventId() {
  return String(eventGuid++);
}

const mockReservedEvents = new Array(5).fill(null).map((_, i) => ({
  id: createEventId(),
  title: "Test",
  start: `2024-10-1${i}T00:00:00.000-07:00`,
  seats: Math.floor(Math.random() * 4),
  end: `2024-10-1${i + 1}T00:00:00.000-07:00`,
  allDay: true,
  duration: 2.5,
  labels: ["Skip the line", "Small group"],
  href: "https://www.tripadvisor.ca/Attraction_Review-g294074-d2536796-Reviews-Plaza_de_Mercado_Paloquemao-Bogota.html",
  image:
    "https://www.thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg",
}));
const mockEvents = new Array(10).fill(null).map((_, i) => ({
  id: createEventId(),
  title: "Test",
  start: `2024-10-1${i}T00:00:00.000-07:00`,
  seats: Math.floor(Math.random() * 4),
  end: `2024-10-1${i + 1}T00:00:00.000-07:00`,
  allDay: true,
  duration: 2.5,
  labels: ["Skip the line", "Small group"],
  href: "https://www.tripadvisor.ca/Attraction_Review-g294074-d2536796-Reviews-Plaza_de_Mercado_Paloquemao-Bogota.html",
  image:
    "https://www.thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg",
}));

function ActivitiesPlanner({
  startDate = "2024-10-09T00:00:00-07:00",
  events = {
    "2024-10-09T00:00:00-07:00": [],
  },
}) {
  const [calendarApi, setCalendarApi] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);

  const handleCalendarInitialization = useCallback((api) => {
    api?.select(startDate);
    setCalendarApi(api);
    console.log(api?.currentData);
  }, []);

  function handleAddEvent(event) {
    calendarApi.addEvent(event);
  }

  function handleTabChange(value) {
    console.log(value);
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
                  {mockEvents.map((event) => (
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
                  {console.log(calendarApi?.currentData?.currenDate)}
                  {console.log(
                    calendarApi
                      ?.getEvents()
                      ?.filter(
                        (event) =>
                          event?._instance.start ===
                          calendarApi?.currentData?.currenDate
                      )
                  )}
                  {calendarApi
                    ?.getEvents()
                    ?.filter(
                      (event) =>
                        event?._instance.start ===
                        calendarApi?.currentData?.currenDate
                    )
                    ?.map((event) => (
                      <li key={event.id}>
                        <EventCard event={event} onAddEvent={handleAddEvent} />
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
          initialEvents={mockReservedEvents}
          initialDaySelected={startDate}
          onCalendarInitialized={handleCalendarInitialization}
        />
      </div>
    </div>
  );
}

export default ActivitiesPlanner;
