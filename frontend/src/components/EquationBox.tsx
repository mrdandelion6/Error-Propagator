import './InputBoxes.scss';
import { Parser } from "expr-eval";
import React, { useState } from "react";

function validateEquation(eqn: string, eqnVars: {properties: string}) {
  const p = new Parser();
  try {
    p.evaluate(eqn, eqnVars);
    return true;
  } catch (error) {
    return false;
  }
}

interface EquationBoxProps { // interfaces can be used as a nice packing for types 
  value: string;
  onChange: (value: string) => void;
}

function EquationBox({ value, onChange }: EquationBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringBar, setIsHoveringBar] = useState(false);

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.bottom - 7 <= clientY && clientY <= rect.bottom);

    setIsHoveringBar(isInsideElement);
  }

  return (
    <div>
      <div className={ isFocused ? "equationCase focusedElement" : "equationCase"}>
        <textarea
          className={ isHoveringBar ? "equationBox hoveringScrollbar" : "equationBox"}
          name="equation"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          cols={1}
          rows={1}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          spellCheck="false"
          placeholder="Enter Equation"
          onMouseMove={(e) => scrollBarHoverCheck(e)}
        ></textarea>
        <br />
      </div>
  </div>
  );
}

export default EquationBox;