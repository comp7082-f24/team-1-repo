import { ExternalLinkIcon } from "@heroicons/react/solid";
import { PlusCircleIcon } from "@heroicons/react/outline";

export default function eventCard({ event, onAddEvent }) {
  return (
    <div className="flex flex-col border-2 rounded-md h-[250px] tablet:h-[300px] w-full p-4 border-box">
      <div className="h-[125px] overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-md"
          alt={event.title}
          src={event.image}
        />
      </div>
      <div className="h-[125px] py-2 flex flex-col gap-y-2">
        <a className="flex text-lg font-semibold w-full" href={event.href}>
          {event.title}
          <span className="ml-2">
            <ExternalLinkIcon color="black" />
          </span>
        </a>
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
          <button
            onClick={() => {
              onAddEvent(event);
            }}
          >
            <PlusCircleIcon className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
