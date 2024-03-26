import React, { useEffect, useState } from "react";
import ValueBox from './components/ValueBox'
import EquationBox from './components/EquationBox'

function App() {
  const [data, setData] = useState({ members: [] });
  const [response, setResponse] = useState<number | null>(null);

  type TextAreasState = {
    [key: string]: string;
  };

  // box component states:
  const [numBoxes, setNumBoxes] = useState<number>(1);
  const [textAreas, setTextAreas] = useState<TextAreasState>({'x': ''});
  const [equation, setEquation] = useState<string>('');
  const [variables, setVariables] = useState<string[]>(['x']);
  // TODO: figure out variable names and error boxes

  const addNewTextArea = () => {

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

    const s: string= determineVar(numBoxes);

    setVariables([...variables, s]);

    setTextAreas(prevState => {
      const newState = { ...prevState }; // using functional update pattern
      newState[s] = '';
      return newState;
    });
    console.log(textAreas);
  };

  const handleTextChange = (varX: string, value: string) => {
    const newTextAreaState = {...textAreas};
    newTextAreaState[varX] = value; // update the state of the specific box
    setTextAreas(newTextAreaState);
  };

  const removeTextArea = (varX: string) => {
    const newTextAreaState = {...textAreas};
    delete newTextAreaState[varX]; // delete the property from object    
    setTextAreas(newTextAreaState);
    const newVariables = [...variables];

    const indexToRemove = newVariables.indexOf(varX);
    if (indexToRemove !== -1) {
        newVariables.splice(indexToRemove, 1);
    }
    setVariables(newVariables);
    let num = numBoxes - 1;
    setNumBoxes(num);
  };

  const handleVarChange = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = value; // update the state of the specific box
    setVariables(newVariables);
  };

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

  return (
    <>
    <h1>Error Propagator</h1>
    <p>Currently in development :)</p>
      <EquationBox 
        value={equation}
        onChange={(value: string) => setEquation(value)}
      />
      <button onClick={addNewTextArea}>Add Variable</button>

      <div className="valueBoxes">

        {variables.map((key, index) => (
        <div key={index}>
          <ValueBox
            value={textAreas[key]}
            varX={key}
            onTextChange={(value: string) => handleTextChange(key, value)}
            onVarChange={(value: string) => handleVarChange(index, value)}
            del={() => removeTextArea(key)}
          />
        </div>
        ))}

      </div>

    </>
  );
}

export default App;