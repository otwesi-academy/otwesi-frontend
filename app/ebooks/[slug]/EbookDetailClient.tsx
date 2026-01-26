"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/clientApi";
import { Ebook } from "@/types/types";

import { FaWhatsapp } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { SiShopify } from "react-icons/si";

type PaymentMethod = "whatsapp" | "selar" | "paystack";

interface Props {
    ebook: Ebook;
}

export default function EbookDetailClient({ ebook }: Props) {
    const router = useRouter();
    const { user } = useAuth();

    const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
    const [loadingMethod, setLoadingMethod] = useState<PaymentMethod | null>(null);

    // Hard lock to prevent double-click race conditions
    const isProcessingRef = useRef(false);

    const handlePurchaseClick = () => {
        if (!user) {
            alert("You need to log in to purchase this ebook.");
            router.push("/login");
            return;
        }
        setShowPurchaseOptions((prev) => !prev);
    };

    /**
     * Creates an order safely (race-condition protected)
     */
    const createOrder = async (paymentMethod: PaymentMethod) => {
        if (isProcessingRef.current) return null;

        isProcessingRef.current = true;
        setLoadingMethod(paymentMethod);

        try {
            const { data } = await api.post("/orders", {
                ebook_id: ebook._id,
                quantity: 1,
                payment_method: paymentMethod,
            });

            // Auto-close options once user commits
            setShowPurchaseOptions(false);

            return data;
        } catch (err) {
            console.error(err);
            alert("Could not create order. Try again.");
            return null;
        } finally {
            setLoadingMethod(null);
            isProcessingRef.current = false;
        }
    };

    /**
     * WhatsApp (assisted)
     */
    const handleWhatsAppPurchase = async () => {
        const order = await createOrder("whatsapp");
        if (!order) return;

        window.open(order.url, "_blank");
    };

    /**
     * Selar
     */
    const handleSelarPayment = async () => {
        const order = await createOrder("selar");
        if (!order) return;

        window.open(order.url, "_blank");
    };

    /**
     * Paystack (primary)
     */
    const handlePaystackPayment = async () => {
        const order = await createOrder("paystack");
        if (!order) return;

        window.open(order.url, "_blank");
    };

    /**
     * Reusable spinner
     */
    const Spinner = () => (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    );

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

                    <p className="text-gray-600 mt-4">
                        {ebook.description}
                    </p>

                    <p className="mt-6">
                        <span className="font-semibold">Author:</span>{" "}
                        {ebook.author.fullname}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        ₦{ebook.price}
                    </p>

                    {/* Purchase Button (Neutral) */}
                    <button
                        onClick={handlePurchaseClick}
                        className="mt-6 w-full md:w-auto
                            bg-gray-800 hover:bg-gray-700
                            text-white font-semibold
                            px-6 py-3 rounded-lg
                            transition"
                    >
                        {user ? "Purchase eBook" : "Log in to Purchase"}
                    </button>

                    {/* Payment Options */}
                    {showPurchaseOptions && (
                        <div className="mt-6 flex flex-col gap-4">
                            {/* Paystack */}
                            <button
                                onClick={handlePaystackPayment}
                                disabled={loadingMethod !== null}
                                className="w-full flex items-center justify-center gap-3
                                    bg-green-600 hover:bg-green-700
                                    text-white font-semibold
                                    px-6 py-3 rounded-lg
                                    transition disabled:opacity-50"
                            >
                                {loadingMethod === "paystack" ? (
                                    <>
                                        <Spinner /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <MdPayment size={20} />
                                        Pay with Paystack
                                    </>
                                )}
                            </button>

                            {/* Selar */}
                            <button
                                onClick={handleSelarPayment}
                                disabled={loadingMethod !== null}
                                className="w-full flex items-center justify-center gap-3
                                    bg-blue-600 hover:bg-blue-700
                                    text-white font-semibold
                                    px-6 py-3 rounded-lg
                                    transition disabled:opacity-50"
                            >
                                {loadingMethod === "selar" ? (
                                    <>
                                        <Spinner /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <SiShopify size={20} />
                                        Pay with Selar
                                    </>
                                )}
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={handleWhatsAppPurchase}
                                disabled={loadingMethod !== null}
                                className="w-full flex items-center justify-center gap-3
                                    border border-gray-700
                                    text-gray-200 hover:bg-gray-800
                                    font-medium px-6 py-3 rounded-lg
                                    transition disabled:opacity-50"
                            >
                                {loadingMethod === "whatsapp" ? (
                                    <>
                                        <Spinner /> Opening WhatsApp...
                                    </>
                                ) : (
                                    <>
                                        <FaWhatsapp size={20} className="text-green-500" />
                                        Pay via WhatsApp
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center">
                                Secure payment • Instant ebook delivery after confirmation
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
