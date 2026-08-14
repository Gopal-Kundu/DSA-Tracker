import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p className="footer-text">
          Thank you for visiting... Made by&nbsp;<span className="font-semibold">Gopal Kundu</span>
        </p>
        <a
          className="footer-linkedin-link"
          href="https://www.linkedin.com/in/gopalcodes/"
          target="_blank"
          rel="noopener noreferrer"
          title="Connect with Gopal Kundu on LinkedIn"
        >
          <Linkedin className="linkedin-icon" size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
