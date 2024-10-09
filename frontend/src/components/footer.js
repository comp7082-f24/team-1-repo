import React, { useState } from 'react';

function Footer() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <p className="text-center mb-8">TravelTime makes your travel planning easy</p>

            <div className="space-y-4">
                <div className="border border-gray-300 rounded-lg shadow-sm">
                    <button
                        className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => toggleAnswer(0)}
                    >
                        <span>FAQ 1</span>
                        <svg className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === 0 ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-3-3h6l-3 3zm0 0l3-3H9l3 3z" />
                        </svg>
                    </button>
                    <div className={`${openIndex === 0 ? 'block' : 'hidden'} p-4 bg-gray-50`}>
                        <p>answer</p>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg shadow-sm">
                    <button
                        className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => toggleAnswer(1)}
                    >
                        <span>FAQ 2</span>
                        <svg className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === 1 ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-3-3h6l-3 3zm0 0l3-3H9l3 3z" />
                        </svg>
                    </button>
                    <div className={`${openIndex === 1 ? 'block' : 'hidden'} p-4 bg-gray-50`}>
                        <p>answer</p>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg shadow-sm">
                    <button
                        className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => toggleAnswer(2)}
                    >
                        <span>FAQ 3</span>
                        <svg className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === 2 ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-3-3h6l-3 3zm0 0l3-3H9l3 3z" />
                        </svg>
                    </button>
                    <div className={`${openIndex === 2 ? 'block' : 'hidden'} p-4 bg-gray-50`}>
                        <p>answer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
