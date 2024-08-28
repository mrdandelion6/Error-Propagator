import { validateEquation } from '../../utils/verifyInput';

describe('validateEquation', () => {
  // valid equations
  it('should return empty string for valid equations', () => {
    expect(validateEquation('x + y', ['x', 'y'])).toBe('');
  });

  it('should treat values like pi and e as known variables', () => {
    expect(validateEquation('x + pi', ['x'])).toBe('');
    expect(validateEquation('x + e', ['x'])).toBe('');
  });

  it('should not have an issue with having variables in vars that are not in the equation', () => {
    expect(validateEquation('x + y', ['x', 'y', 'z'])).toBe('');
  });

  // special functions
  it('should not have an issue with trig functions', () => {
    expect(validateEquation('sin(x^y^x^(3+x)) + cos(y)', ['x', 'y'])).toBe('');
    expect(validateEquation('sin(x) + cos(y) + tan(z)', ['x', 'y', 'z'])).toBe('');
  });

  it('should not have an issue with log functions', () => {
    expect(validateEquation('log(x) + ln(y)', ['x', 'y'])).toBe('');
  });

  // errors
  it('should return error message for unknown variables', () => {
    expect(validateEquation('x + y + z', ['x', 'y'])).toBe('Unknown variable: z');
    expect(validateEquation('x + y + z + w', ['x', 'y'])).toBe('Unknown variables: z, w');
  });

  it('should return error message for variable name conflicts with known constants', () => {
    expect(validateEquation('x + pi', ['x', 'pi'])).toBe('Variable name conflicts with known constants');
  });

  it('should return an error message when the equation unexpectedly ends', () => {
    expect(validateEquation('x + y +', ['x', 'y'])).toBe('Unexpected end of equation');
    expect(validateEquation('x + y *', ['x', 'y'])).toBe('Unexpected end of equation');
  });

  it('should specify missing brackets in the error message', () => {
    expect(validateEquation('(x + y * z', ['x', 'y', 'z'])).toBe('Expected ) at [1:11]');
    expect(validateEquation('x + y * z)', ['x', 'y', 'z'])).toBe('Expected end of equation at [1:11]');
    expect(validateEquation('x + y * (z', ['x', 'y', 'z'])).toBe('Expected ) at [1:11]');
    expect(validateEquation('x + (y * z', ['x', 'y', 'z'])).toBe('Expected ) at [1:11]');
    expect(validateEquation('(x + (y * z', ['x', 'y', 'z'])).toBe('Expected ) at [1:12]');
    expect(validateEquation('x + )y * z', ['x', 'y', 'z'])).toBe('Unexpected parenthesis');
    expect(validateEquation(')x + y * z', ['x', 'y', 'z'])).toBe('Unexpected parenthesis');
  });
});