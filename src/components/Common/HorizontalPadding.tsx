import React from 'react';

type HorizontalPaddingProps = {
  children: React.ReactNode;
};

const HorizontalPadding: React.FC<HorizontalPaddingProps> = ({ children }) => (
  <div className="px-1 xs:px-2 md:px-7 lg:px-9 xl:px-12">{children}</div>
);

export default HorizontalPadding;
