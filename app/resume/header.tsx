export default function Header(
    { description = "Reliable Team Member with Attention to Detail" }: {
        description?: string;
    },
) {
    return (
        <header id="title-section">
            <h1>Casper Howse</h1>
            <em style={{fontSize: "1.2em"}}>{description}</em>
        </header>
    );
}
