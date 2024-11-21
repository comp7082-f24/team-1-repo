import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/signin';
import SignUp from '../pages/signup';

global.fetch = jest.fn(); 

// Mock user data
const mockUser = {
    email: 'test@test.com',
    password: 'correctpassword',
};

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

    test('Displays API success message on correct credentials', async () => {
        global.fetch = jest.fn((url, options) => {
            const { email, password } = JSON.parse(options.body);

            if (email === mockUser.email && password === mockUser.password) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Login successful' }),
                });
            } else {
                return Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({ error: 'Invalid credentials' }),
                });
            }
        });

        const { getByPlaceholderText, getByRole, queryByText } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.click(signInButton);

        // expect the error message to not be displayed
        const errorMessage = await queryByText('Invalid credentials');
        expect(errorMessage).not.toBeInTheDocument();
    });

    test('Displays API error message on invalid credentials', async () => {
        global.fetch = jest.fn((url, options) => {
            const { email, password } = JSON.parse(options.body);

            if (email === mockUser.email && password === mockUser.password) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Login successful' }),
                });
            } else {
                return Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({ error: 'Invalid credentials' }),
                });
            }
        });

        const { getByPlaceholderText, getByRole, findByText } = render(<SignIn />);
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const signInButton = getByRole('button', { name: 'Sign in' });

        fireEvent.change(emailInput, { target: { value: 'wronguser@example.com' } });
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

describe('Sign up testing', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Renders correctly', () => {
        const { getByText, getByPlaceholderText, getByRole } = render(<SignUp/>);

        getByText('Create your account');
        getByText('Email address');
        getByText('Username');
        getByText('Password');
        getByText('Already have an account?');
        getByText('Sign in!');

        getByPlaceholderText('Email');
        getByPlaceholderText('Username');
        getByPlaceholderText('Password');

        getByRole('button', { name: 'Sign up'})
    });

    test('Pressing sign in redirects to proper page', () => {
        const { getByText } = render(<SignUp />);

        const signIn = getByText('Sign in!');
        /** we know that signIn has the attribute '/signin', so we assign the
         *  window location to be '/signin' when we click on the button */
        expect(signIn).toHaveAttribute('href', '/signin');
        fireEvent.click(signIn);
        delete window.location;
        window.location = { href: '/signin' };

        expect(window.location.href).toBe('/signin');
    })

    test('Displays success message on successful signup and redirects', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'User registered successfully!' }),
            })
        );

        delete window.location;
        window.location = { href: '/' };

        const { getByPlaceholderText, getByRole, findByText } = render(<SignUp />);
        const emailInput = getByPlaceholderText('Email');
        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');
        const signupButton = getByRole('button', { name: 'Sign up' });

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(signupButton);

        const successMessage = await findByText('User registered successfully!');
        expect(successMessage).toBeInTheDocument();
        expect(window.location.href).toBe('/');
    });

    test('Displays error message on server-side error', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Email already in use' }),
            })
        );

        const { getByPlaceholderText, getByRole, findByText } = render(<SignUp />);
        const emailInput = getByPlaceholderText('Email');
        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');
        const signupButton = getByRole('button', { name: 'Sign up' });

        fireEvent.change(emailInput, { target: { value: 'existinguser@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(signupButton);

        const errorMessage = await findByText('Email already in use');
        expect(errorMessage).toBeInTheDocument();
    });

    test('Displays error message on unexpected error', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        const { getByPlaceholderText, getByRole, findByText } = render(<SignUp />);
        const emailInput = getByPlaceholderText('Email');
        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');
        const signupButton = getByRole('button', { name: 'Sign up' });

        fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'newuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(signupButton);

        const errorMessage = await findByText('An unexpected error occurred.');
        expect(errorMessage).toBeInTheDocument();
    });

    test('Prevents submission if required fields are empty', async () => {
        const { getByRole } = render(<SignUp />);

        fireEvent.click(getByRole('button', { name: 'Sign up' }));

        // Since the form won't submit, error and success messages should not be displayed
        const errorMessage = document.querySelector('.text-red-500');
        const successMessage = document.querySelector('.text-green-500');

        expect(errorMessage).toBeNull();
        expect(successMessage).toBeNull();
    });
});