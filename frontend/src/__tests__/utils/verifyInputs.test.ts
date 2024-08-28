import { validateEquation } from '../../utils/verifyInput';

describe('validateEquation', () => {
  it('should return empty string for valid equations', () => {
    expect(validateEquation('x + y', ['x', 'y'])).toBe('');
  });

  it('should return error message for unknown variables', () => {
    expect(validateEquation('x + y + z', ['x', 'y'])).toBe('Unknown variable: z');
  });
});