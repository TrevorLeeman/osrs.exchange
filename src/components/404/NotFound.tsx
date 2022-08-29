import { Container, Text } from '@nextui-org/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => (
  <>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
    <Container display="flex" direction="column" justify="center" fluid>
      <Text h1>Item Not Found</Text>
      <Text size="$lg" color="$gray800">
        Search for another item, or <Link href="/">return to the homepage</Link>.
      </Text>
      <Container display="flex" direction="column" justify="center" alignItems="center" fluid>
        <Image src={'/item-not-found.gif'} width={384} height={384} alt="Nieve starring into the distant sun" />
        <Text size="$sm" color="$gray700">
          Image sourced{' '}
          <a href="https://gfycat.com/celebratedunfitdolphin" target="_blank" rel="noreferrer">
            via Gfycat
          </a>
        </Text>
      </Container>
    </Container>
  </>
);

export default NotFound;
