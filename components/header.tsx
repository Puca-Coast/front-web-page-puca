import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      headerRef.current.style.display = "flex";
    }, 6000);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <div
      ref={headerRef}
      className="flex items-center justify-between py-7 px-5 absolute w-full z-10 hover:bg-slate-50 group transition duration-500 ease-in-out hidden bg-white"
    >
      <img src="/assets/logo_mini.svg" alt="Logo" />
      <div>
        <span>Lookbook</span>
        <span>Shop</span>
        <span>Collections</span>
      </div>
      <div className="flex text-teal-500 group-hover:text-teal-500 transition duration-500 ease-in-out">
        <button className="appearance-none">
          <svg
            className=""
            width="24px"
            height="24px"
            viewBox="0 -2 37 35"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g
              transform="translate(0.500000, 0.500000)"
              stroke="none"
              fill="currentColor"
              fill-rule="nonzero"
            >
              <path d="M0.2,11 L9.5,29 L26.4,29 L35.7,11 L0.2,11 Z M24.5,26 L11.5,26 L4.8,14 L31.2,14 L24.5,26 L24.5,26 Z M18.5,3 C22.7,3 25.5,6.3 25.5,8.5 L28.5,8.5 C28.5,4.5 24.2,0 18.5,0 C12.8,0 8.5,4.5 8.5,8.5 L11.5,8.5 C11.5,6.3 14.3,3 18.5,3 Z"></path>
            </g>
          </svg>
        </button>
        <button className="appearance-none mr-6 hidden md:block">
          <svg
            width="24px"
            height="24px"
            role="presentation"
            viewBox="0 0 24 24"
          >
            <g
              className="text-teal-500 group-hover:text-teal-500 "
              stroke="currentColor"
              fill="none"
              fill-rule="nonzero"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                fill="none"
                stroke-width="2px"
              ></path>
              <circle
                cx="12"
                cy="7"
                r="4"
                fill="none"
                stroke-width="2px"
              ></circle>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
