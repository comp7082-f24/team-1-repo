import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";

const mockEvents = [];

function ActivitiesPlanner() {
  const [calendarApi, setCalendarApi] = useState(null);
  function handleCalendarInitialization(api) {
    setCalendarApi(api);
  }

  useEffect(() => {
    console.log(calendarApi);
  }, [calendarApi]);

  return (
    <div class="w-[90%] mx-auto p-4 border-2 rounded-md grid grid-cols-12 gap-4">
      <div class="flex justify-center col-span-4 border-2 rounded-md p-2">
        <h2 class="font-semibold mx-auto">Activities Available</h2>
      </div>
      <div class="col-span-8">
        <Calendar onCalendarInitialized={handleCalendarInitialization} />
      </div>
    </div>
  );
}

export default ActivitiesPlanner;
