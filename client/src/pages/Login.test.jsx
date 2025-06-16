import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mock API
vi.mock('../utils/api.js', () => ({
    default: {
        post: vi.fn((url, data) => {
            console.log('Mock API called:', url, data);
            if (url.includes('/login') && data.email === 'test@example.com') {
                return Promise.resolve({
                    data: {
                        token: 'fake-token',
                        user: { email: data.email },
                    },
                });
            }
            return Promise.reject({
                response: {
                    status: 401,
                    data: { message: 'Mocked: Invalid credentials' },
                },
            });
        }),
    },
}));

describe('Login Component', () => {
    it('logs in successfully', async () => {
        const mockSetUser = vi.fn();

        render(
            <BrowserRouter>
                <Login setUser={mockSetUser} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() =>
            expect(mockSetUser).toHaveBeenCalledWith({ email: 'test@example.com' })
        );
    });

    it('shows error on failed login', async () => {
        const mockSetUser = vi.fn();

        render(
            <BrowserRouter>
                <Login setUser={mockSetUser} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpass' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() =>
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        );
    });
});