import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-6">
      <div className="container flex justify-center gap-4 items-center mx-auto">
        <h1 className="text-xs my-4">Follow for more updates!..</h1>

        <a
          href="https://github.com/Venomaman"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400"
        >
          <FaGithub className="size-5 sm:size-6" />
        </a>
      </div>
      <div>
        <p className=" text-xs sm:text-sm flex justify-center">
          DreamHSE &copy; {new Date().getFullYear()} Aman Kumar Anand. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
