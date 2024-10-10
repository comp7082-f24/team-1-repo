import Calendar from "../components/calendar/calendar";

function ActivitiesPlanner() {

    return <div class="w-[90%] mx-auto p-8 border-2 rounded-md grid grid-cols-12 gap-4">
        <div class="col-span-4"></div>
        <div class="col-span-8">
            <Calendar />
        </div>
    </div>
}

export default ActivitiesPlanner; 