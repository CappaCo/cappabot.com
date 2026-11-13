import type { Metadata } from "next";

import "./style.css";
import "./print.css";

export const metadata: Metadata = {
    title: "Resume - Casper Howse",
    description: "Casper Howse Resume",
};

export default function ResumeLayout(
    { children }: LayoutProps<"/resume">,
) {
    return (
        <>
            <div
                id="resume-navigation"
                className="text-xl bg-white p-4 text-black"
            >
                <a
                    href="/"
                    className="underline text-blue-700 hover:text-blue-900"
                >
                    &larr; Back to home
                </a>
                <span id="print-note"> | note: this page prints better on chromium-based browsers</span>
            </div>
            {children}
        </>
    );
}
