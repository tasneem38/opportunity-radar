import React from 'react';

export default function Badge({ children, variant = 'info' }) {
  const colors = {
    info: { bg: '#eff6ff', text: '#1e40af' },
    success: { bg: '#ecfdf5', text: '#065f46' },
    warning: { bg: '#fffbeb', text: '#92400e' },
    danger: { bg: '#fef2f2', text: '#991b1b' },
    accent: { bg: '#fff7ed', text: '#9a3412' }
  };
  
  const style = colors[variant] || colors.info;

  return (
    <span style={{ 
      display: 'inline-block',
      padding: '0.125rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: 700,
      backgroundColor: style.bg,
      color: style.text,
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }}>
      {children}
    </span>
  );
}