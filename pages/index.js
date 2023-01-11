import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { StoreProvider } from '../components/store';
import App from '../components/App';

export default function Home() {
  return (
    <>
      <Head>
        <title>Satchel</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <StoreProvider>
          <App/>
        </StoreProvider>
      </main>
    </>
  )
}
