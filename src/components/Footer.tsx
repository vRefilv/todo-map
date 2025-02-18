// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-footer text-footerText p-4 text-center">
      <p>&copy; {new Date().getFullYear()} Refil. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
