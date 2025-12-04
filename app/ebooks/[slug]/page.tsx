// app/ebooks/[slug]/page.tsx

import Image from "next/image";
import Link from "next/link";

interface Author {
    fullanme: string
}

interface Ebook {
    title: string;
    slug: string;
    description: string;
    author: Author;
    ebook_file_url: string;
    thumbnail_url: string;
    price: number;
    created_at: string;
}

async function getEbook(slug: string): Promise<Ebook> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Ebook not found");

    return res.json();
}

export default async function EbookDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // <-- FIXED HERE

    const ebook = await getEbook(slug);

    return (
        <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10">
                <Image
                    src={ebook.thumbnail_url}
                    width={400}
                    height={500}
                    className="rounded-xl object-cover"
                    alt={ebook.title}
                />

                <div className="flex-1">
                    <h1 className="text-4xl font-bold">{ebook.title}</h1>

                    <p className="text-gray-600 mt-4">{ebook.description}</p>

                    <p className="mt-6">
                        <span className="font-semibold">Author:</span> {ebook.author.fullanme}
                    </p>

                    <p className="mt-2 text-2xl font-bold">₦{ebook.price}</p>

                    <Link
                        href={ebook.ebook_file_url}
                        target="_blank"
                        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Download eBook
                    </Link>
                </div>
            </div>
        </div>
    );
}
