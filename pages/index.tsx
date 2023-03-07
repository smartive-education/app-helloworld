import {GetServerSideProps, InferGetServerSidePropsType, InferGetStaticPropsType} from "next";
import { Header } from "../components/header";
import {fetchMumbles, Mumble} from '../services/qwacker';
import {useState} from 'react';

type PageProps = {
    count: number;
    mumbles: Mumble[];
    error?: string;
};

export default function PageHome({ mumbles: initialMumbles, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [mumbles, setMumbles] = useState(initialMumbles);

    if (error) {
        return <div>An error occurred: {error}</div>;
    }

    return (
        <div>
             <Header title="Mumble">
                <span>Your custom network</span>
             </Header>
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
// export const getServerSideProps: GetServerSideProps = async () => ({
//   props: { posts: require("../data/posts.json") },
// });


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
