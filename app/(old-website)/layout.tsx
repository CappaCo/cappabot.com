import type { Metadata } from "next";

import "./styles/pico.min.css";

export const metadata: Metadata = {
    title: "CappaBot - Legacy",
    description: "Old legacy version of cappabot.com",
};

export default function LegacyLayout({ children }: LayoutProps<"/">) {
    return (
        <html>
            <body>
                <div
                    style={{
                        backgroundColor: "#b60000",
                        color: "#fff",
                        padding: "16px",
                        textAlign: "center",
                    }}
                >
                    warning! i'm migrating and changing my website so expect
                    some changes
                </div>
                {children}
            </body>
        </html>
    );
}
