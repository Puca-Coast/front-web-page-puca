import React, { useState, useEffect, useRef } from "react";
import "../styles/headerStyles.css";
import { Link } from "react-router-dom";
import anime from "animejs";

export default function Header(props) {
  const { isHome = true } = props;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (isHome) {
      setTimeout(() => {
        headerRef.current.style.display = "flex";
      }, 6000);
    } else {
      headerRef.current.style.display = "flex";
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <div
      ref={headerRef}
      className="flex items-center justify-around py-7 px-5  w-full z-10 hover:bg-slate-50 group transition duration-500 ease-in-out hidden bg-white border-b-2 border-black"
    >
      <a href="/"><img src="/assets/logo_mini.svg" alt="Logo"/></a>
      <div className="flex flex-row gap-32">
        <a className="headerText">Lookbook</a>
        <a className="headerText">Shop</a>
        <a className="headerText">Collections</a>
      </div>
      <div className="flex text-teal-500 group-hover:text-teal-500 transition duration-500 ease-in-out userLinks">
        <a href="">
          <img src="/assets/shoppingbag.svg" alt="shoppinbag_icon" />
        </a>
        <a href="">
          <img src="/assets/User.svg" alt="user_icon" />
        </a>
      </div>
    </div>
  );
}
