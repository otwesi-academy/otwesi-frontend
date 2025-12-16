import Link from 'next/link';

interface CardProps {
    title: string;
    description: string;
    link?: string; // optional
}



const Card: React.FC<CardProps> = ({ title, description, link }) => (
    <div className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition">
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-gray-200 mb-4">{description}</p>
        {link && (
            <Link href={link} className="text-indigo-600 hover:underline font-semibold">
                Learn More →
            </Link>
        )}
    </div>
);

export default Card;
