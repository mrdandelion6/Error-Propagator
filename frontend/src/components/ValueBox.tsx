import React, { useState } from "react";
import './InputBoxes.scss';
import deleteImage from '../assets/delete.png';

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
    
    const isInsideElement = (rect.right - 7 <= clientX && clientX <= rect.right) ||
                            (rect.bottom - 7 <= clientY && clientY <= rect.bottom - 1);

    setIsHoveringOverScrollbar(isInsideElement);
  }

  return (
    <div className="valueBoxPackage">
      <div className="valBoxHeader">
        <div className="deleteButton" onClick={() => del()}>
          <img src={deleteImage} alt="delete button" />
        </div>
      </div>
      <div className={isFocused ? "focusedBox" : ""}>
        <div className="valueCase">
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