import EbookDetailClient from "./EbookDetailClient";
import { serverApi } from "@/lib/serverApi";
import { notFound } from "next/navigation";


interface Params {
    params: Promise<{ slug: string }>;
}

export default async function EbookDetailPage({ params }: Params ) {

    const { slug } = await params;

    try {
        const ebook = await serverApi.get(`/ebooks/${slug}`).then(res => res.data);

        if (!ebook) return notFound();

        return <EbookDetailClient ebook={ebook} />;
    } catch (err) {
        console.error("Failed to fetch ebook:", err);
        return <p className="text-center mt-20 text-red-500">Ebook not found</p>;
    }
}
