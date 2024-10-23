import { useRef, useEffect, useState } from 'react';

function PopupModal({ data, onClose }) {
    const [timezone, setTimezone] = useState([]);
    const modalRef = useRef();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        let temp;
        let time;
        const fetchTime = async () => {
            try {
                const timeResponse = await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${data.coordinates.lat}&longitude=${data.coordinates.lon}`);
                if (!timeResponse.ok) {
                    throw new Error("Couldn't fetch result");
                }
                const timeResponseData = await timeResponse.json();
                temp = timeResponseData.time.substring(0,2);
                if (temp > 12) {
                    time = (temp - 12).toString() + timeResponseData.time.substring(2) + ' p.m';
                } else {
                    time = timeResponseData.time + ' a.m';
                }
                setTimezone(time);
            } catch (error) {
                console.error(error)
            }
        }

        fetchTime();
    }, []);

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative overflow-y-auto max-h-full">
                <button onClick={onClose} className="absolute top-4 right-4 font-bold">
                    X
                </button>
                <h2 className="text-2xl font-bold mb-4">{data.title || 'Destination'}</h2>
                <img
                    src={data.originalimage?.source}
                    className="object-cover w-full h-full rounded-tl-lg rounded-tr-lg"
                />
                <p>{data.extract || 'More information about this activity or destination.'}</p>
                <p className="mt-6">Time: {timezone || 'More information about this activity or destination.'}</p>
                {/* <div className="mt-4">
                    <p><strong>Rating:</strong> {data.rating || '★★★★★'}</p>
                    <p><strong>Price:</strong> {data.price || 'Free'}</p>
                </div> */}
            </div>
        </div>
    );
}

export default PopupModal;
