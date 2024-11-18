import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../pages/userProfile';
import EditProfile from '../components/userProfile/editProfile';
import SearchHistory from '../components/userProfile/searchHistory';
import SideMenu from '../components/userProfile/sideMenu';

// globally mock fetch
global.fetch = jest.fn(); 

// test suites for edit profile component
describe('Edit Profile', () => {

    // mocking the user
    const mockUser = {
        _id: '12345',
        username: 'JohnDoe'
    };

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
            expect(getByText('Username updated successfully!')).toBeInTheDocument()
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
            expect(getByText('Error updating username')).toBeInTheDocument()
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
            expect(getByText('Password updated successfully!')).toBeInTheDocument()
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
        expect(getByText('New password and confirmation do not match')).toBeInTheDocument();
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
            expect(getByText('Network error')).toBeInTheDocument()
        );
    });
});
