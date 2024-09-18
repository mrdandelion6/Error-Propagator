import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TopNavBar.scss';
import homeImg from '../assets/scratch/error_propagator_3.png';
import clubLogoImg from '../assets/navbar/club_logo_2.png';
import trayImg from '../assets/navbar/tray.png';
import discordImg from '../assets/navbar/discord.png';
import clubLogoSmall from '../assets/navbar/club_logo_3.png';
// import docsImg from '../assets/navbar/book.png';

interface Buttons {
  names: string[];
  links: (string | undefined)[];
  external: number[];
  images: (string | undefined)[];
  smaller_images: (string | undefined)[];
  right: number[];
  width: number[];
  small_width: number[];
  height: number[];
  spacing: number[];
  img_height: number[];
  special_btn: number[];
}

const buttons: Buttons = {
  // these are all the settings for the buttons
  // i have them here in a json object so that it is very easy to modify and add new buttons
  // the order of the buttons is determined by the order of the names
  "names": ["Home", "Physics Club", "Docs", "About", "Pro", "Login", "Discord", "Tray"],
  "links": ["/", 
            "https://www.utm.utoronto.ca/cps/university-toronto-mississauga-physics-club",
            "/docs", 
            "/about",
            "/pro",
            "/login", 
            "https://discord.gg/558RfzrPNj",
            undefined],
  "external": [0, 1, 0, 0, 0, 0, 1, 0],
  "images": [homeImg, 
             clubLogoImg,
             undefined, // undefined for text instead of image (uses text from Names)
             undefined,
             undefined,
             undefined,
             discordImg,
             trayImg],
  "smaller_images": [homeImg, clubLogoSmall, undefined, undefined, undefined, undefined, discordImg, trayImg],
  "right": [0, 0, 1, 1, 1, 1, 1, 1, 1],  
  "width": [70, 350, 73, 73, 73, 120, 70, 55], // in px for li
  "small_width": [70, 200, 73, 73, 73, 120, 70, 55], // in px for li
  "height": [56, 56, 36, 36, 36, 36, 56, 55], // in px for li
  "spacing": [2, 2, 2, 2, 2, 2, 2, 2], // in px for li, the left and right margin
  "img_height": [90, 90, 75, 60, 60, 60, 50, 100], // in percentage, for scaling images inside the li
  "special_btn": [0, 0, 0, 0, 0, 1, 0, 0], // special buttons get a unique background color
};

function TopNavBar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [rightItems, setRightItems] = useState<JSX.Element[]>([]);
  const [leftItems, setLeftItems] = useState<JSX.Element[]>([]);
  const [trayItems, setTrayItems] = useState<JSX.Element[]>([]); // for when we collapse the menu
  const numLeftItems = 2; // number of items on the left side of the navbar. used for knowing the right items
  const swapSmallLogoUnder = 670; // when to swap the logo for a smaller version


  const handleNavLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => {
    if (link === "/") {
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
      if (windowWidth > swapSmallLogoUnder) {
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
      <li key={index} className={buttons.special_btn[index] ? "specialBtn" : ""}>
        { buttons.images[index] ? (
          windowWidth > swapSmallLogoUnder ?
          (<img 
            src={buttons.images[index]} 
            alt={buttons.names[index]} 
            style={{width: buttons.width[index] + "%", height: buttons.img_height[index] + "%"}  }
          />) 
          : 
          (<img 
            src={buttons.smaller_images[index]} 
            alt={buttons.names[index]} 
            style={{width: buttons.width[index] + "%", height: buttons.img_height[index] + "%"}  }
          />)
        ) : (
          <p>{buttons.names[index]}</p>
        )}
      </li>
    );
  }

  useEffect(() => {
    const leftItems: JSX.Element[] = [];
    const rightItems: JSX.Element[] = [];
    const trayItems: JSX.Element[] = [];

    buttons.names.forEach((_, index) => {
      const link = buttons.links[index];
      if (link === undefined) {
        return;
      }
      const item = link.startsWith('http') ? (
        <a href={buttons.links[index]}
          style={{
            width: (windowWidth > swapSmallLogoUnder) ? (buttons.width[index] + "px") : (buttons.small_width[index] + "px"),
            height: buttons.height[index] + "px",
            marginLeft: buttons.spacing[index] + "px",
            marginRight: buttons.spacing[index] + "px",
          }}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
        >{loadLi(index)}</a>
      ) : (
        <NavLink to={link}
          style={{
            width: buttons.width[index] + "px",
            height: buttons.height[index] + "px",
            marginLeft: buttons.spacing[index] + "px",
            marginRight: buttons.spacing[index] + "px",
          }}
          key={index}
          className="navLink"
          onClick={(e) => handleNavLinkClick(e, link)}
        >{loadLi(index)}</NavLink>
      );

      if (index < numLeftItems) {
        leftItems.push(item);
      } else {
        // we need to check whether we want to add it in rightItems or trayItems
        if ((windowWidth - (4 - index) * 73 > 750) || (index === buttons.names.length - 3)) {
          console.log(index);
          rightItems.push(item);
        } else {
          trayItems.push(item);
        }
      }
    });

    if (trayItems.length > 0) { 
      // if we have tray items, we need to replace discord with the tray button

      if (rightItems.length > 1) {
        rightItems.pop(); // remove discord, it will always be last on the right
      }

      // add try button
      const trayIndex = buttons.names.length - 1;
      rightItems.push(
        <div
          key={buttons.names.length} 
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
          }} 
          style={{
            width: (windowWidth >= swapSmallLogoUnder) ? (buttons.width[trayIndex] + "px") : (buttons.small_width[trayIndex] + "px"),
            height: buttons.height[trayIndex] + "px",
            marginLeft: buttons.spacing[trayIndex] + "px",
            marginRight: buttons.spacing[trayIndex] + "px",
          }}
        >{loadLi(trayIndex)}</div>);
      }

      setLeftItems(leftItems);
      setRightItems(rightItems);
      setTrayItems(trayItems);
    }, [windowWidth]);

  return (
    <nav className="topNavBar">
      <ul>
        <div className='navSideSpacing'></div>
        {leftItems}
        <div className="rightGroup">
          {rightItems}
        </div>
      </ul>
      { showMenu ? null : null }
      <div className='navSideSpacing'></div>
    </nav>
  );
}

export default TopNavBar; 