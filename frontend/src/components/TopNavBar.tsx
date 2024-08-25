import React from 'react';
import { NavLink } from 'react-router-dom';
import './TopNavBar.scss';

const assets_path = "../assets/";
const buttons = {
  "names": ["Home", "About", "Discord", ],
  "links": ["/", "/about", "https://discord.gg/558RfzrPNj", ],
  "external": [0, 0, 1],
  "images": ["home.png", "about.png", "discord.png"],
  "left": [1, 0, 0],  
  "width": [70, 50, 50]
};

// add the assets path to the images
for (let i = 0; i < buttons.images.length; i++) {
  buttons.images[i] = assets_path + buttons.images[i];
}

function TopNavBar() {

  const loadImage = (index: number) => {
    return (
      <img
        src={buttons.images[index]}
        alt={buttons.names[index]}
        className="navImage"
      />
    );
  }

  return (
    <nav className="topNavBar">
      <ul>
        {buttons.names.map((name, index) => (
            <li
              className="navButton" 
              key={index} 
              style={{width: buttons.width[index] + "px"}}
            >
              {buttons.external[index] === 1 ? (
                <a href={buttons.links[index]} 
                target="_blank"
                rel="noopener noreferrer"
                >{loadImage(index)}</a>

              ) : ( 
                <NavLink to={buttons.links[index]}>{loadImage(index)}</NavLink>
              )}
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default TopNavBar;