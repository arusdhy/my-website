import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  accentColor?: string;
  span?: number;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle, 
  onClick, 
  className = '', 
  accentColor,
  span = 1
}) => {
  const style = {
    '--accent-color': accentColor,
    gridColumn: span > 1 ? `span ${span}` : 'auto'
  } as React.CSSProperties;

  return (
    <div 
      className={`card ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;
