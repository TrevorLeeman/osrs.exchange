import React, { HTMLAttributeAnchorTarget } from 'react';

import Link, { LinkProps } from 'next/link';

import { twMerge } from 'tailwind-merge';

type LinkThemedProps = LinkProps & {
  target?: HTMLAttributeAnchorTarget;
  className?: string;
  children?: React.ReactNode;
};

const LinkThemed = (props: LinkThemedProps) => {
  const { href, target, className, children } = props;
  const styles = twMerge([`text-indigo-600 hover:underline dark:text-yellow-400`, className]);

  return target ? (
    <a href={href as string} target={target} className={styles}>
      {children}
    </a>
  ) : (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
};

export default LinkThemed;
