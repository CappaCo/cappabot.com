import Contact from "./contact.tsx";
import Header from "./header.tsx";

export const metadata = {
    title: "Resume - Casper Howse",
};

export default function Page() {
    return (
        <div id="main-grid">
            <Header />

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
                    <h2>Awards & Involvements</h2>
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
                <section>
                    <h2>Profile</h2>
                    <p>
                        A friendly, considerate and motivated recent school
                        leaver with a strong academic background and a genuine
                        interest in helping others. Known for being reliable,
                        approachable and supportive of classmates, with
                        experience working collaboratively on school projects
                        and events. A quick learner who takes pride in doing
                        tasks well, communicating respectfully and taking
                        responsibility.
                        <br />
                        Seeking a local entry-level position over the summer,
                        with availability for weekend and casual work alongside
                        future university studies at the University of Auckland.
                    </p>
                </section>

                {
                    /*<section>
                    <h2>Leadership & Team Experience</h2>

                    <article>
                        <h3>Team Leader - Group Project</h3>
                        <p className="meta">Agile Team Environment</p>
                        <ul>
                            <li>
                                Selected as team leader responsible for
                                organising tasks and priorities
                            </li>
                            <li>
                                Helped plan weekly goals and ensured everyone
                                understood their responsibilities
                            </li>
                            <li>
                                Checked in regularly with team members to
                                support progress and resolve issues
                            </li>
                            <li>
                                Encouraged cooperation and clear communication
                                within the group
                            </li>
                        </ul>
                    </article>
                </section>*/
                }

                <section>
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
                            <li>NCEA Level 2</li>
                            <li>NCEA Level 1</li>
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
                        {
                            /*<h4>NCEA Level 3 (awaiting external grades)</h4>
                        <ul>
                            <li>The Stebbing Cup for Physics</li>
                            <li>Business and Administration Computing Cup</li>
                            <li>Prize in Web Media Design</li>
                            <li>Excellent Achievement in Statistics</li>
                        </ul>
                        <h4>NCEA Level 2</h4>
                        <ul>
                            <li>Level 2 Excellence endorsement</li>
                            <li>Subject endorsements</li>
                            <ul>
                                <li>Web Media Design - Excellence</li>
                                <li>
                                    Mathematics towards Statistics and Calculus
                                    - Excellence
                                </li>
                                <li>Physics - Excellence</li>
                            </ul>
                        </ul>
                        <h4>NCEA Level 1</h4>
                        <ul>
                            <li>Level 1 Merit endorsement</li>
                            <li>
                                Winner of the Year 11 IT Cup, recognising
                                problem solving, technical ability and hard work
                                in class
                            </li>
                            <li>Subject endorsements</li>
                            <ul>
                                <li>Digital Creative Technologies - Merit</li>
                                <li>Science - Merit</li>
                                <li>Food and Nutrition - Merit</li>
                            </ul>
                        </ul>*/
                        }
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

                {
                    /*<section>
                    <h2>Projects & Techinical experience</h2>
                </section>*/
                }

                {
                    /* <section>
                    <h2>Interests</h2>
                    <ul>
                        <li>
                            Self-taught software development starting in
                            intermediate
                        </li>
                        <ul>
                            <li>
                                JavaScript / TypeScript (browser and server)
                            </li>
                            <li>HTML, CSS</li>
                            <li>Linux (Mint, Arch, NixOS)</li>
                            <li>Basic networking skills</li>
                            <li>Cloudflare</li>
                            <li>SEO - #1 search result for CappaBot</li>
                        </ul>
                        <li>
                            I used these skills to build my website{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://cappabot.com"
                            >
                                cappabot.com
                            </a>
                        </li>
                        <li>
                            Awarded Gifted and Talented grant from{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.tki.org.nz"
                            >
                                Te Kete Ipurangi
                            </a>{" "}
                            which I used to further my coding skills
                        </li>
                        <li>
                            After identifying an issue in my maths class, I
                            independently designed a learning tool and worked
                            closely with the teacher through regular feedback
                            and iterative improvements. The tool was refined
                            based on classroom use and is still used to support
                            maths lessons at my high school.
                        </li>
                    </ul>
                </section> */
                }

                <section>
                    <h2>Projects & Hobbies</h2>
                    <ul>
                        <li>
                            After identifying an issue in my maths class, I
                            independently designed a learning tool and worked
                            closely with the teacher through regular feedback
                            and iterative improvements. The tool was refined
                            based on classroom use and is still used to support
                            maths lessons at my high school.
                        </li>
                        <li>
                            My love for programming started in primary school
                            and I continued progressing my skills throughout
                            school and years to come
                        </li>
                        <li>
                            I also like listening to (and perhaps creating)
                            music
                        </li>
                    </ul>
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
