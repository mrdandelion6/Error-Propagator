import React, { useEffect, useState } from "react";

interface NominalValueBoxProps {
  data: { members: string[] }; // Type annotation for data object
  handleSubmit: (event: React.FormEvent<HTMLFormElement>, inputData: string) => void; // Type annotation for handleSubmit function
}

function NominalValueBox({ data, handleSubmit }: NominalValueBoxProps) {
  const [inputData, setInputData] = useState("");

  return (
    <>
      <div>
        {typeof data.members === 'undefined' ? (
          <p>Loading...</p>
        ) : (
          data.members.map((member: any, i: any) => (
            <p key={i}>{member}</p>
          ))
        )}
      </div>

      <div>
        <form onSubmit={(e) => handleSubmit(e, inputData)}>
          <textarea
            name="input_data"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            cols={30}
            rows={10}
          ></textarea>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}

function App() {
  const [data, setData] = useState({ members: [] });
  const [response, setResponse] = useState<number | null>(null);

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
      <NominalValueBox
        data={data}
        handleSubmit={handleSubmit}
      />
      <NominalValueBox
        data={data}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default App;
