export default function Footer() {
    return (
        <footer className="border-t-1 border-neutral-600">
            <div className="flex justify-evenly p-16 pb-4">
                <div>
                    <FooterHeader>Things</FooterHeader>
                    <ul>
                        <li>Thing 1</li>
                        <li>Thing 2</li>
                        <li>Thing 3</li>
                        <li>Thing 4</li>
                    </ul>
                </div>
                <div>
                    <FooterHeader>Socials</FooterHeader>
                    <ul>
                        <li>
                            <FooterExternalLink href="https://github.com/CappaBot1">
                                GitHub
                            </FooterExternalLink>
                        </li>
                        <li>
                            <FooterExternalLink href="https://discord.gg/HxThbHWG46">
                                Discord
                            </FooterExternalLink>
                        </li>
                        <li>
                            <FooterExternalLink href="https://www.youtube.com/@CappaBot">
                                YouTube
                            </FooterExternalLink>
                        </li>
                        <li>
                            <FooterExternalLink href="https://www.instagram.com/cappabot1/">
                                Instagram
                            </FooterExternalLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-8">
                copyright 'n stuff
            </div>
        </footer>
    );
}

function FooterHeader({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="font-bold text-xl/6 border-b border-neutral-600 w-full px-1 pt-1">
            {children}
        </h3>
    );
}

function FooterExternalLink(
    { href, children }: { href: string; children: React.ReactNode },
) {
    return (
        <a
            href={href}
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
}
