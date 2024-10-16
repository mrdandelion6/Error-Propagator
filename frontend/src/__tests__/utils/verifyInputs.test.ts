import { validateExpression, validateValueBox, validateVariable } from '../../utils/verifyInput';

describe('validateExpression', () => {
  // basic valid equations
  it('should return empty string for valid equations', () => {
    expect(validateExpression('x + y', ['x', 'y'])[0]).toBe('');
  });

  it('should treat values like pi and e as known variables', () => {
    expect(validateExpression('x + pi', ['x'])[0]).toBe('');
    expect(validateExpression('x + e', ['x'])[0]).toBe('');
  });

  it('should not have an issue with having variables in vars that are not in the equation', () => {
    expect(validateExpression('x + y', ['x', 'y', 'z'])[0]).toBe('');
  });

  it('should not throw error for empty equations', () => {
    expect(validateExpression('', ['x', 'y'])[0]).toBe('Empty equation');
  });

  // special functions
  it('should not have an issue with trig functions', () => {
    expect(validateExpression('sin(x^y^x^(3+x)) + cos(y)', ['x', 'y'])[0]).toBe('');
    expect(validateExpression('sin(x) + cos(y) + tan(z)', ['x', 'y', 'z'])[0]).toBe('');
  });

  it('should not have an issue with log functions', () => {
    expect(validateExpression('log(x) + ln(y)', ['x', 'y'])[0]).toBe('');
  });

  // basic errors
  it('should return error message for unknown variables', () => {
    expect(validateExpression('x + y + z', ['x', 'y'])[0]).toBe('Unknown variable: z');
    expect(validateExpression('x + y + z + w', ['x', 'y'])[0]).toBe('Unknown variables: z, w');
  });

  it('should return error message for variable name conflicts with known constants', () => {
    expect(validateExpression('x + pi', ['x', 'pi'])[0]).toBe('Variable name conflicts with known constants: pi, e');
  });

  it('should return an error message when the equation unexpectedly ends', () => {
    expect(validateExpression('x + y +', ['x', 'y'])[0]).toBe('Unexpected end of equation');
    expect(validateExpression('x + y *', ['x', 'y'])[0]).toBe('Unexpected end of equation');
  });

  it('should specify missing brackets in the error message', () => {
    expect(validateExpression('(x + y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateExpression('x + y * z)', ['x', 'y', 'z'])[0]).toBe('Expected end of equation at character 11');
    expect(validateExpression('x + y * (z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateExpression('x + (y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 11');
    expect(validateExpression('(x + (y * z', ['x', 'y', 'z'])[0]).toBe('Expected ) at character 12');
    expect(validateExpression('x + )y * z', ['x', 'y', 'z'])[0]).toBe('Unexpected parenthesis');
    expect(validateExpression(')x + y * z', ['x', 'y', 'z'])[0]).toBe('Unexpected parenthesis');
  });

  // leading numbers
  it('should not have an issue with leading numbers in variable names', () => {
    expect(validateExpression('3x + 2y + 8z', ['x', 'y', 'z'])[0]).toBe('');
    expect(validateExpression('3.2x + 2.1y + 8.9z', ['x', 'y', 'z'])[0]).toBe('');
    expect(validateExpression('a3x + b2y + c8z', ['x', 'y', 'z'])[0]).toBe('Unknown variables: a3x, b2y, c8z');
    expect(validateExpression('a34342x + b223424y + c23428z', ['x', 'y', 'z'])[0]).toBe('Unknown variables: a34342x, b223424y, c23428z');
  });

  // trailing numbers
  it('should recognize trailing numbers as part of the variable name', () => {
    expect(validateExpression('x3 + y2 + z8', ['x3', 'y2', 'z8'])[0]).toBe('');
    expect(validateExpression('x3 + y2 + z8', ['x', 'y', 'z'])[0]).toBe('Unknown variables: x3, y2, z8');
    expect(validateExpression('x3a + y2b + z8c', ['x3', 'y2', 'z8'])[0]).toBe('Unknown variables: x3a, y2b, z8c');
    expect(validateExpression('x34342a + y223424b + z23428c', ['x', 'y', 'z'])[0]).toBe('Unknown variables: x34342a, y223424b, z23428c');
  });

  // trailing and leading white space
  it('should ignore and correct leading and trailing white space in equation', () => {
    expect(validateExpression(' x + y ', ['x', 'y'])[0]).toBe('');
    expect(validateExpression('x + y ', ['x', 'y'])[0]).toBe('');
    expect(validateExpression(' x + y', ['x', 'y'])[0]).toBe('');
    expect(validateExpression('x + y', ['x', 'y'])[0]).toBe('');
    expect(validateExpression('          ', ['x', 'y'])[0]).toBe('Empty equation');
  });

  // unknown characters
  it('should correctly point out the unknown character \\', () => {
    expect(validateExpression('x\\ + y', ['x', 'y'])[0]).toBe("Invalid character \"\\\"");
  });
});


describe('validateValueBox', () => {
  // basic valid equations
  it('should return empty string for valid equations', () => {
    expect(validateValueBox(true, '3.2')).toEqual(['', '3.2']);
    expect(validateValueBox(true, '3')).toEqual(['', '3']);
    expect(validateValueBox(true, '234234')).toEqual(['', '234234']);
  });

  it('should return a complaint when non numeric values are entered', () => {
    expect(validateValueBox(true, '3.2a')).toEqual(['Constant error value must be a number', '3.2a']);
    expect(validateValueBox(true, '3a')).toEqual(['Constant error value must be a number', '3a']);
    expect(validateValueBox(true, '234234a')).toEqual(['Constant error value must be a number', '234234a']);
  });

  it('should return a unique complaint when multiple values are entered', () => {
    expect(validateValueBox(true, '3.2, 3.2')).toEqual(['Constant error value must be a single number', '3.2 3.2']);
    expect(validateValueBox(true, '3, 3')).toEqual(['Constant error value must be a single number', '3 3']);
    expect(validateValueBox(true, '234234, 234234')).toEqual(['Constant error value must be a single number', '234234 234234']);
    expect(validateValueBox(true, '3.2 4.5')).toEqual(['Constant error value must be a single number', '3.2 4.5']);
    expect(validateValueBox(true, '3 4')).toEqual(['Constant error value must be a single number', '3 4']);
    expect(validateValueBox(true, '234234 234234')).toEqual(['Constant error value must be a single number', '234234 234234']);
    expect(validateValueBox(true, '3.2\n4.5')).toEqual(['Constant error value must be a single number', '3.2\n4.5']);
    expect(validateValueBox(true, '3\n4')).toEqual(['Constant error value must be a single number', '3\n4']);
    expect(validateValueBox(true, '234234\n234234')).toEqual(['Constant error value must be a single number', '234234\n234234']);
  });

  it('should return a complaint when the value is empty', () => {
    expect(validateValueBox(true, '')).toEqual(['Empty error field', '']);
    expect(validateValueBox(false, '')).toEqual(['Empty error fields', '']);
    expect(validateValueBox(true, '', false)).toEqual(['Empty nominal field', '']);
    expect(validateValueBox(false, '', false)).toEqual(['Empty nominal fields', '']);
  });
});

describe('validateVariable', () => {
  it('should return empty error string for valid variables', () => {
    expect(validateVariable('z', ['x', 'y'])).toEqual(['', 'z']);
    expect(validateVariable('z13sad2313', ['x', 'y'])).toEqual(['', 'z13sad2313']);
  });
});