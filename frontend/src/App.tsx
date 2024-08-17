import React, { useEffect, useState } from "react";
import ValueBox from './components/ValueBox'
import EquationBox from './components/EquationBox'

function App() {

  // eslint-disable-next-line
  const [data, setData] = useState({ members: [] });

  // eslint-disable-next-line
  const [response, setResponse] = useState<number | null>(null);


  // box component states:
  const [numBoxes, setNumBoxes] = useState<number>(1); // track the number of boxes
  const [equation, setEquation] = useState<string>();
  const [variables, setVariables] = useState<string[]>([]);
  const [nominalValues, setNominalValues] = useState<string[]>([]);
  const [errorValues, setErrorValues] = useState<string[]>([]);
  const [constErrors, setConstErrors] = useState<boolean>(true); // keep track if we have constant or variable error

  updateNominalValues = (newNominalValues: string[]) => {

  }

  updateErrorValues = (newErrorValues: string[]) => {

  }

  updateConstErrors = (newConstError: boolean) => {

  }

  const determineVar = (num: number): string => {
    
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
  };


  const removeValueBox = (varX: string) => {
    const newVariables = [...variables];
    const indexToRemove = newVariables.indexOf(varX);
    if (indexToRemove !== -1) {
        newVariables.splice(indexToRemove, 1);
    }
    setVariables(newVariables);
    setNumBoxes(numBoxes - 1);
  };

  const handleVarChange = (index: number, value: string) => {
    // update the list of variables
    const newVariables = [...variables];
    newVariables[index] = value; // update the state of the specific box
    setVariables(newVariables);
  };


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
            onVarChange={(value: string) => handleVarChange(index, value)}
            onBoxDelete={() => removeValueBox(key)}
            variableName={variables[index]}
          />
        </div>
        ))}

      </div>

    </>
  );
}

export default App;