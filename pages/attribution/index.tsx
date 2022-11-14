import type { NextPage } from 'next';
import Link from 'next/link';

import { Container, Text } from '@nextui-org/react';

const Attribution: NextPage = () => (
  <Container fluid>
    <Text h1>This Site is Powered by Creative Commons Resources</Text>
    <ul>
      <li>
        <Link href="https://www.svgrepo.com/svg/305616/arrow-back-outline" target="_blank">
          Arrow Back Outline SVG Vector
        </Link>
      </li>
      <li>
        <Link href="https://www.svgrepo.com/svg/332413/home" target="_blank">
          Home SVG Vector
        </Link>
      </li>
    </ul>
  </Container>
);

export default Attribution;
