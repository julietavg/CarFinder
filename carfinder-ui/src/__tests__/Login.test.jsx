import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login/Login';

describe('Login', () => {
  it('shows required error when fields empty', async () => {
    const onLogin = vi.fn();
    render(<Login onLogin={onLogin} />);
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/All fields are required/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with username/password', async () => {
    const onLogin = vi.fn().mockResolvedValue();
    render(<Login onLogin={onLogin} />);
    await userEvent.type(screen.getByPlaceholderText(/email address/i), 'admin');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'admin123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(onLogin).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' });
  });
});
