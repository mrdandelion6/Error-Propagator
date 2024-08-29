import { Parser } from "expr-eval";

export function validateEquation(eqn: string, vars: string[]): string[] {
  /* 
    This function is called by the ErrorPropagator component to validate the equation entered by the user.
    It uses the expr-eval library to parse the equation and check for unknown variables.
    The function returns an error message if there are unknown variables or if the equation is invalid.
    The error message is displayed to the user in the ErrorPropagator component.
    Returns an array with two elements: the error message and the modified equation: [error message, modified equation]
  */

  eqn = eqn.trim();
  if (eqn === '') {
    return ['', '']; // no errors
  }

  const clean = (message: string): string => {
    // this function cleans up the error message returned by the parser and makes it more user-friendly

    if (message === "") {
      console.log('Unexpected empty string for error message');
      return message;
    }

    if (message.startsWith('parse error') && message.includes('Expected')) {
      const words = message.split(' ');
      message=words.slice(words.indexOf('Expected')).join(' ');
      const errorLocation = words[words.indexOf('Expected') -1].slice(0, -1);
      if ( errorLocation.endsWith(']') && errorLocation.startsWith('[') ) {
        message += ' at character ' + errorLocation.slice(errorLocation.indexOf(':') + 1, errorLocation.indexOf(']'));
      }
    }
    const replaceItems: {[key: string]: string} = {
      'EOF' : "end of equation",
      'TPAREN' : "parenthesis",
      'TOP' : "operator",
      'TNUMBER' : "number",
    }
    for (const x in replaceItems) {
      if (Object.prototype.hasOwnProperty.call(replaceItems, x)) {
        message = message.replace(new RegExp(x, 'g'), replaceItems[x]);
        
        if (x == 'TPAREN')  {
          message = message.replace(/[:\s(]+$/, '');
          message = message.replace(/[:\s)]+$/, '');
        }
      }
    }
    message = message.trim();
    message = message.charAt(0).toUpperCase() + message.slice(1);
    return message;
  }

  const constants = ['pi', 'e'];
  if (vars.some(v => constants.includes(v))) {
    return ['Variable name conflicts with known constants: pi, e', eqn];
  }
  vars = vars.concat(constants); // add constants to known variables
  const p = new Parser();
  try {
    // use regex to modify the equation and add * between the coefficient and the variable if there exist any coefficients with no space, e.g) 2x -> 2*x
    const regex = /(?<![a-zA-Z0-9])(\d+(?:\.\d+)?)([a-zA-Z]+)/g;
    const matches = eqn.match(regex);
    eqn = eqn.replace(regex, '$1*$2');
    console.log("matches are: ", matches);
    console.log("eqn is: ", eqn);
    const parsed = p.parse(eqn);
    const enteredVariables: string[] = parsed.variables();
    
    const unknownVars = enteredVariables.filter((v: string) => {
      return !vars.some(knownVar => knownVar === v);
    });
    if (unknownVars.length === 1) {
      return [`Unknown variable: ${unknownVars[0]}`, eqn];
    }
    if (unknownVars.length > 1) {
      return [`Unknown variables: ${unknownVars.join(', ')}`, eqn];
    }
    return ['', eqn]; // no errors
  } catch (error) {
    if (error instanceof Error) {
      let message: string = error.message;
      // console.log(message);

      switch (message) {
        case "unexpected TEOF: EOF":
          return ['Unexpected end of equation', eqn];
        default:
          message = clean(message);
          return [message, eqn];
      }
    
    } else {
      return ['An unknown error occurred', eqn];
    }
  } 
}


export function validateValueBox(single: boolean, value: string): string[] {
  // this function is called by the ErrorPropagator component to validate both nominal and error values entered by the user
  // single is a boolean that indicates the value box is for a single value or for a variable (allows for nice recursion)
  // returns an array with two elements: the error message and the modified value: [error message, modified value]
  if (value === '') {
    return ['', '']; // no errors
  }
  if (single) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      const numElements = value.split(' ').length;
      if (numElements > 1) {
        return ['Constant error value must be a single number', value];
      }
      return ['Constant error value must be a number', value];
    }
  }

  // we have multiple values
  value = value.trim();
  value = value.replace(',', '');
  const errors = value.split('\n');
  if (!errors.some(e => validateValueBox(true, e)[0] != '')) { // if there is some error message that is invalid
    return ['Invalid error values provided', value];
  }
  return ['', value];
} // TODO: integrate this function into the ErrorPropagator component