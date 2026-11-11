import Contact from "../contact.tsx";
import Header from "../header.tsx";

export const metadata = {
    title: "Resume - Casper Howse",
};

export default function Page() {
    return (
        <div id="main-grid">
            <Header />

            <div
                style={{
                    backgroundColor: "#ce0000",
                    color: "#fff",
                    gridColumnStart: 1,
                    gridColumnEnd: -1,
                    padding: 16,
                    borderRadius: 16,
                }}
            >
                DON'T USE THIS RESUME YET
            </div>

            <aside id="left-section">
                <Contact />

                <section>
                    <h2>Technical Skills</h2>
                    <ul>
                        <li>JavaScript / TypeScript</li>
                        <li>HTML5 & CSS3</li>
                        <li>Deno & Node.js</li>
                        <li>Linux (Mint, Arch)</li>
                        <li>Git & GitHub</li>
                        <li>Basic networking & self-hosting</li>
                    </ul>
                </section>

                <section>
                    <h2>Tools</h2>
                    <ul>
                        <li>VS Code / Vim</li>
                        <li>OBS Studio</li>
                        <li>DaVinci Resolve</li>
                        <li>Docker (basic)</li>
                    </ul>
                </section>
            </aside>

            <main id="right-section">
                <section>
                    <h2>Profile</h2>
                    <a href="https://github.com/CappaBot1">GitHub Profile</a>
                    <p>
                        Proactive and dependable junior software developer with
                        a strong focus on leadership, clear communication, and
                        continuous improvement. Known for taking initiative,
                        learning independently, and guiding projects from idea
                        to completion. Comfortable working both independently
                        and as part of a team, with a calm and solution-focused
                        approach to problem solving.
                    </p>
                </section>

                <section>
                    <h2>Leadership & Soft Skills</h2>
                    <ul>
                        <li>
                            Demonstrates initiative by independently identifying
                            problems and building solutions
                        </li>
                        <li>
                            Strong written and verbal communication, able to
                            explain technical ideas clearly
                        </li>
                        <li>
                            Reliable and self-motivated, with consistent
                            follow-through on commitments
                        </li>
                        <li>
                            Comfortable taking ownership of projects and making
                            informed decisions
                        </li>
                        <li>
                            Adaptable learner who responds well to feedback and
                            new challenges
                        </li>
                        <li>
                            Calm under pressure with a structured and logical
                            approach to problem solving
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>Projects</h2>

                    <article>
                        <h3>CappaShare (Team Project)</h3>
                        <p className="meta">Team Lead · Agile Development</p>
                        <ul>
                            <li>
                                Served as team leader for an agile development
                                project, coordinating sprint planning and task
                                allocation
                            </li>
                            <li>
                                Facilitated regular check-ins to track progress,
                                resolve blockers, and maintain team momentum
                            </li>
                            <li>
                                Balanced technical decision-making with team
                                input to ensure shared understanding and buy-in
                            </li>
                            <li>
                                Supported team members by clarifying
                                requirements and adapting plans as project needs
                                evolved
                            </li>
                            <li>
                                Demonstrated leadership through accountability,
                                communication, and steady delivery across
                                sprints
                            </li>
                        </ul>
                    </article>

                    <article>
                        <h3>CappaChat</h3>
                        <p className="meta">TypeScript · Preact · Deno</p>
                        <ul>
                            <li>
                                Led a team of developers towards making a real
                                time chat application
                            </li>
                            <li>
                                Employed modern web standards like Preact,
                                argon2, and Deno
                            </li>
                            <li>Ensured type safety with TypeScript</li>
                        </ul>
                    </article>
                </section>

                <section>
                    <h2>Education</h2>
                    <article>
                        <h3>NCEA Level 1, 2, 3</h3>
                        <p className="meta">New Zealand</p>
                        <p>
                            Strong focus on digital technologies, collaboration,
                            problem solving, and independent responsibility for
                            learning outcomes.
                        </p>
                    </article>
                </section>

                <section>
                    <h2>Interests</h2>
                    <p>
                        Open-source software, backend development, self-hosting,
                        game development, and technical content creation.
                    </p>
                </section>
            </main>

            <footer id="footer-section">
                <p>
                    References available on request
                </p>
            </footer>
        </div>
    );
}
