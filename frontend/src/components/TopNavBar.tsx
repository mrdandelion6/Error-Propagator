import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TopNavBar.scss';
import homeImg from '../assets/scratch/error_propagator_3.png';
import clubLogoImg from '../assets/navbar/club_logo_2.png';
import aboutImg from '../assets/navbar/about.png';
import discordImg from '../assets/navbar/discord.png';
// import trayImg from '../assets/navbar/tray.png';
// import docsImg from '../assets/navbar/book.png';

interface Buttons {
  names: string[];
  links: string[];
  external: number[];
  images: (string | undefined)[];
  right: number[];
  width: number[];
  height: number[];
  spacing: number[];
  img_height: number[];
  highlight: number[];
}

const buttons: Buttons = {
  // these are all the settings for the buttons
  // i have them here in a json object so that it is very easy to modify and add new buttons
  // the order of the buttons is determined by the order of the names
  "names": ["Home", "Physics Club", "Docs", "About", "Pro", "Login", "Discord", ],
  "links": ["/", 
            "https://www.utm.utoronto.ca/cps/university-toronto-mississauga-physics-club",
            "/docs", 
            "/about",
            "/pro",
            "/login", 
            "https://discord.gg/558RfzrPNj"],
  "external": [0, 1, 0, 0, 0, 1],
  "images": [homeImg, 
             clubLogoImg,
             undefined, // undefined for text instead of image (uses text from Names)
             undefined,
             undefined,
             undefined,
             discordImg],
  "right": [0, 0, 1, 1, 1, 1, 1],  
  "width": [70, 350, 65, 65, 65, 120, 70], // in px for li
  "height": [56, 56, 30, 30, 30, 30, 56], // in px for li
  "spacing": [8, 8, 8, 8, 8, 8, 8], // in px for li, the left and right margin
  "img_height": [90, 90, 75, 60, 60, 60, 60], // in percentage, for scaling images inside the li
  "highlight": [0, 0, 0, 0, 0, 1, 0]
};

// the following button is used when the view width is less than 800px
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
      <li key={index}>
        { buttons.images[index] ? (
          <img 
            src={buttons.images[index]} 
            alt={buttons.names[index]} 
            style={{width: buttons.width[index] + "%", height: buttons.img_height[index] + "%"}  }
          />
        ) : (
          <p>{buttons.names[index]}</p> 
        )}
      </li>
    );
  }

  // we have buttons on the left and right
  const leftItems: JSX.Element[] = [];
  const rightItems: JSX.Element[] = [];

  buttons.names.forEach((_, index) => {
    const item = buttons.external[index] === 1 ? ( // external link, use classic html anchors
      <a href={buttons.links[index]}
        style=
        {{
          width: buttons.width[index] + "px",
          height: buttons.height[index] + "px",
          marginLeft: buttons.spacing[index] + "px",
          marginRight: buttons.spacing[index] + "px",
        }}
        key={index}
        target="_blank"
        rel="noopener noreferrer"
      >{loadLi(index)}</a>
    ) : ( // internal link, use react router
      <NavLink to={buttons.links[index]}
        style=
        {{width: buttons.width[index] + "px", 
          height: buttons.height[index] + "px",
          marginLeft: buttons.spacing[index] + "px",
          marginRight: buttons.spacing[index] + "px",
        }}
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
        <div className='navSideSpacing'></div>
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
      <div className='navSideSpacing'></div>
    </nav>
  );
}

export default TopNavBar;