import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-10">
      <div className="container flex justify-center gap-4">
        <p className="text-sm">
          DreamHSE &copy; {new Date().getFullYear()} Aman Kumar Anand. All
          rights reserved.
        </p>
        <a
          href="https://github.com/Venomaman"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400"
        >
          <FaGithub size="1.5em" />
        </a>
      </div>
      <div>
        <h1 className="text-xs flex justify-center my-4">
          Follow for more updates!..
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
