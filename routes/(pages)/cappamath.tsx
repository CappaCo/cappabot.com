import { define } from "@/utils.ts";
import { Head } from "https://jsr.io/@fresh/core/2.3.3/src/runtime/head.ts";
import { CappaMathIsland } from "@/routes/(pages)/(_islands)/cappamath-island.tsx";

export default define.page((_ctx) => {
    return (
        <>
            <Head>
                <title>CappaMath</title>
                <meta
                    name="description"
                    content="CappaMath is a math starter that can be used as a warm up for school students."
                />
            </Head>

            <h2>CappaMath</h2>

            <CappaMathIsland />
            
            <br />
            <br />

            <script>
                {`MathJax = {
                tex: {
                    inlineMath: {"[+]": [["$i$", "$$"]]}
                }
            };`}
            </script>
            <script
                id="MathJax-script"
                src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"
            >
            </script>
        </>
    );
});
