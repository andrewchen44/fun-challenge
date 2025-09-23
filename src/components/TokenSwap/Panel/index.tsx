import type { ReactNode } from 'react';
import './styles.css';

interface PanelProps {
  children: ReactNode;
}

export const Panel = ({ children }: PanelProps) => {
  return (
    <section className="panel">
      {children}
    </section>
  );
};


