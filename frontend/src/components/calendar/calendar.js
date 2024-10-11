import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import {
  WiDaySunny,
  WiDayRain,
  WiCloudy,
  WiDayWindy,
} from "weather-icons-react";

function getMockWeatherData() {
  return ["sunny", "rainy", "cloudy", "windy"]?.[Math.floor(Math.random() * 4)];
}

function sameDay(d1, d2) {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
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
  onDateChanged,
}) {
  const calendarRef = useRef(null);
  // const [currentEvents, setCurrentEvents] = useState(events);
  const [daySelected, setDaySelected] = useState(initialDaySelected);

  const Weather = useRef(weatherMap[getMockWeatherData()] ?? React.Fragment);
  function handleDateSelect(selectInfo) {
    setDaySelected(selectInfo.startStr);
    // let title = prompt("Please enter a new title for your event");
    // let calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect();

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  }

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      onCalendarInitialized(calendarApi);
    }
  }, [onCalendarInitialized]);

  useEffect(() => {
    console.log(daySelected);
  }, [daySelected]);

  return (
    <div>
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
          // } else {
          //   return ["hover:bg-blue-100 cursor-pointer focus:blue-100"];
          // }
          return ["cursor-pointer"];
        }}
        dayCellContent={(arg) => {
          return (
            <div className="flex items-center justify-between gap-4">
              <div>
                {Weather.current && (
                  // eslint-disable-next-line react/jsx-pascal-case
                  <Weather.current size={24} color="#045d8d" />
                )}
              </div>
              <div>{arg.dayNumberText}</div>
            </div>
          );
        }}
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
