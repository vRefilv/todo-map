// components/Header.tsx
import React from "react";
import Card from "./Card";

interface HeaderProps {
  navContent: string;
}

const Header: React.FC<HeaderProps> = ({ navContent }) => {
  // Split by newline and trim each item.
  const navItems = navContent
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // The first item is treated as the logo/title.
  const logo = navItems.shift();

  return (
    <header className="bg-bg p-4">
      <Card
        className="w-full max-w-xl mx-auto m-5 p-3"
        contentClassName="flex justify-between items-center"
      >
        <p className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent font-bold text-lg mr-10 md:mr-20">
          {logo}
        </p>
        <nav className="flex-1">
          <ul className="flex gap-2 md:gap-10 justify-around">
            {navItems.map((item, index) => {
              let displayText = item;
              let targetId = item.toLowerCase();
              // If a nav line contains "#", split it so the part after is the target id.
              if (item.includes("#")) {
                const parts = item.split("#");
                displayText = parts[0].trim();
                targetId = parts[1].trim();
              }
              return (
                <li key={index} className="text-center">
                  <a
                    href={`#${targetId}`}
                    className="block text-primary hover:text-accent transition-colors duration-300 relative group whitespace-nowrap text-sm md:text-base"
                  >
                    {displayText}
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Card>
    </header>
  );
};

export default Header;
