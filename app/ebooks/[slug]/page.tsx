"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Author {
    fullname: string;
}

interface Ebook {
    _id: string;
    title: string;
    slug: string;
    description: string;
    author: Author;
    selar_product_id: string;
    thumbnail_url: string;
    price: number;
    created_at: string;
}

export default function EbookDetailPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);

    // Fetch ebook
    useEffect(() => {
        const fetchEbook = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${slug}`);
                if (!res.ok) throw new Error("Ebook not found");
                const data = await res.json();
                setEbook(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEbook();
    }, [slug]);

    // Check logged in user
    useEffect(() => {
        const token = localStorage.getItem("token"); // <- use token
        if (token) {
            setUser({ token }); // just store token for requests
        }
    }, []);

    const handlePurchaseClick = () => {
        if (!user) {
            alert("You need to log in to purchase this ebook.");
            router.push("/login");
            return;
        }
        setShowPurchaseOptions(!showPurchaseOptions);
    };

    const createOrder = async (paymentMethod: "whatsapp" | "online") => {
        if (!ebook || !user) return null;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    ebook_id: ebook._id,
                    quantity: 1,
                    payment_method: paymentMethod,
                    currency: "NGN",
                    payment_status: "pending",
                }),
            });

            if (!res.ok) throw new Error("Failed to create order");

            const data = await res.json();
            return data;
        } catch (err) {
            console.error(err);
            alert("Could not create order. Try again.");
            return null;
        }
    };

    const handleWhatsAppPurchase = async () => {
        if (!ebook) return;

        const order = await createOrder("whatsapp");
        if (!order) return;

        const message = `Hello, I want to purchase "${ebook.title}" for ₦${ebook.price}. My Order ID is: ${order._id}`;
        const whatsappLink = `https://wa.me/2348139511211?text=${encodeURIComponent(message)}`;

        window.open(whatsappLink, "_blank");
    };

    const handleOnlinePayment = async () => {
        if (!ebook) return;
        if (!user) return router.push("/login");

        const order = await createOrder("online");
        if (!order) return;

        // Redirect user to Selar with reference
        // window.open(`https://selar.co/${ebook.selar_product_id}?ref=${order._id}`, "_blank");
        window.open(`https://selar.co/${ebook.selar_product_id}?buyer_ref=${order._id}`, "_blank");
    };

    if (loading) return <p className="text-center mt-20">Loading...</p>;
    if (error || !ebook) return <p className="text-center mt-20 text-red-500">{error || "Ebook not found"}</p>;

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
                        <span className="font-semibold">Author:</span> {ebook.author.fullname}
                    </p>
                    <p className="mt-2 text-2xl font-bold">₦{ebook.price}</p>

                    <button
                        onClick={handlePurchaseClick}
                        className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        {user ? "Purchase eBook" : "Log in to Purchase"}
                    </button>

                    {showPurchaseOptions && (
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={handleWhatsAppPurchase}
                                className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Pay via WhatsApp
                            </button>

                            <button
                                onClick={handleOnlinePayment}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Pay Online
                            </button>
                        </div>
                    )}

                    {user && showPurchaseOptions && (
                        <p className="mt-2 text-sm text-gray-300">
                            After payment, you will receive the download link.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
