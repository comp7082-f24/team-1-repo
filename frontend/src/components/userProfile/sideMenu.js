import React from 'react';
import { UserCircleIcon, ClockIcon } from '@heroicons/react/outline';

function SideMenu({ setSelectedItem, selectedItem }) {
    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div>
            <ul>
                <li
                    className={`py-2 ${selectedItem === 'edit' ? 'bg-blue-100 m-1 rounded' : ''}`}
                    onClick={() => handleItemClick('edit')}
                >
                    <a className="ml-2 hover:text-[#007bff] block">
                        <UserCircleIcon className="w-5 h-5 inline-block mr-1" />
                        Edit Profile
                    </a>
                </li>
                <hr />
                <li
                    className={`py-2 ${selectedItem === 'search' ? 'bg-blue-100 m-1 rounded' : ''}`}
                    onClick={() => handleItemClick('search')}
                >
                    <a className="ml-2 hover:text-[#007bff] block">
                        <ClockIcon className="w-5 h-5 inline-block mr-1" />
                        Search History
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default SideMenu;
