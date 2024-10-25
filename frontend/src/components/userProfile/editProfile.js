import React, { useState } from 'react';

function EditProfile({ userId, name }) {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    console.log(name);

    const handleUsernameUpdate = async () => {
        try {
            const response = await fetch('/updateusername', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newUsername: username }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setError('');
            } else {
                setError(data.error || 'Error updating username');
                setMessage('');
            }
        } catch (err) {
            setError('Network error');
            setMessage('');
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            const response = await fetch('/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, oldPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setError('');
            } else {
                setError(data.error || 'Error updating password');
                setMessage('');
            }
        } catch (err) {
            setError('Network error');
            setMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Ensure passwords match
        if (newPassword && newPassword !== confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }

        // Proceed with updating username or password if valid
        if (username) handleUsernameUpdate();
        if (oldPassword && newPassword) handlePasswordUpdate();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder={name}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter old password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="flex rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default EditProfile;
