import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-10 bg-gray-800 text-gray-300">
            <div className="max-w-6xl mx-auto px-10 py-10">

                {/* Top Section */}
                <div className="flex flex-col  items-center justify-between gap-6">


                    {/* Social Icons */}
                    <div className="flex items-center gap-10 text-xl">
                        <Link
                            href="https://twitter.com"
                            target="_blank"
                            className="hover:text-indigo-600 transition"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </Link>

                        <Link
                            href="https://instagram.com"
                            target="_blank"
                            className="hover:text-pink-600 transition"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </Link>

                        <Link
                            href="https://linkedin.com"
                            target="_blank"
                            className="hover:text-blue-600 transition"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin />
                        </Link>

                        <Link
                            href="https://facebook.com"
                            target="_blank"
                            className="hover:text-blue-700 transition"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </Link>
                    </div>
                </div>

                
                {/* Bottom */}
                <div className="text-center text-sm mt-4">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-semibold">OTWESI ACADEMY</span>. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}
