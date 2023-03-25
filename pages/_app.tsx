import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { DmSans } from '../utils/getDmSansFont';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={DmSans.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
