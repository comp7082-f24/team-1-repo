import React, { useEffect, useState } from 'react';
import SideMenu from '../components/userProfile/sideMenu';
import EditProfile from '../components/userProfile/editProfile';
import SearchHistory from '../components/userProfile/searchHistory';
import DestinationDetails from '../pages/destinationDetails';
import { MenuIcon } from '@heroicons/react/outline';

function UserProfile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedItem, setSelectedItem] = useState('edit');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.title = 'User Profile';

        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/isauth', {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await response.json();
                setIsAuthenticated(data.authenticated);
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    window.location.href = '/signin';
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuthStatus();
    }, []);

    const renderContent = () => {
        switch (selectedItem) {
            case 'edit':
                return <EditProfile userId={user ? user.id : null} name={user ? user.username : null} />;
            case 'search':
                return <SearchHistory userId={user ? user.id : null} />;
            case 'details':
                return <DestinationDetails/>
            default:
                return <p>Select an option from the menu</p>;
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <div className="max-w-[95%] mx-auto p-4 mb-20">
                        <div className="md:hidden w-full flex justify-center rounded-lg bg-gray-100 p-2 mb-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="focus:outline-none"
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/4 md:mr-2">
                                <SideMenu
                                    setSelectedItem={setSelectedItem}
                                    selectedItem={selectedItem}
                                    isMobileOpen={isMobileMenuOpen}
                                />
                            </div>
                            <div className="md:w-3/4 md:ml-2 flex-grow">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                    <>
                        <div className="max-w-[95%] mx-auto p-4 mb-20">
                            {/* Full-width header for the hamburger icon on mobile */}
                            <div className="md:hidden w-full flex justify-center bg-gray-100 p-2 mb-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="focus:outline-none"
                                >
                                    <MenuIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex md:flex-row flex-col">
                                <div className="md:w-1/4 md:mr-2">
                                    <SideMenu
                                        setSelectedItem={setSelectedItem}
                                        selectedItem={selectedItem}
                                        isMobileOpen={isMobileMenuOpen}
                                    />
                                </div>
                                <div className="md:w-3/4 md:ml-2 flex-grow">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </>
            )}
        </div>
    );
}

export default UserProfile;
