import {
  Card,
  CommentButton,
  CopyButton,
  Navbar,
  ProfileHeader,
  LikeButtonWithReactionButton,
} from '@smartive-education/design-system-component-library-hello-world-team';
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
      <Navbar logoHref={'#'} logoAriaLabel={'Navigate to home'}>
        <span>Profile</span>
        <span>Settings</span>
        <a href="#" onClick={() => signOut()}>
          <p>Logout</p>
        </a>
      </Navbar>

      <div className={'grid grid-cols-1 justify-items-center'}>
        <ul className={'w-screen md:w-615'}>
          {mumbles.map((mumble) => (
            <li key={mumble.id} className={'m-s'}>
              <Card borderType={'rounded'}>
                <ProfileHeader
                  fullName={mumble.creator}
                  labelType={'M'}
                  profilePictureSize={'M'}
                  timestamp={mumble.createdDate}
                ></ProfileHeader>
                <div className={'mt-l'}>
                  <p className={'paragraph-M'}>{mumble.text}</p>
                </div>

                <div className="flex relative -left-3 space-x-8">
                  <CommentButton
                    label={{ noComments: 'Comment', someComments: 'Comments' }}
                    numberOfComments={mumble.replyCount}
                    onClick={undefined}
                  />
                  <LikeButtonWithReactionButton
                    onClick={undefined}
                    active
                    label={{
                      noReaction: 'Like',
                      oneReaction: 'Like',
                      reactionByCurrentUser: 'Liked',
                      severalReaction: 'Likes',
                    }}
                    likes={mumble.likeCount ?? 0}
                    reactionByCurrentUser={mumble.likedByUser}
                  />
                  <CopyButton onClick={undefined} active={false} label={{ inactive: 'Copy Link', active: 'Link copied' }} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
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
