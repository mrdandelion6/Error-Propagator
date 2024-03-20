import React, { useEffect, useState } from "react";
import './EquationBox.scss';
import { Parser } from "expr-eval";

function validateEquation(eqn, eqnVars) {
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