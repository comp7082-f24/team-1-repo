import placeholder from '../../images/placeholder.png';
import { SearchIcon } from '@heroicons/react/solid';

function ActivityCard({ index, onClick }) {
    return (
        <div key={index} className="flex flex-col bg-white rounded-lg shadow-md" role="button" onClick={onClick}>
            <div className="relative h-48">
                <img
                    src={placeholder}
                    alt="Activity Image"
                    className="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"
                />
            </div>
            <div className="p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold">Destination</h2>
                    <p className="text-gray-500">Information</p>
                    <p className="text-gray-500">...</p>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★★★★★</span>
                        <span className="text-gray-500">5.0</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center">
                        Search
                        <SearchIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActivityCard;
