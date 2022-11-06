import type { NextPage } from 'next';
import Link from 'next/link';

import { Container, Text } from '@nextui-org/react';

const Attribution: NextPage = () => (
  <Container fluid>
    <Text h1>This Site is Powered by Creative Commons Resources</Text>
    <ul>
      <li>
        <Link href="https://www.svgrepo.com/svg/67522/back">Back-Arrow Icon</Link>
      </li>
    </ul>
  </Container>
);

export default Attribution;
