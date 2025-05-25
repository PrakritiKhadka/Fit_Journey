import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>Fit<span>Journey</span></h3>
          <p>Your personal fitness tracking companion. Track workouts, set goals, and achieve results with our comprehensive fitness platform.</p>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/FitJourneyDashboard">Dashboard</a></li>
            <li><a href="/workouts">Workouts</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/blog">Blogs</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><i className="fas fa-envelope"></i>support@fitjourney.com</p>
          <p><i className="fas fa-phone"></i>+1 (123) 456-7890</p>
          <p><i className="fas fa-map-marker-alt"></i>123 Fitness Street, Health City</p>
          <p><i className="fas fa-clock"></i>Mon-Fri: 9AM-6PM EST</p>
        </div>
        
        <div className="footer-section social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {year} Fit Journey. All rights reserved. | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
      </div>
    </footer>
  );
};

export default Footer;