import React from 'react';
import './styles.css';

interface PanelProps {
  children: React.ReactNode;
}

export const Panel = ({ children }: PanelProps) => {
  return (
    <section className="panel">
      {children}
    </section>
  );
};


