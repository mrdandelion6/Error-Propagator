import { useEffect, useState } from "react"

function App() {
  
  
  // === SAMPLE ===
  const [data, setData] = useState({ members: [] })

  useEffect(() => {
    // fetch data from 5000 where app.py is
    fetch("http://localhost:5000/members") // not sure how to avoid entering full URL using proxy
      .then(res => {
        if (!res.ok) { // error handling
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); // return json result
      })
      .then(data => {
        setData(data);
        console.log(data);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
  }, []);
   // add empty array at end of useEffect to ensure it only runs once
  // === SAMPLE ===


  // === PROCESS TEXTAREA DATA ===

  const [inputData, setInputData] = useState("");
  const [response, setResponse] = useState<number | null>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`pressed sub:\n${inputData}`);

    try {
      const response = await fetch("http://localhost:5000/submit", {
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
  // === PROCESS TEXTAREA DATA ===

  return (
    <>
    <div>
      {(typeof data.members === 'undefined') ? (
        <p>Loading...</p> // if undefined
      ) : (
        data.members.map((member, i) => (
          <p key={i}>{member}</p>
        ))
      )}
    </div>

    <div>
      <form onSubmit={handleSubmit}>
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
};

export default App
