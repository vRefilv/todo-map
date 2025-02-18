// components/Footer.tsx
import React from "react";

interface FooterProps {
  content: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  const processedContent = processContent(content);
  return (
    <footer className="bg-footer text-footerText p-4 text-center">
      {processedContent}
    </footer>
  );
};

function processContent(node: React.ReactNode): React.ReactNode {
  const year = new Date().getFullYear().toString();

  if (typeof node === "string") {
    // Replace %year% with the current year and \n with <br /> elements
    return node.split("\n").map((part, index) => (
      <React.Fragment key={index}>
        {part.replace("%year%", year)}
        <br />
      </React.Fragment>
    ));
  }

  if (Array.isArray(node)) {
    return node.map((child) => processContent(child));
  }

  if (React.isValidElement(node)) {
    // Cast to a type with known children
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return React.cloneElement(element, {
      children: processContent(element.props.children),
    });
  }

  return node;
}

export default Footer;
