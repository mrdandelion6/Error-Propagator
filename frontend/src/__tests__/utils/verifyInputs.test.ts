import { validateEquation } from '../../utils/verifyInput';

describe('validateEquation', () => {
  // basic valid equations
  it('should return empty string for valid equations', () => {
    expect(validateEquation('x + y', ['x', 'y'])[0]).toBe('');
  });

  it('should treat values like pi and e as known variables', () => {
    expect(validateEquation('x + pi', ['x'])[0]).toBe('');
    expect(validateEquation('x + e', ['x'])[0]).toBe('');
  });

  it('should not have an issue with having variables in vars that are not in the equation', () => {
    expect(validateEquation('x + y', ['x', 'y', 'z'])[0]).toBe('');
  });

  it('should not throw errors for empty equations', () => {
    expect(validateEquation('', ['x', 'y'])[0]).toBe('');
  });

  // special functions
  it('should not have an issue with trig functions', () => {
    expect(validateEquation('sin(x^y^x^(3+x)) + cos(y)', ['x', 'y'])[0]).toBe('');
    expect(validateEquation('sin(x) + cos(y) + tan(z)', ['x', 'y', 'z'])[0]).toBe('');
  });

  it('should not have an issue with log functions', () => {
    expect(validateEquation('log(x) + ln(y)', ['x', 'y'])[0]).toBe('');
  });

  // basic errors
  it('should return error message for unknown variables', () => {
    expect(validateEquation('x + y + z', ['x', 'y'])[0]).toBe('Unknown variable: z');
    expect(validateEquation('x + y + z + w', ['x', 'y'])[0]).toBe('Unknown variables: z, w');
  });

  it('should return error message for variable name conflicts with known constants', () => {
    expect(validateEquation('x + pi', ['x', 'pi'])[0]).toBe('Variable name conflicts with known constants: pi, e');
  });

  it('should return an error message when the equation unexpectedly ends', () => {
    expect(validateEquation('x + y +', ['x', 'y'])[0]).toBe('Unexpected end of equation');
    expect(validateEquation('x + y *', ['x', 'y'])[0]).toBe('Unexpected end of equation');
  });

  it('should specify missing brackets in the error message', () => {
    expect(validateEquation('(x + y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateEquation('x + y * z)', ['x', 'y', 'z'])[0]).toBe('Expected end of equation at character 11');
    expect(validateEquation('x + y * (z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateEquation('x + (y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateEquation('(x + (y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 12');
    expect(validateEquation('x + )y * z', ['x', 'y', 'z'])[0]).toBe('Unexpected parenthesis');
    expect(validateEquation(')x + y * z', ['x', 'y', 'z'])[0]).toBe('Unexpected parenthesis');
  });

  // leading numbers
  it('should not have an issue with leading numbers in variable names', () => {
    expect(validateEquation('3x + 2y + 8z', ['x', 'y', 'z'])[0]).toBe('');
    expect(validateEquation('3.2x + 2.1y + 8.9z', ['x', 'y', 'z'])[0]).toBe('');
    expect(validateEquation('a3x + b2y + c8z', ['x', 'y', 'z'])[0]).toBe('Unknown variables: a3x, b2y, c8z');
    expect(validateEquation('a34342x + b223424y + c23428z', ['x', 'y', 'z'])[0]).toBe('Unknown variables: a34342x, b223424y, c23428z');
  });

  // trailing numbers
  it('should recognize trailing numbers as part of the variable name', () => {
    expect(validateEquation('x3 + y2 + z8', ['x3', 'y2', 'z8'])[0]).toBe('');
    expect(validateEquation('x3 + y2 + z8', ['x', 'y', 'z'])[0]).toBe('Unknown variables: x3, y2, z8');
    expect(validateEquation('x3a + y2b + z8c', ['x3', 'y2', 'z8'])[0]).toBe('Unknown variables: x3a, y2b, z8c');
    expect(validateEquation('x34342a + y223424b + z23428c', ['x', 'y', 'z'])[0]).toBe('Unknown variables: x34342a, y223424b, z23428c');
  });

  // trailing and leading white space
  it('should ignore and correct leading and trailing white space in equation', () => {
    expect(validateEquation(' x + y ', ['x', 'y'])[0]).toBe('');
    expect(validateEquation('x + y ', ['x', 'y'])[0]).toBe('');
    expect(validateEquation(' x + y', ['x', 'y'])[0]).toBe('');
    expect(validateEquation('x + y', ['x', 'y'])[0]).toBe('');
    expect(validateEquation('          ', ['x', 'y'])[0]).toBe('');
  });

  // unknown characters
  it('should correctly point out the unknown character \\', () => {
    expect(validateEquation('x\\ + y', ['x', 'y'])[0]).toBe("Unknown character \"\\\"");
  });
});