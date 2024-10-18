import { useRef } from 'react';

function PopupModal({ data, onClose }) {
    const modalRef = useRef();

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
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 font-bold">
                    X
                </button>
                <h2 className="text-2xl font-bold mb-4">{data.title || 'Destination'}</h2>
                <p>{data.description || 'More information about this activity or destination.'}</p>
                <div className="mt-4">
                    <p><strong>Rating:</strong> {data.rating || '★★★★★'}</p>
                    <p><strong>Price:</strong> {data.price || 'Free'}</p>
                </div>
            </div>
        </div>
    );
}

export default PopupModal;
