import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleForm from '../components/vehicle/VehicleForm';

describe('VehicleForm', () => {
  const fillMinimum = async () => {
    await userEvent.type(screen.getByLabelText(/vin/i), 'ABCDEFGH123456789');
    await userEvent.type(screen.getByLabelText(/make/i), 'FORD');
    await userEvent.type(screen.getByLabelText(/model/i), 'MUSTANG');
    await userEvent.clear(screen.getByLabelText(/year/i));
    await userEvent.type(screen.getByLabelText(/year/i), '2024');
    await userEvent.type(screen.getByLabelText(/submodel/i), 'GT');
    await userEvent.type(screen.getByLabelText(/^mileage$/i), '12000');
    await userEvent.type(screen.getByLabelText(/color/i), 'Red');
    await userEvent.type(screen.getByLabelText(/price/i), '35000');
    await userEvent.type(screen.getByLabelText(/image url/i), 'https://example.com/img');
  };

  it('shows error if submodel blank', async () => {
    render(<VehicleForm onSave={vi.fn()} onClose={() => {}} />);
    await userEvent.type(screen.getByLabelText(/vin/i), 'ABCDEFGH123456789');
    await userEvent.type(screen.getByLabelText(/make/i), 'FORD');
    await userEvent.type(screen.getByLabelText(/model/i), 'MUSTANG');
    await userEvent.clear(screen.getByLabelText(/year/i));
    await userEvent.type(screen.getByLabelText(/year/i), '2024');
    // leave submodel blank
    await userEvent.type(screen.getByLabelText(/^mileage$/i), '12000');
    await userEvent.type(screen.getByLabelText(/color/i), 'Red');
    await userEvent.type(screen.getByLabelText(/price/i), '35000');
    await userEvent.type(screen.getByLabelText(/image url/i), 'https://example.com/img');

    await userEvent.click(screen.getByRole('button', { name: /add vehicle|update vehicle|save/i }));
    expect(await screen.findByText(/Submodel cannot be empty/i)).toBeInTheDocument();
  });

  it('maps backend 400 errors subModel→submodel', async () => {
    const onSave = vi.fn().mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: 'Validation failed.',
          errors: { subModel: 'Submodel cannot be empty.' }
        }
      }
    });
    render(<VehicleForm onSave={onSave} onClose={() => {}} />);
    await fillMinimum(); // submodel filled, but backend forces error
    await userEvent.click(screen.getByRole('button', { name: /add vehicle|update vehicle|save/i }));

    expect(await screen.findByText(/Submodel cannot be empty/i)).toBeInTheDocument();
  });

  it('shows 409 duplicate VIN banner', async () => {
    const onSave = vi.fn().mockRejectedValue({
      response: { status: 409, data: { message: 'Cannot add car with same VIN.' } }
    });
    render(<VehicleForm onSave={onSave} onClose={() => {}} />);
    await fillMinimum();
    await userEvent.click(screen.getByRole('button', { name: /add vehicle|update vehicle|save/i }));

    expect(await screen.findByText(/Cannot add car with same VIN/i)).toBeInTheDocument();
  });
});
