import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Header} from "../components/header";
import {fetchMumbles, Mumble} from '../services/qwacker';
import {useState} from 'react';
import {MumbleIcon, Navbar, ProfilePic} from '@smartive-education/design-system-component-library-hello-world-team';
import {signOut, useSession} from 'next-auth/react';

type PageProps = {
    count: number;
    mumbles: Mumble[];
    error?: string;
};

export default function PageHome({ mumbles: initialMumbles, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [mumbles, setMumbles] = useState(initialMumbles);
    const { data: session } = useSession();

    if (error) {
        return <div>An error occurred: {error}</div>;
    }

    return (
        <div>
            <Navbar>
                {!!session && (
                    <>
                        <span >Profile</span>
                        <span>Settings</span>
                        <a href="#" onClick={() => signOut()}>
                            <p>Logout</p>
                        </a>
                    </>
                )}
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

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
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
