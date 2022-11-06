import type { NextPage } from 'next';
import Link from 'next/link';

import { Container, Text } from '@nextui-org/react';

const Attribution: NextPage = () => (
  <Container fluid>
    <Text h1>This Site is Powered by Creative Commons Resources</Text>
    <ul>
      <li>
        <Link href="https://www.flaticon.com/free-icons/camera-back">
          Back-Arrow Icon created by Freepik - Flaticon
        </Link>
      </li>
    </ul>
  </Container>
);

export default Attribution;
