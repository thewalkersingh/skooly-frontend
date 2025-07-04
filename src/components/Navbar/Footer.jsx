import React from 'react';
import '../../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Diwakar Singh. All Rights Reserved.</p>
      <div className="social-links">
        <a href="https://github.com/thewalkersingh" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/thewalkersingh" target="_blank"
           rel="noopener noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
}

export default Footer;