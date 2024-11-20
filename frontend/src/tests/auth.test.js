import React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';

global.fetch = jest.fn(); 

describe('Sign in testing', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Renders correctly', () => {
        const { getByText, getByPlaceholderText, getByRole } = render(<SignIn/>);

        expect(document.title).toBe('Sign In');

        getByText('Sign in to your account');
        getByText('Email address');
        getByText('Password');
        getByText('Forgot password?');
        getByText("Don't have an account?");
        getByText('Sign up!');

        getByPlaceholderText('Email');
        getByPlaceholderText('Password');

        getByRole('button', { name: 'Sign in' });
    })

    test('Pressing sign up button redirects to proper page', () => {
        const { getByText } = render(<SignIn />);

        const signUp = getByText('Sign up!');
        /** we know that signUp has the attribute '/signup', so we assign the
         *  window location to be '/signup' when we click on the button */
        expect(signUp).toHaveAttribute('href', '/signup');
        fireEvent.click(signUp);
        delete window.location;
        window.location = { href: '/signup' };

        expect(window.location.href).toBe('/signup');
    });

    test('Invalid email format prevents submission', async () => {
        const { getByPlaceholderText, getByRole } = render(<SignIn />);

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            // validation message should not be empty. should be some sort of error message
            expect(emailInput.validationMessage).not.toBe('');
        });
    });

    test('Displays API error message on invalid credentials', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ error: 'Invalid credentials' }),
            })
        );

        const { getByPlaceholderText, getByRole, findByText } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(signInButton);

        const errorMessage = await findByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    test('Displays error on unexpected server error', async () => {
        // mock error
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        const { getByPlaceholderText, getByRole, findByText } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(signInButton);

        const errorMessage = await findByText('An unexpected error occurred.');
        expect(errorMessage).toBeInTheDocument();
    });

    test('Redirects to landing page on success', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );

        delete window.location;
        window.location = { href: '/' };

        const { getByPlaceholderText, getByRole } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    });
});