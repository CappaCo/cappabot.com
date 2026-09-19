import { define } from "@/utils.ts";
import { Head } from "fresh/runtime";

export default define.layout(({ Component }) => {
    return (
        <>
            <Head>
                <PicoStyle />
            </Head>
            <main class="container">
                <hgroup>
                    <h1>
                        <a href="/">CappaBot</a>
                    </h1>
                    <p>Welcome to the CappaBot website!</p>
                </hgroup>

                <Component />

                <h3 id="contact">Contact</h3>
                <p>
                    You can contact me through my discord account @cappabot or
                    email{" "}
                    <a href="mailto:cappabot@cappabot.com">
                        cappabot@cappabot.com
                    </a>
                </p>

                <footer>
                    Made by CappaBot<br />
                    <a href="/terms-of-service">Terms of service</a> |{" "}
                    <a href="/privacy-policy">Privacy policy</a>
                </footer>
            </main>
        </>
    );
});

function PicoStyle() {
    return (
        <link
            rel="stylesheet"
            href="/styles/pico.min.css"
            type="text/css"
        />
    );
}
