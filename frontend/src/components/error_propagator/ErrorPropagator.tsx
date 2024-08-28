import React, { useEffect, useState } from "react";
import ValueBox from './ValueBox'
import EquationBox from './EquationBox'
import './ErrorPropagator.scss';

function ErrorPropagator() {

  // eslint-disable-next-line
  const [data, setData] = useState({ members: [] });
  // eslint-disable-next-line
  const [response, setResponse] = useState<number | null>(null);

  // box component states:
  const [numBoxes, setNumBoxes] = useState<number>(1); // track the number of boxes
  const [equation, setEquation] = useState<string>();

  const [constErrors, setConstErrors] = useState<boolean[]>([true]); // keep track if we have constant or variable error
  const [variables, setVariables] = useState<string[]>(['x']);
  const [nominalValues, setNominalValues] = useState<string[]>(['']);

  // we have two sets of errors, one for when the error is constant and one for when the error is variable
  const [errorValuesVariable, setErrorValuesVariable] = useState<string[]>(['']);
  const [errorValuesConstant, setErrorValuesConstant] = useState<string[]>(['']);

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
    // ensure that it is a single value
    const flags = [",", " ", "\n", "\t"];
    if (flags.some(flag => newErrorValue.includes(flag))) {
      console.log("Error: constant error value must be a single value");
      return;
    }
    if (isNaN(Number(newErrorValue))) {
      // TODO: add functionality for red squiggly line and do not allow submission
      console.log("Error: constant error value must be a number");
      return;
    }
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
    // console.log(`changing variable ${value}`);
    const newVariables = [...variables];
    newVariables[index] = value; // update the state of the specific box
    setVariables(newVariables);
  };

  /////////////////////////////////////////////
  // this is for testing and can be deleted later
  useEffect(() => {
    // fetch data from API
    fetch("api/members")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setData(data);
        // console.log(data);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }, []);

  // alter this to actually deal with data from several things
  // eslint-disable-next-line
  const handleSubmit = async (event: React.FormEvent, inputData: string) => {
    event.preventDefault();
    console.log(`pressed sub:\n${inputData}`);

    try {
      const response = await fetch("api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_data: inputData }),
      });
  
      if (response.ok) {
        const data: number = await response.json();
        setResponse(data);
        console.log(data);
      } else {
        console.error("Server returned an error:", response.statusText);
      }
    } catch (error) {
      console.error(`Form error: ${error}`);
    }
  };

  const handlePropagation = () => {
    // TODO: if there are no issues with the input, propagate the error by making a POST request to the server
  };

  /////////////////////////////////////////////

  return (
    <div className="main">
      <h1>Error Propagator</h1>
      <p>Currently in development :)</p>
        <EquationBox 
          value={equation ?? ''}
          onChange={(value: string) => setEquation(value)}
          vars={variables}
        />
        <div className="noMP propagatorButtons">
          <button onClick={addValueBox}>Add Variable</button>
          <button className="propagationBtn" onClick={handlePropagation}>Propagate</button>
        </div>

        <div className="valueBoxes">
          {variables.map((_, index) => (
          <div key={index} className="noMP">
            <ValueBox
              variableName={variables[index]}
              onBoxDelete={() => removeValueBox(index)}
              updateVariables={(value: string) => updateVariables(index, value)}
              updateNominalValues={(nominalValue: string) => updateNominalValues(index, nominalValue)}
              updateErrorValuesVariable={(errorValue: string) => updateErrorValuesVariable(index, errorValue)}
              updateErrorValuesConstant={(errorValue: string) => updateErrorValuesConstant(index, errorValue)}
              updateConstErrors={(constError: boolean) => updateConstErrors(index, constError)}
            />
          </div>
          ))}
        </div>
      </div>
  );
}

export default ErrorPropagator;