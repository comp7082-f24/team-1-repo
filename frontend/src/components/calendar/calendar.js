import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  WiDaySunny,
  WiDayRain,
  WiCloudy,
  WiDayWindy,
} from "weather-icons-react";

function getMockWeatherComponent(w) {
  return weatherMap[w] ?? React.Fragment;
}

const weatherMap = {
  sunny: WiDaySunny,
  rainy: WiDayRain,
  cloudy: WiCloudy,
  windy: WiDayWindy,
};

export default function Calendar({
  initialDaySelected = new Date(),
  initialEvents = [],
  onCalendarInitialized,
  // onDateChanged,
  // onEventAdded,
  // onEventRemoved,
  onDateSelected,
  weatherData,
}) {
  const calendarRef = useRef(null);
  // const [currentEvents, setCurrentEvents] = useState(events);
  const [daySelected, setDaySelected] = useState(initialDaySelected);
  function handleDateSelect(selectInfo) {
    setDaySelected(selectInfo.startStr);
    if (onDateSelected) onDateSelected(selectInfo);
  }

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      onCalendarInitialized(calendarApi);
    }
  }, [onCalendarInitialized]);

  return (
    <div className="mb-4">
      <FullCalendar
        ref={calendarRef}
        height="600px"
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridYear",
        }}
        initialView="dayGridMonth"
        monthStartFormat={{ month: "short", day: "numeric" }}
        // editable={true}
        // customButtons={{

        // }}
        selectable={true}
        unselectAuto={false}
        dayMaxEvents={true}
        initialDate={daySelected}
        eventDataTransform={(event) => {
          return event;
        }}
        initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent}
        // eventClick={handleEventClick}
        moreLinkClick={true}
        // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        dayCellClassNames={(arg) => {
          if (arg.date === daySelected) {
            return ["bg-blue-500 cursor-pointer"];
          }
          return ["cursor-pointer"];
        }}
        dayCellContent={(arg) => {
          const dateStr = arg.date.toJSON().split("T")?.[0];
          return (
            <div className="flex items-center justify-between gap-4">
              <div>
                {(() => {
                  const Weather = getMockWeatherComponent(weatherData[dateStr]);
                  return <Weather size={24} color="#045d8d" />;
                })()}
              </div>
              <div>{arg.dayNumberText}</div>
            </div>
          );
        }}
        // eventAdd={onEventAdded}
        // eventRemove={onEventRemoved}
        /* you can update a remote database when these fire:
      eventAdd={function(){}}
      eventChange={function(){}}
      eventRemove={function(){}}
      */
      />
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <span className="overflow-hidden text-ellipsis">
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </span>
  );
}
