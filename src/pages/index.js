import Head from 'next/head';

import App from '../App';

export default function Home() {
  return (
    <>
      <Head>
        <title>Satchel</title>
        <meta name="description" content="A place for your precious loot." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <App />
      </main>
    </>
  );
}
