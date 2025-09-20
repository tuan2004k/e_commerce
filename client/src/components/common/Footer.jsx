import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} E-commerce Store. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
