// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import { useRef, useEffect, useState } from 'react'

// export default function Calendar({ initialDaySelected = new Date() }, weatherData = mockWeatherData) {
//   const [daySelected, setDaySelected] = useState(initialDaySelected);
//   const calendarRef = useRef();

//   function initializeDayCell(params) {
//     console.log(params);
//     params.el.onclick = () => {
//       setDaySelected(params.date);
//     };
//   }
//   useEffect(() => {

//     if (calendarRef.current) {
//       console.log(calendarRef.current.calendar);
//       // calendarRef?.current;
//     }
//   });

//   return (
//     <FullCalendar
//       ref={calendarRef}
//       plugins={[dayGridPlugin]}
//       initialView="dayGridMonth"
//       dayCellClassNames={(arg) => {
//         if (sameDay(arg.date, daySelected)) {
//           return ['bg-blue-300'];
//         } else {

//           return ['hover:bg-blue-100 cursor-pointer focus:blue-100'];
//         }
//       }}
//       dayCellDidMount={initializeDayCell}
//       // dayCellContent={(arg) => {
//       //   console.log(arg);
//       //   if (sameDay(arg.date, daySelected)) {
//       //     const weather = document.createElement('div');
//       //     // weather.innerHTML = weatherData[`${}`]
//       //     // return { domNodes: []}
//       //   }
//       // }}
//     />
//   )
// }

import React, { useState } from "react";
import { formatDate } from "@fullcalendar/core";
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

export default function DemoApp({ initialDaySelected = new Date() }) {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [daySelected, setDaySelected] = useState(initialDaySelected);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

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

  return (
    // <Sidebar
    //   weekendsVisible={weekendsVisible}
    //   handleWeekendsToggle={handleWeekendsToggle}
    //   currentEvents={currentEvents}
    // />
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridYear",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={weekendsVisible}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        // select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
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
            <div class="w-full grid grid-cols-12 px-1">
              <div class="col-span-2">
                {Weather && <Weather size={24} color="#045d8d" />}
              </div>
              <div class="col-span-10 fc-daygrid-day-top">
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
