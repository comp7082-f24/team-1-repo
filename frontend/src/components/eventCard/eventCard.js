export default function eventCard({
  event,
  onAddEvent,
  isAdded,
  onRemoveEvent,
}) {
  return (
    <div className="flex flex-col border-2 rounded-md h-[250px] tablet:h-[300px] w-full p-4 border-box">
      <div className="h-[125px] overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-md"
          alt={event.title}
          src={event.image}
        />
      </div>
      <div className="h-[125px] py-2 flex flex-col gap-y-4">
        <div className="flex">
          <a className="flex text-lg font-semibold inline" href={event.href}>
            {event.title}
            <span className="ml-2 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </span>
          </a>
        </div>
        <div className="flex justify-between">
          <div>
            {event?.labels?.map((label, index) => (
              <span key={`${event.id}-${index}`}>
                {index > 0 ? " • " : ""}
                {label}
              </span>
            ))}
          </div>
          <div>{new Date(event.start).toDateString()}</div>
        </div>
        <div className="flex justify-between">
          <div>Seats left: {event.seats}</div>
          {isAdded ? (
            <button onClick={() => onRemoveEvent(event)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          ) : (
            <button onClick={() => onAddEvent(event)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
