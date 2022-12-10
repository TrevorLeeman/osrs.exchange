import React, { HTMLAttributeAnchorTarget } from 'react';

import Link, { LinkProps } from 'next/link';

import { twMerge } from 'tailwind-merge';

type LinkBlueProps = LinkProps & { target?: HTMLAttributeAnchorTarget; className?: string; children?: React.ReactNode };

const LinkBlue = (props: LinkBlueProps) => {
  const { href, target, className, children } = props;
  const styles = twMerge([`text-blue-600 hover:underline dark:text-blue-300`, className]);

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

export default LinkBlue;
