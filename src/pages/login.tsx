import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  });

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {!session && (
          <a href="src/pages#" onClick={() => signIn('zitadel')}>
            <h2>Login &rarr;</h2>
            <p>Login with a ZITADEL account</p>
          </a>
        )}
      </main>
    </>
  );
}
