import React, { useEffect, useState } from "react";
import './InputBoxes.scss';
import { Parser } from "expr-eval";

function validateEquation(eqn: string, eqnVars: {properties: string}) {
  const p = new Parser();
  try {
    p.evaluate(eqn, eqnVars);
    return true;
  } catch (error) {
    return false;
  }
}

function EquationBox() {
  const [inputData, setInputData] = useState("");
  return (
    <div>
    <form>
      <textarea
        className="equationBox"
        name="equation"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        cols={1}
        rows={1}
        onBlur={() => console.log("ya")}
        spellCheck="false"
      ></textarea>
      <br />
    </form>
  </div>
  );
}

export default EquationBox;