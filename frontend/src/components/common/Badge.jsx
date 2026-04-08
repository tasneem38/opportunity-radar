import React from 'react';

export default function Badge({ children, variant = 'info' }) {
  const styles = {
    info: { 
      bg: 'rgba(245,158,11,0.12)', 
      text: 'var(--warning)',
      border: 'rgba(245,158,11,0.2)'
    },
    success: { 
      bg: 'rgba(16,185,129,0.12)', 
      text: 'var(--success)',
      border: 'rgba(16,185,129,0.2)'
    },
    warning: { 
      bg: 'rgba(245,158,11,0.12)', 
      text: 'var(--warning)',
      border: 'rgba(245,158,11,0.2)'
    },
    danger: { 
      bg: 'rgba(239,68,68,0.1)', 
      text: 'var(--danger)',
      border: 'rgba(239,68,68,0.2)'
    },
    accent: { 
      bg: 'rgba(232,119,34,0.12)', 
      text: 'var(--accent)',
      border: 'rgba(232,119,34,0.2)'
    }
  };
  
  const style = styles[variant] || styles.info;

  return (
    <span className="badge" style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.35rem 0.875rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 700,
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }}>
      {children}
    </span>
  );
}
