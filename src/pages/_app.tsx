import type { AppProps } from 'next/app';
import { useRef } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { SSRProvider as AriaSSRProvider } from 'react-aria';
import Header from '../components/Header/Header';
import '../styles/global.css';

const lightTheme = createTheme({
  type: 'light',
});

const darkTheme = createTheme({
  type: 'dark',
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
            <AriaSSRProvider>
              <Header />
              <Component {...pageProps} />
            </AriaSSRProvider>
          </NextUIProvider>
        </NextThemesProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
