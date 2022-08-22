import { useRef } from 'react';
import type { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { SSRProvider } from 'react-aria';
import Header from '../components/header/Header';
import '../styles/global.css';

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{ light: lightTheme.className, dark: darkTheme.className }}
        >
          <NextUIProvider>
            <SSRProvider>
              <Header />
              <Component {...pageProps} />
            </SSRProvider>
          </NextUIProvider>
        </NextThemesProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
