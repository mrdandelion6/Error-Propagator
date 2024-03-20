import React, { useEffect, useState } from "react";

function EquationBox() {
    const [inputData, setInputData] = useState("");
    return (
      <div>
      <form>
        <textarea
          name="equation"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          cols={30}
          rows={10}
        ></textarea>
        <br />
      </form>
    </div>
    );
  }

  export default EquationBox;