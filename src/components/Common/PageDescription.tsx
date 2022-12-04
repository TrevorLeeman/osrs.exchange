import { ReactNode } from 'react';

type PageDescriptionProps = {
  children?: ReactNode;
};
const PageDescription = ({ children }: PageDescriptionProps) => (
  <p className="text-zinc-700 dark:text-zinc-400">{children}</p>
);

export default PageDescription;
