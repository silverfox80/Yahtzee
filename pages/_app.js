// pages/_app.js
import { useState, useEffect } from 'react';
import '../styles/main.css';

const MIN_H_RES = 1680
const MIN_V_RES = 1050

function MyApp({ Component, pageProps }) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkResolution = () => {
      if (window.innerWidth >= MIN_H_RES && window.innerHeight >= MIN_V_RES) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };

    checkResolution(); // Initial check
    window.addEventListener('resize', checkResolution); // Listen for resize events

    return () => {
      window.removeEventListener('resize', checkResolution);
    };
  }, []);

  if (!isAllowed) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Screen resolution too small</h1>
        <p>Your screen resolution must be at least {MIN_H_RES}x{MIN_V_RES} to play with this app.</p>
      </div>
    );
  }
  return <Component {...pageProps} />;
}

export default MyApp;
