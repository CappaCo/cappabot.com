import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "CappaBot",
    description: "The official CappaBot website",
};

const inter = Inter({});

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className="h-full dark:bg-black dark:text-white"
        >
            <body className={`${inter.className} min-h-full text-center`}>
                {children}
            </body>
        </html>
    );
}
