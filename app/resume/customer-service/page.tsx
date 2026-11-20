import Contact from "../contact";
import Header from "../header";
import { Profile } from "../profile.tsx";
import { Projects } from "../projects.tsx";

export default function Page() {
    return (
        <div id="main-grid">
            <Header description="Customer service" />

            <aside id="left-section">
                <Contact />

                <section>
                    <h2>Key Strengths</h2>
                    <ul>
                        <li>Positive attitude</li>
                        <li>Kindness and consideration towards others</li>
                        <li>Clear and respectful communication</li>
                        <li>Works well in a team environment</li>
                        <li>Comfortable taking responsibility</li>
                        <li>Quick learner</li>
                        <li>Calm under pressure</li>
                    </ul>
                </section>

                <section>
                    <h2>Awards</h2>
                    <h3>Northcote College</h3>
                    <h4>Year 13</h4>
                    <ul>
                        <li>Business and Administration Computing Cup</li>
                        <li>The Stebbing Cup for Physics</li>
                        <li>Prize in Web Media Design</li>
                        <li>Excellent Achievement in Statistics</li>
                    </ul>
                    <h4>Year 12</h4>
                    <ul>
                        <li>Prize in Web Media Design</li>
                        <li>Prize in Physics</li>
                        <li>
                            Consistent High Achievement in Creative and
                            Innovative Technologies
                        </li>
                        <li>Open day helper</li>
                    </ul>
                    <h4>Year 11</h4>
                    <ul>
                        <li>Information Technology Cup</li>
                        <li>Prize in Digital Creative Technology</li>
                        <li>Senior Service Award</li>
                    </ul>
                    <h4>Year 10</h4>
                    <ul>
                        <li>Attainment in Mathematics</li>
                        <li>Achievement in Health Education</li>
                        <li>Junior Service Award</li>
                    </ul>
                </section>
            </aside>

            <main id="right-section">
                <Profile />

                <section style={{ textAlign: "justify" }}>
                    <h2></h2>
                    <p>
                        Demonstrates strong academic ability and a proven
                        aptitude for technology, computing, science and
                        problem-solving, recognised through three subject
                        achievement awards at Northcote College:{" "}
                        <strong>
                            the Business and Administration Computing Cup, the
                            Stebbing Cup for Physics, and the Year 11 IT Cup
                        </strong>. These achievements reflect strong analytical
                        and logical thinking, technical proficiency, attention
                        to detail and the ability to understand and apply
                        complex concepts. They also demonstrate a willingness to
                        learn, academic commitment and the ability to achieve
                        across a range of disciplines.
                    </p>
                </section>

                <section>
                    <h2>Education</h2>

                    <article>
                        <h3>Northcote College{/* (2021 - 2026)*/}</h3>
                        <ul>
                            <li>NCEA Level 3 (University Entrance pending)</li>
                            <li>Three subject cups awarded</li>
                            <li>Multiple subject endorsements</li>
                        </ul>

                        <h3>Techtorium</h3>
                        <h4>
                            <a href="https://techtorium.ac.nz/teachers-portal/tech-pathways/">
                                Tech Pathways program
                            </a>{" "}
                            - Networking and Computing
                        </h4>
                    </article>
                </section>

                <section>
                    <h2>Volunteering and Events</h2>

                    <article>
                        <h3>Techies Group - Northcote College</h3>
                        <p className="meta">Photographer & Camera Operator</p>
                        <ul>
                            <li>
                                Worked as part of a team supporting school
                                events and activities
                            </li>
                            <li>
                                Operated cameras and photography equipment
                                during live events
                            </li>
                            <li>
                                Followed instructions and event schedules to
                                ensure smooth operation
                            </li>
                            <li>
                                Demonstrated reliability by arriving prepared
                                and on time for events
                            </li>
                            <li>
                                Participated as lighting technician at the
                                Pumphouse Theatre
                            </li>
                        </ul>
                        <p>
                            I also actively participated in open days throughout
                            my school life, recognised by many service awards
                        </p>
                    </article>
                </section>

                <Projects />
            </main>

            <footer id="footer-section">
                <p>
                    References available on request
                </p>
            </footer>
        </div>
    );
}
