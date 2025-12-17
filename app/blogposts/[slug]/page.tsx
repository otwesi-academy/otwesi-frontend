// app/blogpost/[slug]/page.tsx

import Image from "next/image";
import { api } from "@/lib/clientApi";

import { BlogPost } from "@/types/types";



interface Block {
    id: string;
    type: "text" | "image";
    content: string;
}



async function getBlogPost(slug: string): Promise<BlogPost> {
    try {
        const res = await api.get<BlogPost>(`/blogposts/${slug}`, {
            headers: { "Cache-Control": "no-store" },
        });
        return res.data;
    } catch (err: any) {
        console.error("Failed to fetch blogpost:", err);
        throw new Error("Blogpost not found");
    }
}


export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlogPost(slug);

    // Parse blocks
    let blocks: Block[] = [];
    try {
        blocks = JSON.parse(blog.content);
    } catch (err) {
        console.error("Failed to parse blog content:", err);
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 prose">
            {blog.thumbnail_url && (
                <Image
                    src={blog.thumbnail_url}
                    width={900}
                    height={500}
                    alt={blog.title}
                    className="rounded-xl object-cover mb-8"
                />
            )}

            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

            <p className="text-gray-600 mb-6">
                {blog.author.fullname} • {new Date(blog.created_at).toLocaleDateString()}
            </p>

            {/* Render blocks */}
            <div className="space-y-6">
                {blocks.map((block) => {
                    if (block.type === "text") {
                        // Split text by double line breaks and render as paragraphs
                        return block.content.split("\n\n").map((p, i) => (
                            <p key={block.id + "-" + i}>{p}</p>
                        ));
                    } else if (block.type === "image") {
                        return (
                            <img
                                key={block.id}
                                src={block.content} // make sure this URL is correct
                                alt=""
                                className="w-full rounded-lg"
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
