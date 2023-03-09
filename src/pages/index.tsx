import { Navbar } from '@smartive-education/design-system-component-library-hello-world-team';
import { getSession, signOut } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchMumbles, Mumble } from '../services/qwacker';
import { useState } from 'react';

type PageProps = {
  count: number;
  mumbles: Mumble[];
  error?: string;
};

export default function PageHome({
  mumbles: initialMumbles,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [mumbles] = useState(initialMumbles);

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <Navbar
          logoHref={'#'}
          logoAriaLabel={'Navigate to home'}>
        <span>Profile</span>
        <span>Settings</span>
        <a href="#" onClick={() => signOut()}>
          <p>Logout</p>
        </a>
      </Navbar>
      <ul>
        {mumbles.map((mumble) => (
          <li key={mumble.id}>
            <p>
              {mumble.text} ({mumble.createdTimestamp} ) {mumble.createdDate}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const { count, mumbles } = await fetchMumbles({ limit: 20 });

    return { props: { count, mumbles } };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, mumbles: [], count: 0 } };
  }
};
