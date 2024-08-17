import React, { useEffect, useState } from "react";
import ValueBox from './components/ValueBox'
import EquationBox from './components/EquationBox'

function App() {

  // eslint-disable-next-line
  const [data, setData] = useState({ members: [] });

  // eslint-disable-next-line
  const [response, setResponse] = useState<number | null>(null);

  type TextAreasState = {
    [key: string]: string | number; // figure out if we ever want numeric errors
  };

  // box component states:
  const [numBoxes, setNumBoxes] = useState<number>(1); // track the number of boxes
  const [nominalValues, setNominalValues] = useState<TextAreasState>({'x': ''}); // track the state of the text areas for actual values
  const [errorValues, setErrorValues] = useState<TextAreasState>({'x': '1'}); // track the state of the text areas for error values

  const [equation, setEquation] = useState<string>();
  const [variables, setVariables] = useState<string[]>([]);
  // TODO: figure out error boxes

  const determineVar = (num: number): string => {
    console.log(numBoxes);
    
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
        s += (num - 2);
        break;
    }
    
    if (variables.includes(s)) {
      return determineVar(num + 1);
    }
         
    num ++;
    setNumBoxes(num);
    return s;
  }

  const addValueBox = () => {
    // add a new value box to the list of boxes to be rendered

    // add a variable to the list of variables
    const s: string = determineVar(numBoxes);
    setVariables([...variables, s]);

    // add a new string to the list of nominal values
    setNominalValues(prevState => {
      const newState = { ...prevState }; // using functional update pattern
      newState[s] = '';
      return newState;
    });
    
    // add a new string/number to the list of error values
    setErrorValues(prevState => {
      const newState = { ...prevState }; // using functional update pattern
      newState[s] = 1;
      return newState;
    });

  };


  const removeValueBox = (varX: string) => {
    const newNominalValueState = {...nominalValues};
    const newErrorValueState = {...errorValues};

    delete newNominalValueState[varX]; // delete the property from nominal values    
    delete newErrorValueState[varX]; // delete the property from error values    
    setNominalValues(newNominalValueState);
    setErrorValues(newErrorValueState);
    
    const newVariables = [...variables];
    const indexToRemove = newVariables.indexOf(varX);
    if (indexToRemove !== -1) {
        newVariables.splice(indexToRemove, 1);
    }
    setVariables(newVariables);
    setNumBoxes(numBoxes - 1);
  };

  const handleVarChange = (index: number, value: string) => {

    // update the nominal and error keys
    const newNominalValueState = {...nominalValues};
    const newErrorValueState = {...errorValues};
    
    // update existing nominal value keys
    newNominalValueState[value] = newNominalValueState[variables[index]];
    delete newNominalValueState[variables[index]]; // delete the old property from nominal values
    setNominalValues(newNominalValueState);

    // update existing error value keys
    newErrorValueState[value] = newErrorValueState[variables[index]];
    delete newErrorValueState[variables[index]]; // delete the old property from nominal values
    setNominalValues(newErrorValueState);

    // update the list of variables
    const newVariables = [...variables];
    newVariables[index] = value; // update the state of the specific box
    setVariables(newVariables);

  };

  const handleValChange = (varX: string, value: string) => {
    const newTextAreaState = {...nominalValues};
    newTextAreaState[varX] = value; // update the state of the specific box
    setNominalValues(newTextAreaState);
  };

  const handleErrChange = (varX: string, errors: string) => {
    const newTextAreaState = {...errorValues};
    newTextAreaState[varX] = errors; // update the state of the specific box
    setErrorValues(newTextAreaState);
  };

  // eslint-disable-next-line
  function errorButton(varX: string) { // implement error button reaction
    // when users click the error change button which swaps between constant error and variable error
    
  }

  // get rid of this eslint warning later
  useEffect(() => {
    addValueBox();
  }, []);

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
        console.log(data);
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

  /////////////////////////////////////////////

  return (
    <>
    <h1>Error Propagator</h1>
    <p>Currently in development :)</p>
      <EquationBox 
        value={equation ?? ''}
        onChange={(value: string) => setEquation(value)}
      />
      <button onClick={addValueBox}>Add Variable</button>

      <div className="valueBoxes">

        {variables.map((key, index) => (
        <div key={index}>
          <ValueBox
            errX={errorValues[key] as string}
            value={nominalValues[key] as string}
            varX={key}
            onValChange={(value: string) => handleValChange(key, value)}
            onVarChange={(value: string) => handleVarChange(index, value)}
            onErrChange={(value: string) => handleErrChange(key, value)}
            del={() => removeValueBox(key)}
            errorPress={() => errorButton(key)}
          />
        </div>
        ))}

      </div>

    </>
  );
}

export default App;