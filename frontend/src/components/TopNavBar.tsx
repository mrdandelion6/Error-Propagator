import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import homeImg from '../assets/navbar/error.png';
import clubLogoImg from '../assets/navbar/club_logo_2.png';
import docsImg from '../assets/navbar/book.png';
import aboutImg from '../assets/navbar/about.png';
import discordImg from '../assets/navbar/discord.png';
// import trayImg from '../assets/navbar/tray.png';


import './TopNavBar.scss';

const buttons = {
  "names": ["Home", "Physics Club", "Docs", "About", "Discord", ],
  "links": ["/", 
            "https://www.utm.utoronto.ca/cps/university-toronto-mississauga-physics-club",
            "/Docs", 
            "/About", 
            "https://discord.gg/558RfzrPNj"],
  "external": [0, 1, 0, 0, 1],
  "images": [homeImg, clubLogoImg, docsImg, aboutImg, discordImg],
  "right": [0, 0, 1, 1, 1],  
  "width": [80, 350, 75, 75, 75], // in px
  "img_height": [80, 80, 75, 60, 50], // in percentage
};

// the following button is used when the view width is less than 650px
const buttonTray = {
  // always goes to the right
  "name": "Tray",
  "image": aboutImg, // replace with trayImg later
  "width": 100
}

function TopNavBar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const { pathname } = useLocation();

  const handleNavLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => {
    if (pathname === link) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth > 650) {
        setShowMenu(false);
      }
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
          <img 
            src={buttons.images[index]} 
            alt={buttons.names[index]} 
            style={{width: buttons.width[index] + "%", height: buttons.img_height[index] + "%"}}
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
        onClick={(e) => handleNavLinkClick(e, buttons.links[index])}
      >{loadLi(index)}</NavLink>
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