import { rest } from 'msw';

export const cars = [
  { id: 1, vin: 'ABCDEFGH123456789', year: 2021, make: 'TOYOTA', model: 'CAMRY', subModel: 'LE', mileage: 10, color: 'Blue', transmission: 'Automatic', price: 20000, image: '' }
];

export const handlers = [
  // Validate credentials during login check
  rest.get('/api/cars', (_req, res, ctx) => res(ctx.status(200), ctx.json(cars))),

  // Identity endpoint used by App.jsx (if present)
  rest.get('/api/auth/me', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ username: 'admin', roles: ['ROLE_ADMIN'] }))
  ),

  // Create
  rest.post('/api/cars', async (req, res, ctx) => {
    const body = await req.json();
    if (body.vin === 'DUPLICATEVIN123456') {
      return res(ctx.status(409), ctx.json({ message: 'Cannot add car with same VIN.' }));
    }
    const created = { ...body, id: 2 };
    return res(ctx.status(201), ctx.json({ message: 'Car created successfully', car: created }));
  }),

  // Update
  rest.put('/api/cars/:id', async (req, res, ctx) => {
    const id = Number(req.params.id);
    const body = await req.json();
    return res(ctx.status(200), ctx.json({ message: 'Car updated successfully', car: { ...body, id } }));
  }),

  // Delete
  rest.delete('/api/cars/:id', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ message: `Car id ${req.params.id} has been deleted successfully.` }))
  ),
];
