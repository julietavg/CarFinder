import { render, screen } from '@testing-library/react';
import App from '../App';
import { server } from '../test/msw/server';
import { rest } from 'msw';

beforeEach(() => {
  // simulate valid stored token → backend returns cars and admin identity
  localStorage.setItem('basicAuth', btoa('admin:admin123'));
});
afterEach(() => localStorage.clear());

it('shows VehicleList after token check', async () => {
  render(<App />);
  expect(await screen.findByText(/Loading inventory/i)).toBeInTheDocument();
  expect(await screen.findByText(/Saved Cars/i)).toBeInTheDocument(); // nav present
});
