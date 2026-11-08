import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Legacy website",
    description: "Old legacy version of cappabot.com",
};

export default function LegacyLayout({ children }: LayoutProps<"/legacy">) {
    return (
        <>
            <div className="p-4 bg-red-700 text-xl">
                deprecated!!!
            </div>
            {children}
        </>
    );
}
