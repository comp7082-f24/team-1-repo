import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../pages/userProfile';
import EditProfile from '../components/userProfile/editProfile';
import SearchHistory from '../components/userProfile/searchHistory';
import SideMenu from '../components/userProfile/sideMenu';

// globally mock fetch
global.fetch = jest.fn(); 

// mocking the user
const mockUser = {
    _id: '12345',
    username: 'JohnDoe'
};

// test suites for edit profile component
describe('Edit Profile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Renders component correctly', () => {
        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        // element header
        getByText('Edit Profile');

        // form 
        getByText('Username');
        getByText('Old Password');
        getByText('New Password');
        getByText('Confirm New Password');

        // placeholder data
        getByPlaceholderText(mockUser.username)
        getByPlaceholderText('Enter old password');
        getByPlaceholderText('Enter new password');
        getByPlaceholderText('Confirm new password');

        getByRole('button', { name: /update profile/i });
    });

    test('Successfully updating username', async () => {
        // mocking success value
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Username updated successfully!' }),
        });

        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        // changing old username to new username value
        fireEvent.change(getByPlaceholderText(mockUser.username), {
            target: { value: 'NewUsername' },
        });

        fireEvent.click(getByRole('button', { name: /update profile/i }));

        // wait for success message
        await waitFor(() =>
            getByText('Username updated successfully!')
        );
    });

    test('Shows error message if updating username results in an error', async () => {
        // mock error value
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Error updating username' }),
        });

        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        fireEvent.change(getByPlaceholderText(mockUser.username), {
            target: { value: ' ' },
        });

        fireEvent.click(getByRole('button', { name: /update profile/i }));

        await waitFor(() =>
            getByText('Error updating username')
        );
    });

    test('Updates password successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Password updated successfully!' }),
        });

        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        // mock password change
        fireEvent.change(getByPlaceholderText('Enter old password'), {
            target: { value: 'oldpassword123' },
        });
        fireEvent.change(getByPlaceholderText('Enter new password'), {
            target: { value: 'newpassword123' },
        });
        fireEvent.change(getByPlaceholderText('Confirm new password'), {
            target: { value: 'newpassword123' },
        });

        fireEvent.click(getByRole('button', { name: /update profile/i }));

        await waitFor(() =>
            getByText('Password updated successfully!')
        );
    });

    test('Validates password confirmation mismatch', () => {
        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        fireEvent.change(getByPlaceholderText('Enter new password'), {
            target: { value: 'newpassword123' },
        });
        fireEvent.change(getByPlaceholderText('Confirm new password'), {
            target: { value: 'differentpassword123' },
        });

        fireEvent.click(getByRole('button', { name: /update profile/i }));

        // check for error
        getByText('New password and confirmation do not match')
    });

    test('Shows network error message', async () => {
        // mock network error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const { getByText, getByPlaceholderText, getByRole } = render(<EditProfile userId={mockUser.userId} name={mockUser.username} />);

        fireEvent.change(getByPlaceholderText(mockUser.username), {
            target: { value: 'Awesome Username' },
        });

        fireEvent.click(getByRole('button', { name: /update profile/i }));

        await waitFor(() =>
            getByText('Network error')
        );
    });
});

describe('Search History', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Renders loading state initially', () => {
        const { getByText } = render(<SearchHistory userId={mockUser._id} />);
        getByText('Loading...');
    });

    test('Displays search history data', async () => {
        // mock search history
        const mockSearchHistory = [
            {
                _id: '1',
                searchQuery: 'Paris',
                startDate: '2024-11-01',
                endDate: '2024-11-05',
                createdAt: '2024-11-01T10:00:00Z',
            },
            {
                _id: '2',
                searchQuery: 'London',
                startDate: '2024-11-10',
                endDate: '2024-11-15',
                createdAt: '2024-11-10T10:00:00Z',
            },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchHistory,
        });

        const { getByText, getByRole } = render(<SearchHistory userId={mockUser._id} />);

        // wait for search history to load
        await waitFor(() => getByText('Paris')); 
        getByText('London');
        // only 1 of 1 because only loading enough data for one page
        getByText('Page 1 of 1');
        getByRole('button', { name: 'Previous' });
        getByRole('button', { name: 'Next' });
    });

    // mock image fetching
    test('Fetches and displays images for each search query', async () => {
        const mockSearchHistory = [
            {
                _id: '1',
                searchQuery: 'Paris',
                startDate: '2024-11-01',
                endDate: '2024-11-05',
                createdAt: '2024-11-01T10:00:00Z',
            },
        ];

        const mockImage = { imageUrl: 'https://example.com/paris.jpg' };

        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchHistory,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockImage,
            });

        const { getByAltText } = render(<SearchHistory userId={mockUser._id} />);

        await waitFor(() => getByAltText('Paris'));
    });

    test('Handles error state', async () => {
        // mock error
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        const { getByText } = render(<SearchHistory userId={mockUser._id} />);

        await waitFor(() => getByText('Error fetching search history'));
    });

    test('Handles pagination correctly', async () => {
        // mock random locations
        const mockSearchHistory = Array.from({ length: 15 }, (_, i) => ({
            _id: `${i + 1}`,
            searchQuery: `Location ${i + 1}`,
            startDate: '2024-11-01',
            endDate: '2024-11-05',
            createdAt: '2024-11-01T10:00:00Z',
        }));

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSearchHistory,
        });

        const { queryByText, getByText, getByRole } = render(<SearchHistory userId={mockUser._id} />);

        await waitFor(() => getByText(/location 1/i));
        // Page 2 data not yet visible, so don't expect it to be visible
        expect(queryByText(/location 6/i)).not.toBeInTheDocument(); 

        // go to page 2
        fireEvent.click(getByRole('button', { name: /next/i })); 

        // now check for location 6 (expected to be in page 2)
        await waitFor(() => getByText(/location 6/i));
    });

});