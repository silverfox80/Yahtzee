import React from 'react';

export default function GameOverModal({ open, onClose, score }) {
  const finalScore = (score instanceof Map ? score.get('Total') : 0) || 0;

  if (!open) return null; // Don't render anything if the modal is closed

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>Game Over</h2>
        <p style={descriptionStyle}>Your Final Score: {finalScore}</p>
        <button onClick={onClose} style={buttonStyle}>Play Again</button>
      </div>
    </div>
  );
}

// Inline styles for the modal components
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '90%',
};

const titleStyle = {
  fontSize: '1.5em',
  marginBottom: '10px',
};

const descriptionStyle = {
  fontSize: '1.2em',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1em',
};

