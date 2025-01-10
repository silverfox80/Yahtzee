import React from 'react';

const FallbackComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#282c34',
        color: 'white',
        fontSize: '1.5rem',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          marginBottom: '1rem',
          border: '4px solid #f3f3f3', /* Light grey */
          borderTop: '4px solid #3498db', /* Blue */
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p>Loading, please wait...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FallbackComponent