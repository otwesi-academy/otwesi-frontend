"use client";

import Link from "next/link";

interface OrdersTableProps {
    orders: any[];
    page: number;
    totalPages: number;
    filters: {
        status?: string;
        payment_method?: string;
        from?: string;
        to?: string;
        buyer_email?: string;
    };
}

export default function OrdersTable({ orders, page, totalPages, filters }: OrdersTableProps) {
    const currentPage = Number(page);

    const queryStr = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.payment_method && { payment_method: filters.payment_method }),
        ...(filters.from && { from: filters.from }),
        ...(filters.to && { to: filters.to }),
        ...(filters.buyer_email && { buyer_email: filters.buyer_email }),
    }).toString();

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-gray-300">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="p-3 text-left">Order</th>
                        <th className="p-3">Buyer</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Platform</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr key={o._id} className="border-t border-gray-700">
                            <td className="p-3">
                                <Link
                                    href={`/admin/orders/${o._id}`}
                                    className="text-blue-400 hover:underline"
                                >
                                    {o.order_code}
                                </Link>
                            </td>
                            <td className="p-3">{o.buyer.email}</td>
                            <td className="p-3">₦{o.total_amount.toLocaleString()}</td>
                            <td className="p-3">{o.payment_method}</td>
                            <td className="p-3">{o.status}</td>
                            <td className="p-3">
                                {new Date(o.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 p-4 flex-wrap">
                {currentPage > 1 && (
                    <Link
                        href={`/admin/orders?page=${currentPage - 1}&${queryStr}`}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                        Previous
                    </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                        key={p}
                        href={`/admin/orders?page=${p}&${queryStr}`}
                        className={`px-3 py-1 rounded ${p === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        {p}
                    </Link>
                ))}

                {currentPage < totalPages && (
                    <Link
                        href={`/admin/orders?page=${currentPage + 1}&${queryStr}`}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                        Next
                    </Link>
                )}
            </div>
        </div>
    );
}
