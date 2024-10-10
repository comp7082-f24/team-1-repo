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

export default function Calendar({
  initialDaySelected = new Date(),
  events = [],
  onCalendarInitialized,
}) {
  const calendarRef = useRef(null);
  const [currentEvents, setCurrentEvents] = useState(events);
  const [daySelected, setDaySelected] = useState(initialDaySelected);

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    if (
      prompt(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      onCalendarInitialized(calendarApi);
    }
  }, [onCalendarInitialized]);

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
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
        dayMaxEvents={true}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        // select={handleDateSelect}
        eventContent={renderEventContent}
        // eventClick={handleEventClick}
        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        dayCellClassNames={(arg) => {
          // if (sameDay(arg.date, daySelected)) {
          //   return ["bg-blue-500"];
          // } else {
          //   return ["hover:bg-blue-100 cursor-pointer focus:blue-100"];
          // }
          return ["cursor-pointer"];
        }}
        dayCellContent={(arg) => {
          // const curDate = arg.date.toDateString();
          const weatherMap = {
            sunny: WiDaySunny,
            rainy: WiDayRain,
            cloudy: WiCloudy,
            windy: WiDayWindy,
          };
          const Weather = weatherMap[getMockWeatherData()] ?? React.Fragment;
          return (
            <div class="w-full grid grid-cols-12 tablet:px-1">
              <div class="col-span-1 tablet:col-span-2">
                {Weather && <Weather size={24} color="#045d8d" />}
              </div>
              <div class="col-span-11 tablet:col-span-10 fc-daygrid-day-top">
                {arg.dayNumberText}
              </div>
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
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
