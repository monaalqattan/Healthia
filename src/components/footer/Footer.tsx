import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <div className="login-footer-container">
      <div className="footer-content">
        
        <div className="footer-col-left">
          <h4>Healthia Vitality</h4>
          <p>
            © 2024 Healthia Vitality. Cultivating wellness through
            <br />
            organic care.
          </p>
        </div>

        <div className="footer-col-center">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>

        <div className="footer-col-right">
          <a href="#">Accessibility</a>
          <a href="#">Contact Support</a>
        </div>

      </div>
    </div>
  );
};

export default Footer;