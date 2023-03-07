import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useState } from "react";
import { fetchMumbles, Mumble } from "../services/qwacker";

type PageProps = {
    count: number;
    mumbles: Mumble[];
    error?: string;
};

export default function Page({
                                 count,
                                 mumbles: initialMumbles,
                                 error,
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [mumbles, setMumbles] = useState(initialMumbles);

    if (error) {
        return <div>An error occurred: {error}</div>;
    }

    return (
        <div className="w-60 m-auto my-10">
            <h2 className="text-lg">{count} mumbles</h2>
            <ul>
                {mumbles.map((mumble) => (
                    <li key={mumble.id} className="bg-gray-100 rounded px-4 py-2 mt-2">
                        <p className="text-sm">
                            {mumble.text} ({mumble.createdTimestamp})
                        </p>
                        {mumble.mediaUrl && (
                            <figure className="relative block max-w-full h-64 my-2">
                                <Image
                                    src={mumble.mediaUrl}
                                    alt={mumble.text}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </figure>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    try {
        const { count, mumbles } = await fetchMumbles({ limit: 1 });

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
