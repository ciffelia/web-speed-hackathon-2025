import React from 'react';

interface Props {
  children?: React.ReactNode;
  lines: number;
}

export const Ellipsis: React.FC<Props> = ({ children, lines }) => {
  return (
    <div
      className={`max-w-full overflow-hidden`}
      style={{
        display: '-webkit-box',
        lineClamp: lines,
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
      }}
    >
      {children}
    </div>
  );
};
