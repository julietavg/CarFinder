import { render, screen, waitFor } from '@testing-library/react';
import VehicleList from '../components/vehicle-list/VehicleList';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url) => {
        if (url === '/cars' || url === '/api/cars') {
          return Promise.resolve({ data: [
            { id:1, vin:'ABCDEFGH123456789', year:2021, make:'TOYOTA', model:'CAMRY', subModel:'LE', mileage:10, color:'Blue', transmission:'Automatic', price:20000, image:'' }
          ]});
        }
        return Promise.resolve({ data: {} });
      }),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }
  };
});

describe('VehicleList', () => {
  it('renders cars from backend', async () => {
    render(<VehicleList onLogout={() => {}} isAdmin={false} />);
    expect(await screen.findByText(/TOYOTA-CAMRY 2021/i)).toBeInTheDocument();
  });

  it('hides admin actions for non-admin', async () => {
    render(<VehicleList onLogout={() => {}} isAdmin={false} />);
    await screen.findByText(/TOYOTA-CAMRY 2021/i);
    expect(screen.queryByText(/Add new vehicle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
  });

  it('shows admin actions for admin', async () => {
    render(<VehicleList onLogout={() => {}} isAdmin={true} />);
    await screen.findByText(/TOYOTA-CAMRY 2021/i);
    expect(screen.getByText(/Add new vehicle/i)).toBeInTheDocument();
    // per card buttons
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });
});
