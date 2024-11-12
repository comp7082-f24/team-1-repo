export default function eventCard({
  event,
  onAddEvent,
  isAdded,
  onRemoveEvent,
}) {
  return (
    <div className="flex flex-col border-2 rounded-md h-[250px] tablet:h-[300px] w-full p-4 border-box">
      <div className="h-[125px] py-2 flex flex-col gap-y-4">
        <div className="flex">
          <h2 className="flex text-lg font-semibold">
            {event.name || "No Name Available"}
            {event?.website && (
              <a className="flex inline" href={event.website}>
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
            )}
          </h2>
        </div>
        {event.opening_hours && (
          <p style={{ marginBottom: "10px", overflowWrap: "break-word" }}>
            {event.opening_hours}
          </p>
        )}
        <p style={{ marginBottom: "5px" }}>
          <strong>Address:</strong> {event.formatted || "No address available"}
        </p>
        <p>
          <strong>City:</strong> {event.county || "No city available"}
        </p>
        <div className="mt-2 w-1/2 ml-auto">
          {isAdded ? (
            <button
              className="flex items-center border border-black rounded-md p-2 hover:bg-gray-300"
              onClick={() => onRemoveEvent(event)}
            >
              <span className="mr-2">Remove Event</span>
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
            <button
              className="flex items-center border border-black rounded-md p-2"
              onClick={() => onAddEvent(event)}
            >
              <span className="mr-2">Add Event</span>
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
