import type { AppProps } from 'next/app';
import '@src/styles/index.css';
import Container from '@src/components/Container';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;
