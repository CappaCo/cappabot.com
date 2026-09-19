import { define } from "@/utils.ts";
import { Head } from "https://jsr.io/@fresh/core/2.3.3/src/runtime/head.ts";
import { CappaMathRunIsland } from "@/routes/(pages)/(_islands)/cappamath-run-island.tsx";

export default define.page(function Home(_ctx) {
    return (
        <>
            <Head>
                <title>CappaMath</title>
                <meta
                    name="description"
                    content="CappaMath is a math starter that can be used as a warm up for school students."
                />
            </Head>

            <style>
                {`html {
                font-size: 32px;
            }

            .container {
                max-width: none;
                margin: 0;
                padding: 0;
                width: 100vw;
                height: 100vh;
            }

            .screen {
                display: none;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;  
                
                text-align: center;
                justify-content: space-around;
                flex-direction: column;
            }

            .screen.active {
                display: flex;
            }

            /* start screen */
            /* question screen */
            #questionScreen {
                justify-content: space-between;
            }

            #questionDisplay {
                font-size: 5em;
            }

            /* answers wait screen */
            /* answers screen */
            #answersScreen {
                justify-content: space-between;
            }

            #answersTable {
                width: 100%;
                height: 100%;
            }

            #answersScreen td, #answersScreen th {
                --pico-spacing: 0.2em;
            }`}
            </style>
            
            <CappaMathRunIsland />
            
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
