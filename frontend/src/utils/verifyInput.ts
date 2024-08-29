import { Parser } from "expr-eval";

export function validateEquation(eqn: string, vars: string[]): string {
  /* 
    This function is called by the ErrorPropagator component to validate the equation entered by the user.
    It uses the expr-eval library to parse the equation and check for unknown variables.
    The function returns an error message if there are unknown variables or if the equation is invalid.
    The error message is displayed to the user in the ErrorPropagator component.
  */

  if (eqn === '') {
    return ''; // no errors
  }

  const clean = (message: string): string => {
    // console.log(message);

    if (message === "") {
      console.log('Unexpected empty string for error message');
      return message;
    }

    if (message.startsWith('parse error') && message.includes('Expected')) {
      const words = message.split(' ');
      message=words.slice(words.indexOf('Expected')).join(' ');
      const errorLocation = words[words.indexOf('Expected') -1].slice(0, -1);
      if ( errorLocation.endsWith(']') && errorLocation.startsWith('[') ) {
        message += ' at ' + errorLocation;
      }
    }
    const replaceItems: {[key: string]: string} = {
      'EOF' : "end of equation",
      'TPAREN' : "parenthesis",
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
    return 'Variable name conflicts with known constants';
  }
  vars = vars.concat(constants); // add constants to known variables
  const p = new Parser();
  try {
    const parsed = p.parse(eqn);
    const enteredVariables = parsed.variables();
    const unknownVars = enteredVariables.filter((v: string) => {
      return !vars.some(knownVar => new RegExp(`^\\d*${knownVar}$`).test(v));
    });
    if (unknownVars.length === 1) {
      return `Unknown variable: ${unknownVars[0]}`;
    }
    if (unknownVars.length > 1) {
      return `Unknown variables: ${unknownVars.join(', ')}`;
    }
    return ''; // no errors
  } catch (error) {
    if (error instanceof Error) {
      let message: string = error.message;
      // console.log(message);

      switch (message) {
        case "unexpected TEOF: EOF":
          return 'Unexpected end of equation';
        default:
          message = clean(message);
          return message;
      }
    
    } else {
      return 'An unknown error occurred';
    }
  }
}