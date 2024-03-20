import React, { useEffect, useState } from "react";
import './ValueBox.scss';

interface ValueBoxProps { // interfaces can be used as a nice packing for types
    data: { members: string[] }; 
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, inputData: string) => void; 
}
  
function ValueBox({ data, handleSubmit }: ValueBoxProps) {
  const [inputData, setInputData] = useState("");
  return (
    <>
      <div>
        {typeof data.members === 'undefined' ? (
          <p>Loading...</p>
        ) : (
          data.members.map((member: string, i: number) => ( // callback for map(): callback(currentVal, index, array)
            <p key={i}>{member}</p>
          ))
        )}
      </div>

      <div>
        <form>
          <textarea
            className="valueBox"
            name="input_data"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            cols={30}
            rows={10}
          ></textarea>
          <br />
        </form>
      </div>
    </>
  );
}

  export default ValueBox;