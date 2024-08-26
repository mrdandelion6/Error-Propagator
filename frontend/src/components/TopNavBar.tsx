import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import homeImg from '../assets/error.png';
import clubLogoImg from '../assets/club_logo_1.png';
import docsImg from '../assets/docs.png';
import aboutImg from '../assets/about.png';
import discordImg from '../assets/discord.png';
import trayImg from '../assets/tray.png';


import './TopNavBar.scss';

const assets_path = "../assets/";
const buttons = {
  "names": ["Home", "Physics Club", "Docs", "About", "Discord", ],
  "links": ["/", 
            "https://www.utm.utoronto.ca/cps/university-toronto-mississauga-physics-club",
            "/docs", 
            "/about", 
            "https://discord.gg/558RfzrPNj"],
  "external": [0, 1, 0, 0, 1],
  "images": [homeImg, clubLogoImg, docsImg, aboutImg, discordImg],
  "right": [0, 0, 1, 1, 1],  
  "width": [110, 200, 100, 100, 100]
};

// add the assets path to the images
for (let i = 0; i < buttons.images.length; i++) {
  buttons.images[i] = assets_path + buttons.images[i];
}

// the following button is used when the view width is less than 650px
const buttonTray = {
  // always goes to the right
  "name": assets_path + "Tray",
  "image": trayImg,
  "width": 100
}

function TopNavBar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // some classic js dom listening
    window.addEventListener('resize', handleResize);
    return () => { // cleanup function
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const loadLi = (index: number) => {
    return (
      <li key={index} 
      style={{
        width: buttons.width[index] + "px"
      }}>
          <img src={buttons.images[index]} 
            alt={buttons.names[index]} 
          />
      </li>
    );
  }

  // we have buttons on the left and right
  const leftItems: JSX.Element[] = [];
  const rightItems: JSX.Element[] = [];

  buttons.names.forEach((_, index) => {
    const item = buttons.external[index] === 1 ? ( // external link, use classic html anchors
      <a href={buttons.links[index]}
      key={index}
      target="_blank"
      rel="noopener noreferrer"
      >{loadLi(index)}</a>
    ) : ( // internal link, use react router
      <NavLink to={buttons.links[index]}
        key={index}
        className="navLink"
      >
        {loadLi(index)}
      </NavLink>
    );

    if (buttons.right[index]) {
      rightItems.push(item);
    } else {
      leftItems.push(item);
    }
  });

  return (
    <nav className="topNavBar">
      <ul>
        {leftItems}
        <div className="rightGroup">
          { windowWidth > 650 ? rightItems : 
            <div className="trayButton" onClick={toggleMenu}
              style={{width: buttonTray.width + "px"}}
            >
              <img src={buttonTray.image} alt={buttonTray.name} />
            </div>
          }
        </div>
      </ul>
      { showMenu ? null : null }
    </nav>
  );
}

export default TopNavBar;