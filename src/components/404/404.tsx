import Head from 'next/head';
import Image from 'next/image';

import H1 from '../Common/H1';
import HorizontalPadding from '../Common/HorizontalPadding';
import LinkBlue from '../Common/LinkBlue';
import PageDescription from '../Common/PageDescription';

const NotFound = () => (
  <>
    <Head>
      <title>Item Not Found - OSRS Exchange</title>
      <meta name="robots" content="noindex" />
    </Head>
    <HorizontalPadding>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col gap-2">
          <H1>Item Not Found</H1>
          <PageDescription>
            Search for another item, or <LinkBlue href="/">return to the homepage</LinkBlue>.
          </PageDescription>
        </div>
        <Image src={'/item-not-found.gif'} width={384} height={384} alt="Nieve starring into the distant sun" />
      </div>
    </HorizontalPadding>
  </>
);

export default NotFound;
