import './InputBoxes.scss';
import React, { useState, useRef } from "react";

interface EquationBoxProps { // interfaces can be used as a nice packing for types 
  value: string;
  onChange: (value: string) => void;
  checkEquation: (value: string) => void;
  equationBadInputMessage: string;
}

function EquationBox({ value, onChange, checkEquation, equationBadInputMessage }: EquationBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.bottom - 7 <= clientY && clientY <= rect.bottom);

    setIsHoveringBar(isInsideElement);
  }

  const handleBlur = () => {
    setIsFocused(false);
    checkEquation(value);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      textareaRef.current?.blur();
    }
  }

  return (
    <div className='noMP'>
      <div className={ equationBadInputMessage !== '' ? "equationCase badInput" :
        (isFocused ? "equationCase focusedElement" : "equationCase") }>
        <textarea
          ref={textareaRef}
          className={ isHoveringBar ? "equationBox hoveringScrollbar" : "equationBox"}
          name="equation"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          cols={1}
          rows={1}
          onBlur={() => handleBlur()}
          onFocus={() => setIsFocused(true)}
          spellCheck="false"
          placeholder="Enter Equation"
          onMouseMove={(e) => scrollBarHoverCheck(e)}
          onKeyDown={(e) => handleKeyDown(e)}
        ></textarea>
      </div>
  </div>
  );
}

export default EquationBox;