import { Parser } from "expr-eval";

const constants = ['pi', 'e'];

function preprocessEquation(eqn: string): string {
  // use regex to modify the equation and add * between the coefficient and the variable if there exist any coefficients with no space, e.g) 2x -> 2*x

  eqn = eqn.trim();
  const regex = /(?<![a-zA-Z0-9])(\d+(?:\.\d+)?)([a-zA-Z]+)/g;
  eqn = eqn.replace(regex, '$1*$2');

  return eqn;
}

export function validateEquation(eqn: string, vars: string[]): string[] {
  /* 
    This function is called by the ErrorPropagator component to validate the equation entered by the user.
    It uses the expr-eval library to parse the equation and check for unknown variables.
    The function returns an error message if there are unknown variables or if the equation is invalid.
    The error message is displayed to the user in the ErrorPropagator component.
    Returns an array with two elements: the error message and the modified equation: [error message, modified equation]
  */

  eqn = eqn.trim();


  const clean = (message: string): string => {
    // this function cleans up the error message returned by the parser and makes it more user-friendly

    if (message === "") {
      console.log('Unexpected empty string for error message');
      return message;
    }

    message = message.toLowerCase();
    message = message.trim();
    // console.log("message is: ", message);
    

    if (message.startsWith('parse error')) {
      const words = message.split(' ');
      if (message.includes('expected')) {
        message=words.slice(words.indexOf('expected')).join(' ');
        const errorLocation = words[words.indexOf('expected') -1].slice(0, -1);
        if ( errorLocation.endsWith(']') && errorLocation.startsWith('[') ) {
          message += ' at character ' + errorLocation.slice(errorLocation.indexOf(':') + 1, errorLocation.indexOf(']'));
        }
      }
      else {
        if (words.length > words.indexOf('error') + 2) {
          message = words.slice(words.indexOf('error') + 2).join(' ');
        }
      }
    }
    const replaceItems: {[key: string]: string} = {
      'eof' : "end of equation",
      'tparen' : "parenthesis",
      'top' : "operator",
      'tnumber' : "number",
      'tbracket': "bracket",
      'unknown character': 'invalid character',
    }
    for (const x in replaceItems) {
      if (Object.prototype.hasOwnProperty.call(replaceItems, x)) {
        message = message.replace(new RegExp(x, 'g'), replaceItems[x]);
        
        if (x == 'tparen')  {
          message = message.replace(/[:\s(]+$/, '');
          message = message.replace(/[:\s)]+$/, '');
        }
      }
    }
    message = message.trim();
    message = message.charAt(0).toUpperCase() + message.slice(1);
    return message;
  }

  if (vars.some(v => constants.includes(v))) {
    return ['Variable name conflicts with known constants: ' + constants.join(', '), eqn];
  }
  vars = vars.concat(constants); // add constants to known variables
  const p = new Parser();
  try {
    eqn = preprocessEquation(eqn); // clean up the equation
    if (eqn === '') {
      return ['Empty equation', ''];
    }

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


export function validateValueBox(single: boolean, value: string, isError: boolean=true): string[] {
  // this function is called by the ValueBox component to validate both nominal and error values entered by the user
  // returns an array with two elements: the error message and the modified value: [error message, modified value]
  // value: the value to be validated
  // single: a boolean that indicates the value box is for a single value or for a variable (allows for nice recursion)
  
  value = value.replace(',', '');
  value = value.trim();
  if (value === '') {
    const errorType = isError ? 'error' : 'nominal';
    return [single ? `Empty ${errorType} field` : `Empty ${errorType} fields`, ''];
  }
  
  if (single) {
    if (['\n', '\t', ' '].some(flag => value.includes(flag))) {
      return ['Constant error value must be a single number', value];
    }
    if (isNaN(Number(value))) {
      return ['Constant error value must be a number', value];
    }
    return ['', value]; // no errors
  }
``
  // we have multiple values
  const errors = value.split('\n');
  // console.log("we have errors in multiple values");
  
  if (errors.some(e => validateValueBox(true, e)[0] != '')) { // if there is some error message that is invalid
    if (isError) {
      return ['Invalid error values provided', value];
    }
    return ['Invalid nominal values provided', value];
  }
  return ['', value];
} 

export function validateVariable(existingVariable: string, existingVars: string[]): string[] {
  existingVariable = existingVariable.trim();
  
  if (constants.includes(existingVariable)) {
    return ['Variable name conflicts with known constants: ' + constants.join(', '), existingVariable];
  }

  const regex = /^[a-zA-Z]([a-zA-Z0-9]?)+$/
  if (!regex.test(existingVariable)) {
    return ['Variable name must be alphanumeric and begin with letter', existingVariable];
  }

  if (existingVars.includes(existingVariable)) {
    return ['Variable already exists', existingVariable];
  }

  return ['', existingVariable];
}

export function getVariablesUsedInEquation(variables: string[], equation: string): boolean[] {
  // this function is called by the ErrorPropagator component to check which variables are used in the equation
  // returns an array of booleans, where true means that the variable is used in the equation
  equation = preprocessEquation(equation);
  if (equation === '') {
    return variables.map(() => false);
  }
  const p = new Parser();
  const parsed = p.parse(equation);
  const enteredVariables: string[] = parsed.variables();
  return variables.map(v => enteredVariables.includes(v));
}

// LONGTERM TODO: consider offloading the validation checks to the backend when input size is past a certain threshold
// maybe 20,000 characters or so (test this on crappy hardware)