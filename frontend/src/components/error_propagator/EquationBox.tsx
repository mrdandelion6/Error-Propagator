import './InputBoxes.scss';
import React, { useState } from "react";
// import validateEquation from '../../utils/validateEquation';

interface EquationBoxProps { // interfaces can be used as a nice packing for types 
  value: string;
  onChange: (value: string) => void;
  vars: string[];
}

function EquationBox({ value, onChange }: EquationBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringBar, setIsHoveringBar] = useState(false);

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.bottom - 7 <= clientY && clientY <= rect.bottom);

    setIsHoveringBar(isInsideElement);
  }

  return (
    <div className='noMP'>
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