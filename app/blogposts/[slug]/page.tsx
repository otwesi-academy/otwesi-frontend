// app/blogpost/[slug]/page.tsx

import Image from "next/image";

interface BlogPost {
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    category: string;
    author: {
        fullname: string;
    };
    created_at: string;
}

async function getBlogPost(slug: string): Promise<BlogPost> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogposts/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Blogpost not found");

    return res.json();
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // ← IMPORTANT with Next.js 15

    const blog = await getBlogPost(slug);

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

            {/* Render content as HTML from FastAPI */}
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
    );
}
