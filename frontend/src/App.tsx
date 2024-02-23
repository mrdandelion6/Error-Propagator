import { useEffect, useState } from "react"

function App() {
  
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

  return (
    <div>
      {(typeof data.members === 'undefined') ? (
        <p>Loading...</p> // if undefined
      ) : (
        data.members.map((member, i) => (
          <p key={i}>{member}</p>
        ))
      )}
    </div>
    )
}

export default App
