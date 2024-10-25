import React, { useEffect, useState } from 'react';
import SideMenu from '../components/userProfile/sideMenu';
import EditProfile from '../components/userProfile/editProfile';
import SearchHistory from '../components/userProfile/searchHistory';

function UserProfile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedItem, setSelectedItem] = useState('edit');

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
                return <EditProfile 
                userId={user ? user.id : null}
                name={user ? user.username : null}
                 />;
            case 'search':
                return <SearchHistory userId={user ? user.id : null} />;
            default:
                return <p>Select an option from the menu</p>;
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <div className="max-w-[95%] mx-auto p-4 mb-20 flex">
                        <div className="items-center rounded-md w-1/4 mr-2">
                            <SideMenu setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
                        </div>
                        <div className="items-center rounded-md w-3/4 ml-2">
                            {renderContent()}
                        </div>
                    </div>
                </>
            ) : <>
                <div className="max-w-[95%] mx-auto p-4 mb-20 flex">
                    <div className="items-center rounded-md w-1/4 mr-2">
                        <SideMenu setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
                    </div>
                    <div className="items-center rounded-md w-3/4 ml-2">
                        {renderContent()}
                    </div>
                </div>
            </>
            }
        </div>
    );
}

export default UserProfile;
