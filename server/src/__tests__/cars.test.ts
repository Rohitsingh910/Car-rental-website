import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('Cars API', () => {
  it('should return a list of cars', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.statusCode).toEqual(200);
    // Depending on DB state, could be empty array or populated
    expect(Array.isArray(res.body)).toBe(true);
  });
});
