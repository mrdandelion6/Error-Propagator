import React, { useEffect, useState } from "react";
import './InputBoxes.scss';

interface ValueBoxProps { // interfaces can be used as a nice packing for types 
  value: string;
  onChange: (value: string) => void;
  del: () => void; // delete function
}

  
function ValueBox({ value, onChange, del }: ValueBoxProps) {
  const[isHoveringOverScrollbar, setIsHoveringOverScrollbar] = useState(false);
  const[isFocused, setIsFocused] = useState(false);

  const scrollBarHoverCheck = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    
    const isInsideElement = (rect.right - 10.2 <= clientX && clientX <= rect.right) ||
                            (rect.bottom - 10.2 <= clientY && clientY <= rect.bottom);

    setIsHoveringOverScrollbar(isInsideElement);
  }

  return (
    <div className="valueBoxPackage">
      <div className="valBoxHeader">
        <div className="deleteButton"
        onClick={() => del()}>
        </div>
      </div>
      <div className={isFocused ? "focusedBox" : ""}>
        <div className="inputBox">
          <textarea
            className={isHoveringOverScrollbar ? "valueBox hoveringScrollbar" : "valueBox"}
            name="input_data"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            cols={30}
            rows={10}
            spellCheck="false"
            onMouseMove={(e) => scrollBarHoverCheck(e)}
            onFocus={() => {setIsFocused(true)}}
            onBlur={() => {setIsFocused(false)}}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

  export default ValueBox;