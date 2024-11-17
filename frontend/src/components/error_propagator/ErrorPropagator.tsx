import { useEffect, useState } from "react";
import ValueBox from './ValueBox'
import EquationBox from './EquationBox'
import ResultBox from './ResultBox'
import './ErrorPropagator.scss';
import { validateExpression } from '../../utils/verifyInput';
import { getVariablesUsedInEquation } from '../../utils/verifyInput';
import openEye from '../../assets/error_propagator/open_eye2.png';
import closedEye from '../../assets/error_propagator/closed_eye2.png';
// import roundedIcon from '../../assets/error_propagator/rounded_icon.png';
// import notRoundedIcon from '../../assets/error_propagator/not_rounded_icon.png';


function ErrorPropagator() {

  // box component states:
  const [numBoxes, setNumBoxes] = useState<number>(1); // track the number of boxes
  const [equation, setEquation] = useState<string>();

  // TODO: implement result rounding option with a toggle button
  // make sure to use setRoundResult to update the state
  interface InputCounts {
    [key: string]: number[];
    // this is a dictionary where the key is the variable name and the value is an array of two numbers
    // the first number is the number of nominal values and the second number is the number of error values
  }

  const [roundResult, _] = useState<boolean>(false);
  const [constErrors, setConstErrors] = useState<boolean[]>([true]); // keep track if we have constant or variable error
  const [variables, setVariables] = useState<string[]>(['x']);
  const [nominalValues, setNominalValues] = useState<string[]>(['']);

  // we have two sets of errors, one for when the error is constant and one for when the error is variable
  const [errorValuesVariable, setErrorValuesVariable] = useState<string[]>(['']);
  const [errorValuesConstant, setErrorValuesConstant] = useState<string[]>(['']);

  const [failedPropagationMessage, setFailedPropagationMessage] = useState<string>('');
  const [equationBadInputMessage, setEquationBadInputMessage] = useState<string>('');
  const [invalidInputs, setInvalidInputs] = useState<string[]>(['']);

  // for when we send a propagation request to the python backend
  const [showResponse, setShowResponse] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(true);
  const [responseNominalValues, setResponseNominalValues] = useState<string[]>([]);
  const [responseErrorValues, setResponseErrorValues] = useState<string[]>([]);

  const updateNominalValues = (index: number, newNominalValue: string) => {
    const newNominalValuesList = [...nominalValues];
    newNominalValuesList[index] = newNominalValue;
    setNominalValues(newNominalValuesList);
  }

  const updateErrorValuesVariable = (index: number, newErrorValue: string) => {
    const newErrorValuesVariable = [...errorValuesVariable];
    newErrorValuesVariable[index] = newErrorValue;
    setErrorValuesVariable(newErrorValuesVariable);
  }

  const updateErrorValuesConstant = (index: number, newErrorValue: string) => {
    const newErrorValuesConstant = [...errorValuesConstant];
    newErrorValuesConstant[index] = newErrorValue;
    setErrorValuesConstant(newErrorValuesConstant);
  }

  const updateConstErrors = (index:number, newConstError: boolean) => {
    // update the array which keeps track of which boxes have constant errors
    const newConstErrorsList = [...constErrors];
    newConstErrorsList[index] = newConstError;
    setConstErrors(newConstErrorsList);
  }

  const determineVar = (numberLabel: number): string => {
    
    let s: string = 'x'; // determine the new variable to add
    switch (true) {
      case !variables.includes('x'):
        break;
      case !variables.includes('y'):
        s = 'y';
        break;
      case !variables.includes('z'):
        s = 'z';
        break;
      default:
        s += (numberLabel - 3);
        break;  
    }
    
    if (variables.includes(s)) {
      return determineVar(numberLabel + 1);
    }
  
    return s;
  }

  const addValueBox = () => {
    // add a variable to the list of variables
    setNumBoxes(numBoxes + 1);
    const s: string = determineVar(numBoxes);
    setVariables([...variables, s]);
    setNominalValues([...nominalValues, '']);
    setErrorValuesVariable([...errorValuesVariable, '']);
    setErrorValuesConstant([...errorValuesConstant, '']);
    setConstErrors([...constErrors, true]);
  };


  const removeValueBox = (index: number) => {
    const newVariables = [...variables];
    const newNominalValues = [...nominalValues];
    const newErrorValuesVariable = [...errorValuesVariable];
    const newErrorValuesConstant = [...errorValuesConstant];
    const newConstErrors = [...constErrors];
    if (index !== -1) {
        newVariables.splice(index, 1);
        newNominalValues.splice(index, 1);
        newErrorValuesVariable.splice(index, 1);
        newErrorValuesConstant.splice(index, 1);
        newConstErrors.splice(index, 1);
    }
    setVariables(newVariables);
    setNominalValues(newNominalValues);
    setErrorValuesVariable(newErrorValuesVariable);
    setErrorValuesConstant(newErrorValuesConstant);
    setConstErrors(newConstErrors);
    setNumBoxes(numBoxes - 1);
  };

  const updateVariables = (index: number, value: string) => {
    // update the list of variables
    const newVariables = [...variables];
    newVariables[index] = value; // update the state of the specific box
    setVariables(newVariables);
  };

  const updateInvalidInputs = (index: number, invalidInput: string) => {
    // update the list of invalid inputs
    const newInvalidInputs = [...invalidInputs];
    newInvalidInputs[index] = invalidInput;
    setInvalidInputs(newInvalidInputs);
  }

  
  const propagateRequest = async () => {
    // Handle the propagation request by sending a POST request to the backend.
    interface PropagationResponse {
      errors: string[]; 
      nominals: string[]; 
    }

    interface ErrorPropagatorRequest {
      equation: string | undefined;
      variables: string[];
      nominalValues: string[];
      errorValuesVariable: string[];
      errorValuesConstant: string[];
      constErrors: boolean[];
      roundResult: boolean;
    }

    const url = "/api/process/";

    const usedVariablesBitmap = getVariablesUsedInEquation(variables, equation ?? '');
    const filteredVariables = variables.filter((_, index) => {
      const nominalValue = nominalValues[index];
      return nominalValue !== '' && usedVariablesBitmap[index];
    });

    const requestBody: ErrorPropagatorRequest = {
      equation, 
      variables: filteredVariables, 
      nominalValues, 
      errorValuesVariable, 
      errorValuesConstant, 
      constErrors,
      roundResult,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data: PropagationResponse = await response.json();
        setResponseErrorValues(data['errors']);
        setResponseNominalValues(data['nominals']);
        setShowResponse(true);
      } else {
        console.error("Server returned an error:", response.statusText);
      }
    } catch (error) {
      console.error(`Form error: ${error}`);
    }
  };

  const getInputCounts = (): InputCounts => {
    const inputCounts: InputCounts = {};
    for (const i in variables) {
      const noms = nominalValues[i].split('\n');
      // remove any first or last empty strings
      if (noms[0] === '') {
        noms.shift();
      }
      if (noms[noms.length - 1] === '') {
        noms.pop();
      }
      const nomsCount = noms.length;
      let errorsCount = -1;
      if (!constErrors[i]) {
        const errors = errorValuesVariable[i].split('\n');
        if (errors[0] === '') {
          errors.shift();
        }
        if (errors[errors.length - 1] === '') {
          errors.pop();
        }
        errorsCount = errors.length;
      }
      inputCounts[variables[i]] = [nomsCount, errorsCount];
    }
    return inputCounts;
  }

  const handleEquationChange = (value: string) => {
    // validate the equation
    const inputCounts = getInputCounts();
    const equationResult = validateExpression(value, variables, inputCounts)[0];
    console.log("equation result: ", equationResult);
    setEquationBadInputMessage(equationResult);
    const newEquation = validateExpression(value, variables, inputCounts)[1];
    setEquation(newEquation);
    if (failedPropagationMessage !== '') {
      updatePropagationMessage();
    }
  };

  useEffect(() => {
    // this is a side use effect to double check if the equation has been fixed after the variables have been updated
    // the main checks is called by the EquationBox component
    if (equationBadInputMessage !== '') {
      handleEquationChange(equation ?? '');
    }
  } , [variables, nominalValues, errorValuesVariable, errorValuesConstant, constErrors, equation]);

  const checkCell = (index: number): string => {
    // verify if there are any issues with the input in the cell
    if (invalidInputs[index] !== '') {
      return "Variable " + variables[index] + ": " + invalidInputs[index].toLowerCase();
    }

    // empty input checks
    if (nominalValues[index] === '') {
      return `Variable ${variables[index]}: nominal value is empty.`;
    }
    if (constErrors[index] && errorValuesConstant[index] === '') {
      return `Variable ${variables[index]}: constant error value are empty.`;
    }
    if (!constErrors[index] && errorValuesVariable[index] === '') {
      return `Variable ${variables[index]}: error value are empty.`;
    }

    return "";
  }

  const checkErrors = (): string => {
    if (equationBadInputMessage !== '') {
      return equationBadInputMessage;
    }
    if (equation === undefined || equation === '') {
      return "Equation is empty.";
    }
    if (variables.length === 0) {
      return "No variables have been added.";
    }

    // check equation additionally
    const inputCounts = getInputCounts();
    const equationResult = validateExpression(equation ?? '', variables, inputCounts)[0];
    if (equationResult !== '') {
      return equationResult
    }

    const bitMap = getVariablesUsedInEquation(variables, equation ?? '');
    // returns an array of booleans, where true means that the variable is used in the equation
    for (let i = 0; i < variables.length; i++) {
      if (bitMap[i]) { // check if the cell for the variable is proper
        if (checkCell(i) !== '') {
          return checkCell(i);
        }
      }
    }

    return '';
  };

  
  const updatePropagationMessage = (): string => {
    const issues = checkErrors();
    console.log("issues: ", issues);
    setFailedPropagationMessage(issues);
    return issues;
  }

  const handlePropagation = () => {
    const issues = updatePropagationMessage();
    if (issues === '') {
      propagateRequest();
    }
  };

  return (
    <div className="main">
      <h1>Error Propagator</h1>
      <p>Currently in development :)</p>
        <EquationBox 
          value={equation ?? ''}
          onChange={(value: string) => setEquation(value)}
          checkEquation={(value: string) => handleEquationChange(value)}
          equationBadInputMessage={equationBadInputMessage}
        />
        { equationBadInputMessage !== '' && 
          <p className="badInputMessage">{equationBadInputMessage}</p>
        }
        <div className="noMP propagatorButtons">
          <button onClick={addValueBox}>Add Variable</button>
          <button className="propagationBtn" onClick={handlePropagation}>Propagate</button>
        </div>
        {
          failedPropagationMessage !== '' &&
          <p className="badInputMessage failedPropagation">{failedPropagationMessage}</p>
        }

        {
        showResponse && 
        <div className="responseContainer">
          <div className="responseHeader">
            <h2 className="responseTitle">{showFullResponse ? "Calculated Values" : "Calculated Values..."}</h2>
            <div className="toggleFullResponse"
              onClick={() => setShowFullResponse(!showFullResponse)}>
              <img
                src={showFullResponse ?  openEye : closedEye}
                alt="toggle response"
                style={{width: "40px", height: "40px"}}
              />
            </div>
            { // TODO: implement rounding option
            /* <div className="roundResult"
              onClick={() => setRoundResult(!roundResult)}>
              <img
                src={roundResult ? roundedIcon : notRoundedIcon}
                alt="round result"
                style={{width: "20px", height: "20px"}}
              />
            </div> */
            }
          </div>
          { 
            showFullResponse && <div className="response">
              <ResultBox
                nominalValues={responseNominalValues}
                errorValues={responseErrorValues}
              />
            </div>
          }
        </div>
        }

        { 
          numBoxes > 0 ? (
          <div className="valueBoxes">
            {variables.map((_, index) => (
            <div key={index} className="noMP">
              <ValueBox
                variableName={variables[index]}
                otherVariableNames={variables.filter((_, i) => i !== index)}
                onBoxDelete={() => removeValueBox(index)}
                updateVariables={(value: string) => updateVariables(index, value)}
                updateNominalValues={(nominalValue: string) => updateNominalValues(index, nominalValue)}
                updateErrorValuesVariable={(errorValue: string) => updateErrorValuesVariable(index, errorValue)}
                updateErrorValuesConstant={(errorValue: string) => updateErrorValuesConstant(index, errorValue)}
                updateConstErrors={(constError: boolean) => updateConstErrors(index, constError)}
                updateInvalidInputs={(invalidInput: string) => updateInvalidInputs(index, invalidInput)}
              />
            </div>
            ))}
          </div>
          ) : ( <><p className="noVarsMessage">Wow, it's looking empty here! To start, click "Add Variable".</p>
            <p style={{ marginTop: "10px"}}>Read the <strong>docs</strong> for help.</p></>
        )}
      </div>
  );
}

export default ErrorPropagator;