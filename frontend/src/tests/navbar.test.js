import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../components/navbar';

global.fetch = jest.fn(); 

describe('Navbar testing', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Renders correctly (logged out)', () => {
        const { getByText } = render(<Navbar/>);

        getByText('Home');
        getByText('Sign up');
        getByText('Sign in');
    });

    test('User profile and sign out buttons appear when signed in', async () => {
        // mock authenticated user
        fetch.mockResolvedValueOnce({
            json: async () => ({
                authenticated: true,
                user: {
                    username: 'testuser'
                }
            }),
            ok: true
        });

        const { getByText } = render(<Navbar/>);

        await waitFor(() => {
            expect(getByText('testuser')).toBeInTheDocument();
            getByText('Sign out');
        });
    });

    test('Signing out functionality', async () => {
        // mocking authentication check
        fetch.mockResolvedValueOnce({
            json: async () => ({
                authenticated: true,
                user: {
                    username: 'testuser'
                }
            }),
            ok: true,
        });

        // mocking logout endpoint
        fetch.mockResolvedValueOnce({ ok: true });

        delete window.location;
        window.location = { href: '' };

        const { getByText, queryByText } = render(<Navbar />);

        // expect testuser to be in the document (to see if signed in)
        await waitFor(() => {
            expect(getByText('testuser')).toBeInTheDocument();
        });

        fireEvent.click(getByText('Sign out'));

        await waitFor(() => {
            expect(getByText('Sign in')).toBeInTheDocument();
            expect(queryByText('testuser')).not.toBeInTheDocument();
        });
    });
});