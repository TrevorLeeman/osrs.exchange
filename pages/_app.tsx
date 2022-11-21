import { useRef } from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { NextUIProvider, createTheme as createNextUiTheme } from '@nextui-org/react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SSRProvider as AriaSSRProvider } from 'react-aria';

import Footer from '../src/components/Footer/Footer';
import Header from '../src/components/Header/Header';
import '../src/styles/global.css';

const lightTheme = createNextUiTheme({
  type: 'light',
});

const darkTheme = createNextUiTheme({
  type: 'dark',
});

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient());

  return (
    <>
      <Head>
        <title>OSRS Exchange</title>
      </Head>
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{ light: lightTheme.className, dark: darkTheme.className }}
          >
            <NextUIProvider disableBaseline={true}>
              <AriaSSRProvider>
                <div className="flex h-full flex-col px-1 pt-3 3xs:px-2 2xs:px-3 xs:px-5 lg:px-10 lg:pt-6 xl:px-12">
                  <Header />
                  <main className="grow">
                    <Component {...pageProps} />
                  </main>
                  <Footer />
                  <ReactQueryDevtools initialIsOpen={false} />
                </div>
              </AriaSSRProvider>
            </NextUIProvider>
          </NextThemesProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
