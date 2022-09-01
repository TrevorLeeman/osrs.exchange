import { useRef } from 'react';
import type { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createTheme as createNextUiTheme, NextUIProvider } from '@nextui-org/react';
import { SSRProvider as AriaSSRProvider } from 'react-aria';
import Header from '../src/components/Header/Header';
import '../src/styles/global.css';
import Head from 'next/head';

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
        <title>OSRS Prices</title>
      </Head>
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{ light: lightTheme.className, dark: darkTheme.className }}
          >
            <NextUIProvider>
              <AriaSSRProvider>
                <Header />
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
              </AriaSSRProvider>
            </NextUIProvider>
          </NextThemesProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
