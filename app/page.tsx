import Nav from "./nav.tsx";
import Footer from "./footer.tsx";

export default function Home() {
    return (
        <>
            <header className="flex flex-row sm:p-4 fixed w-full z-100">
                <Nav />
            </header>
            <section className="relative overflow-y-hidden">
                <div className="pt-[35svh] pb-[35svh] flex flex-col gap-4">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl">
                        CappaBot
                    </h1>
                    <p className="text-lg sm:text-xl">
                        <em>aspiring web developer 🥀</em>
                    </p>
                </div>
                <div className="blur-sm absolute top-0 text-3xl -z-10">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    interdum nunc nec tortor maximus faucibus. Nunc malesuada
                    euismod ex at euismod. Ut aliquet, libero eu vulputate
                    pulvinar, quam nulla mollis felis, a tempus quam sapien et
                    erat. Nunc in nunc id augue eleifend interdum ut at nisi.
                    Nunc pharetra accumsan sapien nec gravida. Integer sagittis
                    ultricies tempor. Vivamus commodo imperdiet dapibus. Integer
                    tincidunt ipsum blandit nisi accumsan, quis consectetur ante
                    tempor.

                    Nam ac neque et augue eleifend faucibus. Vivamus eleifend
                    tempor malesuada. Etiam tincidunt, quam nec porttitor
                    placerat, nisi ligula faucibus magna, non suscipit mi nisl
                    ut risus. Class aptent taciti sociosqu ad litora torquent
                    per conubia nostra, per inceptos himenaeos. Fusce feugiat
                    venenatis diam vitae vestibulum. Integer dignissim pharetra
                    nisl, et hendrerit turpis convallis id. Interdum et
                    malesuada fames ac ante ipsum primis in faucibus. Nulla
                    efficitur sollicitudin justo eleifend fringilla. Maecenas
                    venenatis mauris eget efficitur scelerisque. Cras lacus
                    nisi, efficitur at ullamcorper non, finibus a lacus.

                    Aenean ullamcorper massa quis interdum dictum. Pellentesque
                    nec eros vulputate, tincidunt lectus a, mollis mi. Praesent
                    porta elementum nisi, in maximus enim feugiat id. Cras
                    volutpat consectetur efficitur. Vivamus iaculis vel ipsum
                    eget lobortis. Nunc porta vitae est eu faucibus. Proin eget
                    imperdiet ipsum, congue molestie sem. In hac habitasse
                    platea dictumst. Proin lobortis turpis elit, tincidunt
                    lacinia sapien varius et. Etiam mollis id velit euismod
                    tincidunt. Duis congue, lorem ut semper luctus, erat augue
                    accumsan justo, non convallis arcu diam aliquam diam. Fusce
                    eget ipsum lobortis risus blandit convallis. Integer gravida
                    justo pretium eros molestie placerat. Sed quis mauris
                    sapien.

                    Donec vel tellus ut risus tincidunt facilisis. Nullam eros
                    ipsum, gravida sed enim nec, consectetur vulputate dolor.
                    Cras molestie iaculis metus eu bibendum. Ut vulputate
                    pretium metus, nec auctor dolor condimentum hendrerit.
                    Maecenas tristique libero eu lacus aliquam consequat. In
                    eget malesuada libero, vel molestie massa. Aenean imperdiet
                    vitae mi quis euismod. Vestibulum lacinia eu sapien id
                    vulputate. Integer lacinia lacus et dignissim interdum.

                    Ut ac hendrerit justo. In hac habitasse platea dictumst.
                    Integer quam dolor, placerat a pellentesque at, dapibus sit
                    amet ipsum. Sed sodales elit at interdum accumsan. Etiam
                    justo libero, rutrum nec purus quis, accumsan dictum tellus.
                    Proin in massa nulla. Suspendisse potenti.
                </div>
            </section>
            <main>
                <section className="bg-red-900">
                    Carousel with images???
                </section>
                <section className="py-100 bg-neutral-700">
                    yup
                </section>
            </main>
            <Footer />
        </>
    );
}
