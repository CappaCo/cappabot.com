import Link from "next/link";

export default function Nav() {
    return (
        <nav className="bg-neutral-500/20 backdrop-blur-lg drop-shadow-xl/50 p-4 px-8 w-full sm:w-auto sm:m-auto rounded-none sm:rounded-full border-b-1 sm:border-1 border-neutral-500">
            <ul className="flex flex-row gap-4 justify-center underline">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li>
                    <Link href="/projects">Projects</Link>
                </li>
                <li>
                    <Link href="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
}
