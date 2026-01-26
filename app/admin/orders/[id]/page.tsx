import { SERVER_API_BASE_URL } from "@/lib/serverApi";
import { Order } from "@/types/types";


interface Props {
    params: Promise<{ id: string }>;
}


export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;
    const res = await fetch(`${SERVER_API_BASE_URL}/orders/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Order not found");
    }

    const order: Order = await res.json();

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-white mb-6">
                Order {order.order_code}
            </h1>

            {/* Buyer Info */}
            <section className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="font-semibold text-white mb-2">Buyer</h2>
                <p>{order.buyer.fullname}</p>
                <p>{order.buyer.email}</p>
            </section>

            {/* Ebook Info */}
            <section className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="font-semibold text-white mb-2">Ebook</h2>
                <div className="flex gap-4">
                    <img
                        src={order.ebook.thumbnail_url}
                        alt={order.ebook.title}
                        className="w-20 rounded"
                    />
                    <div>
                        <p>{order.ebook.title}</p>
                        <p>₦{order.ebook.price.toLocaleString()}</p>
                    </div>
                </div>
            </section>

            {/* Payment Info */}
            <section className="bg-gray-800 rounded-lg p-4">
                <p>
                    Status: <strong>{order.status}</strong>
                </p>
                <p>Total: ₦{order.total_amount.toLocaleString()}</p>
                <p>Currency: {order.currency}</p>
                <p>
                    Created: {new Date(order.created_at + 'Z').toLocaleString()}
                </p>
                <p>Payment Method: {order.ebook ? order.payment_method ?? "N/A" : "N/A"}</p>
            </section>
        </div>
    );
}
