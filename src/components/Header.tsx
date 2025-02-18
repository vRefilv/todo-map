// components/Header.tsx
import React from "react";
import Card from "./Card";

const Header: React.FC = () => {
  return (
    <header className="bg-bg p-4">
      <Card
        className="w-full max-w-xl mx-auto m-5 p-3"
        contentClassName="flex justify-between items-center"
      >
        <p className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent font-bold text-lg mr-10 md:mr-20">
          Refil
        </p>
        <nav className="flex-1">
          <ul className="flex gap-2 md:gap-10 justify-around">
            {["Welcome", "About", "Projects"].map((section) => (
              <li key={section} className="text-center">
                <a
                  href={`#${section.toLowerCase()}`}
                  className="block text-primary hover:text-accent transition-colors duration-300 relative group whitespace-nowrap text-sm md:text-base"
                >
                  {section}
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Card>
    </header>
  );
};

export default Header;
