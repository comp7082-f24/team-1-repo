import { useCallback, useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import { createEventId } from "../components/calendar/event-utils";
import EventCard from "../components/eventCard/eventCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/shadcn/tabs";

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
  const [tabSelected, setTabSelected] = useState("activities-available");

  const handleCalendarInitialization = useCallback((api) => {
    api?.select(startDate);
    setCalendarApi(api);
    console.log(api?.currentData);
  }, []);

  function handleAddEvent(event) {
    calendarApi.addEvent(event);
  }

  function handleValueChange(value) {
    setTabSelected(value);
  }

  function handleDateChanged(value) {}

  return (
    <div class="w-[95%] m-4 mx-auto p-4 border-2 rounded-md grid grid-cols-12 gap-4 h-[1000px]">
      <div class="flex flex-col h-[950px] box-border align-center col-span-4 border-2 p-2 rounded-md overflow-hidden">
        <Tabs
          defaultValue="activities-available"
          className="w-full"
          onValueChange={handleValueChange}
        >
          <TabsList className="w-full flex p-2 bg-slate-100 rounded-md">
            <TabsTrigger
              className="w-1/2 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow"
              value="activities-available"
            >
              Activities Available
            </TabsTrigger>
            <TabsTrigger
              className="w-1/2 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow"
              value="activities-selected"
            >
              Activities Added
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4" value="activities-available">
            <ul class="flex flex-col h-[900px] space-y-4 overflow-y-scroll pl-2 pr-4 pb-[100px] box-border">
              {mockEvents.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} onAddEvent={handleAddEvent} />
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent className="mt-4" value="activities-selected">
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
          </TabsContent>
        </Tabs>
      </div>
      <div class="col-span-8">
        <Calendar
          initialEvents={mockReservedEvents}
          initialDaySelected={startDate}
          onCalendarInitialized={handleCalendarInitialization}
          onDateChanged={handleDateChanged}
        />
      </div>
    </div>
  );
}

export default ActivitiesPlanner;
