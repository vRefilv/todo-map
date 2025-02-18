// src/components/Footer.tsx
import React from "react";

interface FooterProps {
  content: string;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  const year = new Date().getFullYear();
  // Replace the %year% placeholder with the current year
  const renderedContent = content.replace("%year%", year.toString());

  return (
    <footer className="bg-footer text-footerText p-4 text-center">
      <p>{renderedContent}</p>
    </footer>
  );
};

export default Footer;
