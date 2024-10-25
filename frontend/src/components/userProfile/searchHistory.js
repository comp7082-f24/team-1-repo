import React, { useEffect, useState } from 'react';

function SearchHistory({ userId }) {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState({});
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 5; 

    useEffect(() => {
        if (!userId) return;

        // Grab search history using userId
        const fetchSearchHistory = async () => {
            try {
                const response = await fetch(`/searchhistory/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSearchHistory(data);
            } catch (err) {
                setError('Error fetching search history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchHistory();
    }, [userId]);

    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
            for (const query of searchHistory) {
                const location = query.searchQuery;
                try {
                    const wikiResponse = await fetch(
                        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`
                    );
                    if (wikiResponse.ok) {
                        const wikiData = await wikiResponse.json();
                        newImages[query._id] = wikiData.originalimage?.source || null;
                    }
                } catch (error) {
                    console.error(`Error fetching image for ${location}:`, error);
                    newImages[query._id] = null;
                }
            }
            setImages(newImages);
        };

        if (searchHistory.length > 0) {
            fetchImages();
        }
    }, [searchHistory]);

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentQueries = searchHistory.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(searchHistory.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Search History</h2>
            {searchHistory.length === 0 ? (
                <p className="text-center">No search history found.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {currentQueries.map((query) => (
                            <li key={query._id} className="bg-white shadow-md rounded-lg p-4 flex">
                                <div className="w-3/5">
                                    <strong className="block text-lg">Location</strong>
                                    <p>{query.searchQuery}</p>
                                    <strong className="block mt-2">Start Date</strong>
                                    <p>{query.startDate}</p>
                                    <strong className="block mt-2">End Date</strong>
                                    <p>{query.endDate}</p>
                                    <strong className="block mt-2">Search Date</strong>
                                    <p>{new Date(query.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="w-2/5">
                                    {images[query._id] ? (
                                        <img
                                            src={images[query._id]}
                                            alt={query.searchQuery}
                                            className="w-full h-auto rounded-md"
                                        />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                                
                                className={`px-4 py-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60 ${currentPage === 1 ? 'cursor-not-allowed' : ''
                                }`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                                className={`px-4 py-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60 ${currentPage === totalPages ? 'cursor-not-allowed' : ''
                                }`}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchHistory;