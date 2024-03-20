import React, { useEffect, useState } from "react";
import './InputBoxes.scss';

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, inputData: string) => void; 
}
  
function ValueBox({ handleSubmit }: ValueBoxProps) {
  const [inputData, setInputData] = useState("");
  return (
    <>
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