import { ReactNode } from "react";

interface SectionProps {
    title: string;
    children: ReactNode;
}


const Section = ({ title, children }: SectionProps) => (
    <section className="py-16 px-6">
        <h3 className="text-3xl font-bold mb-8 text-center">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">{children}</div>
    </section>
);

export default Section;
