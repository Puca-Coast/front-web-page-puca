"use client";
import React, { useEffect, useRef } from "react";
import '../styles/footerStyle.css'
import anime from "animejs";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      footerRef.current.style.display = "flex";
    }, 6000);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="z-50 bg-white shadow hover:bg-slate-50 group transition duration-500 ease-in-out absolute bottom-0 w-full hidden border-t-2 border-black mt-2"
    >
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between footerContent">
        <span className="text-sm text-teal-500 sm:text-center dark:text-teal-500">
          © 2023{" "}
          <a href="https://pucacoast.com/" className="hover:underline">
            Puca Coast™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-teal-500 dark:text-teal-500 sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
