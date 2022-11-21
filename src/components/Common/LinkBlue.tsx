import React, { HTMLAttributeAnchorTarget } from 'react';

import Link, { LinkProps } from 'next/link';

type LinkBlueProps = LinkProps & { children?: React.ReactNode; target?: HTMLAttributeAnchorTarget };

const LinkBlue = (props: LinkBlueProps) => {
  const { children, href, target } = props;
  const styles = 'text-blue-600 hover:underline dark:text-blue-300';

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
