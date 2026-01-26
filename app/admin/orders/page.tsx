import OrdersTable from "./components/OrdersTable";
import OrdersFilters from "./components/OrdersFilters";
import { SERVER_API_BASE_URL } from "@/lib/serverApi";

interface OrdersPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        payment_method?: string; // new
        from?: string;
        to?: string;
        buyer_email?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;

    const page = params.page ?? "1";
    const status = params.status ?? "";
    const payment_method = params.payment_method ?? "";
    const from = params.from ?? "";
    const to = params.to ?? "";
    const buyer_email = params.buyer_email ?? "";

    const query = new URLSearchParams({
        page,
        ...(status && { status }),
        ...(payment_method && { payment_method }),
        ...(from && { from }),
        ...(to && { to }),
        ...(buyer_email && { buyer_email }),
    });

    const res = await fetch(`${SERVER_API_BASE_URL}/orders?${query.toString()}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch orders");

    const data = await res.json();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

            <OrdersFilters
                defaultStatus={status}
                defaultPaymentMethod={payment_method} // pass default
                defaultFrom={from}
                defaultTo={to}
                defaultBuyerEmail={buyer_email}
            />

            <OrdersTable
                orders={data.results}
                page={data.page}
                totalPages={data.total_pages}
                filters={{ status, payment_method, from, to, buyer_email }}
            />
        </div>
    );
}
