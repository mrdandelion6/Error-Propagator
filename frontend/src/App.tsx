import React, { useEffect, useState } from "react";
import ValueBox from './components/ValueBox'
import EquationBox from './components/EquationBox'

function App() {
  const [data, setData] = useState({ members: [] });
  const [response, setResponse] = useState<number | null>(null);

  // trying some new stuff:
  const [textAreas, setTextAreas] = useState<string[]>(['']);

  const addNewTextArea = () => {
    setTextAreas([...textAreas, '']);
  };

  const handleTextChange = (index: number, value: string) => {
    const newTextAreaState = [...textAreas];
    newTextAreaState[index] = value; // update the state of the specific box
    setTextAreas(newTextAreaState);
  };

  const removeTextArea = (index: number) => {
    const newTextAreaState = [...textAreas];
    newTextAreaState.splice(index, 1); // splice removes 1 element starting at index (so basically same as .remove(index))
    setTextAreas(newTextAreaState);
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
    <p>Currently in development :)</p>
      <EquationBox />
      <button onClick={addNewTextArea}>Add Variable</button>
      <div className="valueBoxes">
        <ValueBox
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default App;