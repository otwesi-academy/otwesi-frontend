export default function AdminCard({
    title,
    count,
}: {
    title: string;
    count: number;
}) {
    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow hover:shadow-lg transition border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
            <p className="text-3xl font-bold mt-2 text-white">{count}</p>
        </div>
    );
}
