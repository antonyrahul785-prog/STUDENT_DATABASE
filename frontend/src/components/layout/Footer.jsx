import React from 'react';
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedInIcon, 
  InstagramIcon, 
  GitHubIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '../../utils/icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">EduManage</div>
          <div className="footer-copyright">
            © {currentYear} EduManage. All rights reserved.
          </div>
          <div className="footer-version">v1.0.0</div>
        </div>

        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/help" className="footer-link">Help Center</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>

        <div className="footer-social">
          <a href="#" className="social-link">
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a href="#" className="social-link">
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a href="#" className="social-link">
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a href="#" className="social-link">
            <InstagramIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="footer-contact">
        <div className="contact-item">
          <MailIcon className="h-4 w-4" />
          <span>contact@edumanage.com</span>
        </div>
        <div className="contact-item">
          <PhoneIcon className="h-4 w-4" />
          <span>+91 98765 43210</span>
        </div>
        <div className="contact-item">
          <MapPinIcon className="h-4 w-4" />
          <span>123 Education Street, Learning City</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;