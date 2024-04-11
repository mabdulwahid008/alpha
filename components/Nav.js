import React, { useState } from "react";

import Link from "next/link";

import { ConnectWallet } from "@thirdweb-dev/react";


const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="logo">
          <img
            src="https://ildattero.com/wp-content/uploads/2024/03/logo-a-01-01.png"
            className=""
          />
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }
        >
          <ul>
          <li>
                          <a href="https://ildattero.com/" className="elementor-item">
                            Home
                          </a>
                        </li>
                        <li>
                          <a href="https://ildattero.com/plan/" className="elementor-item">
                          Plans
                          </a>
                        </li>
                          <li>
                          <a href="https://ildattero.com/swap/" className="elementor-item">
                            Swap
                          </a>
                        </li>
                        

                        <li>
                          <a href="#" className="elementor-item">
                            Stake
                          </a>
                        </li>
                         
                         <li>
                         <ConnectWallet />
                         </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <img
                src="https://theclubappe-asad-ghouri.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhamburger.bd56af02.png&w=96&q=75"
                width={60}
                height={40}
              />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
