"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/clientApi";
import { Ebook } from "@/types/types";

interface Props {
    ebook: Ebook;
}

export default function EbookDetailClient({ ebook }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePurchaseClick = () => {
        if (!user) {
            alert("You need to log in to purchase this ebook.");
            router.push("/login");
            return;
        }
        setShowPurchaseOptions(!showPurchaseOptions);
    };

    const createOrder = async (paymentMethod: "whatsapp" | "online") => {
        if (!ebook) return null;
        setLoading(true);

        try {
            const { data } = await api.post("/orders", {
                ebook_id: ebook._id,
                quantity: 1,
                payment_method: paymentMethod,
                currency: "NGN",
                payment_status: "pending",
            });

            return data;
        } catch (err) {
            console.error(err);
            alert("Could not create order. Try again.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppPurchase = async () => {
        const order = await createOrder("whatsapp");
        if (!order) return;

        const message = `Hello, I want to purchase "${ebook.title}" for ₦${ebook.price}. My Order ID is: ${order._id}`;
        const whatsappLink = `https://wa.me/2348139511211?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    };

    const handleOnlinePayment = async () => {
        if (!user) return router.push("/login");

        const order = await createOrder("online");
        if (!order) return;

        // Redirect user to Selar with reference
        window.open(`https://selar.co/${ebook.selar_product_id}?buyer_ref=${order._id}`, "_blank");
    };

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
                        disabled={loading}
                        className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {user ? "Purchase eBook" : "Log in to Purchase"}
                    </button>

                    {showPurchaseOptions && (
                        <div className="mt-4 flex flex-col gap-3">
                            <button
                                onClick={handleWhatsAppPurchase}
                                disabled={loading}
                                className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                Pay via WhatsApp
                            </button>

                            <button
                                onClick={handleOnlinePayment}
                                disabled={loading}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
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
