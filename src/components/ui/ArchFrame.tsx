import React from 'react';

interface ArchFrameProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  hasBorder?: boolean;
  borderWidth?: number;
  bg?: string;
  id?: string;
}

export const ArchFrame: React.FC<ArchFrameProps> = ({
  children,
  className = '',
  borderColor = '#A78040',
  hasBorder = false,
  borderWidth = 1.5,
  bg = 'transparent',
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: '999px 999px 24px 24px',
        backgroundColor: bg,
        border: hasBorder ? `${borderWidth}px solid ${borderColor}` : undefined,
      }}
    >
      {children}
    </div>
  );
};
