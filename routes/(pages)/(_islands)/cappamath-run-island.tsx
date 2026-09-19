import { useRef } from "preact/hooks";

interface Question {
    question: string;
    answer: string;
    time: number;
}

interface Options {
    question: string;
    answer: string;
    selectedSets: Record<any, any>;
    sets: Record<any, any>;
    positiveAllowed: boolean;
    negativeAllowed: boolean;
    integerOnly: boolean;
    timePerQuestion: number;
}

export function CappaMathRunIsland() {
    console.log("CappaMathRunIsland doing it's thing");

    const screens = [...document.getElementsByClassName("screen")];
    const questionDisplayRef = useRef<HTMLSpanElement>(null);
    const questionLoadingBarRef = useRef<HTMLProgressElement>(null);
    const answersTableRef = useRef<HTMLTableSectionElement>(null);

    let skipToEndRequested = false;
    const pendingResolvers: any[] = [];

    const queryParams = new URLSearchParams(globalThis.location.search);
    const singleOptions = getOptions("CappaMath-options");
    let mixedOptions: Options[];
    if (singleOptions.mixedOptions) {
        console.log("using mixed options :O");
        mixedOptions = getOptions("CappaMath-mixedOptions");
    }

    const item = localStorage.getItem("CappaMath-preferences");
    if (item === null) {
        throw "preferences was null!";
    }
    const preferences = JSON.parse(item);

    const calculated: Question[] = [];

    function getOptions(optionsName: string) {
        return JSON.parse(getOptionsJSON(optionsName));
    }

    function getOptionsJSON(optionsName: string) {
        const search = optionsName || "CappaMath-options";
        const optionsParams = queryParams.get(search);
        if (optionsParams) {
            console.log("Getting options from url");
            return optionsParams;
        }

        const optionsStorage = localStorage.getItem(search);
        if (optionsStorage) {
            console.log("Getting options from localStorage");
            return optionsStorage;
        }

        throw new Error("No options could be found");
    }

    console.log("running with options:");
    console.log(singleOptions);

    changeScreen("start");
    calculateQuestions();
    showAnswers();

    function startButton() {
        changeScreen("questions");
        startQuestions();
    }

    function changeScreen(screenName: string) {
        screens.filter((el) => el.classList.contains("active")).forEach((el) =>
            el.classList.remove("active")
        );
        screens.filter((el) => el.id == `${screenName}Screen`)[0].classList.add(
            "active",
        );
    }

    function calculateQuestions() {
        console.log("calculating questions...");
        const allOptions = singleOptions.mixedOptions
            ? mixedOptions
            : [singleOptions];

        allOptions.forEach((options) => {
            for (let i = 0; i < options.numQuestions; i++) {
                calculated.push(calculateQuestion(options));
            }
        });

        shuffle(calculated);

        console.log("calculated:", calculated);
    }

    function calculateQuestion(
        options: Options,
    ): Question {
        console.log(
            "calculating using:",
            options.question,
            "=",
            options.answer,
        );

        const sets: Record<any, any> = {};

        for (const [key, value] of Object.entries(options.selectedSets)) {
            sets[key] = options.sets[value];
        }

        console.log("sets:", sets);

        const numbers: Record<any, any> = {};
        for (const [key, value] of Object.entries(sets)) {
            numbers[key] = Number(randomItem(value));
        }

        console.log("numbers:", numbers);

        let question = options.question;
        console.warn("question:", question);
        const matchThing = question.match(/n_\d+/gm);
        if (matchThing === null) {
            throw "matchThing was null?";
        }
        matchThing.forEach((match) => {
            console.log("found match", match);
            const split = match.split("_");
            question = question.replace(match, numbers[`num${split[1]}`]);
        });

        let answer = options.answer;
        const func = `return \`${answer}\``;
        console.log("func:", func);
        const calculate = new Function(...Object.keys(numbers), func);
        answer = calculate(...Object.values(numbers)).toString();
        console.log("answer:", answer);

        if (options.integerOnly) {
            if (!checkInteger(answer)) {
                console.log("non-integer detected, recalculating...");
                return calculateQuestion(options);
            }
        }

        const number = parseFloat(answer);
        if (options.positiveAllowed && !options.negativeAllowed) {
            if (number < 0) {
                console.log("negative answer detected, recalculating...");
                return calculateQuestion(options);
            }
        } else if (!options.positiveAllowed && options.negativeAllowed) {
            if (number > 0) {
                console.log("positive answer detected, recalculating...");
                return calculateQuestion(options);
            }
        } else if (!options.positiveAllowed && !options.negativeAllowed) {
            if (number != 0) {
                console.log("non-zero answer detected, recalculating...");
                return calculateQuestion(options);
            }
        }

        return {
            question: question,
            answer: answer,
            time: options.timePerQuestion,
        };
    }

    function checkInteger(answer: string) {
        // Check for division by zero, undefined  results
        if (
            answer == "NaN" || answer == "Infinity" || answer == "-Infinity" ||
            answer.includes(".")
        ) {
            return false;
        }
        return true;
    }

    function randomItem<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffle<T>(array: T[]): void {
        let currentIndex = array.length;

        while (currentIndex != 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
    }

    function startQuestions() {
        console.log("I'm spongebob!");

        const questionPromise = Promise.resolve();
        const questionsDone = calculated.reduce((promiseChain, calculation) => {
            return promiseChain.then(() => {
                return showQuestion(calculation.question, calculation.time);
            });
        }, questionPromise);

        questionsDone.then(() => {
            console.log("questions done!");
            if (preferences.answersWaitScreen) {
                changeScreen("answersWait");
            } else {
                changeScreen("answers");
            }
        });
    }

    function showQuestion(question: string, time: number) {
        return new Promise<void>((resolve) => {
            const questionDisplay = questionDisplayRef.current;
            if (questionDisplay === null) return;

            if (skipToEndRequested) return resolve();

            pendingResolvers.push(resolve);

            console.log("showing question");

            questionDisplay.innerText = question;
            global.MathJax.typeset([questionDisplay]);

            doQuestionLoadingBar(time).then(() => {
                resolve();
            });
        });
    }

    let loadingInterval: NodeJS.Timeout;
    function doQuestionLoadingBar(time: number) {
        return new Promise<void>((resolve) => {
            const questionLoadingBar = questionLoadingBarRef.current;
            if (questionLoadingBar === null) return;
            if (skipToEndRequested) return resolve();

            pendingResolvers.push(() => {
                clearInterval(loadingInterval);
                resolve();
            });

            let value = 0;
            const loadingUpdateTime = 0.1;

            questionLoadingBar.max = time;
            questionLoadingBar.value = 0;

            function updateBar() {
                if (skipToEndRequested) {
                    clearInterval(loadingInterval);
                    resolve();
                    return;
                }

                questionLoadingBar!.value = value;
                if (value > time) {
                    clearInterval(loadingInterval);
                    resolve();
                }
                value += loadingUpdateTime;
            }

            loadingInterval = setInterval(updateBar, loadingUpdateTime * 1000);
            updateBar();
        });
    }

    function showAnswers() {
        const answersTable = answersTableRef.current;
        if (answersTable === null) return;

        answersTable.innerHTML = "";
        for (const [i, calculation] of calculated.entries()) {
            const tr = document.createElement("tr");

            const no = document.createElement("td");
            no.innerText = String(i + 1);
            const questionCell = document.createElement("td");
            questionCell.innerHTML = calculation.question.replace("$$", "$i$");
            const answerCell = document.createElement("td");
            answerCell.innerText = `$i$${calculation.answer}$$`;

            tr.appendChild(no);
            tr.appendChild(questionCell);
            tr.appendChild(answerCell);

            answersTable.appendChild(tr);
        }
        global.MathJax.typeset([answersTable]);
    }

    function skipToEnd() {
        console.log("skipping to end");

        console.log(pendingResolvers);

        skipToEndRequested = true;

        for (const resolve of pendingResolvers) {
            console.log("resolving...");
            resolve();
        }
    }

    return (
        <>
            <div id="startScreen" class="screen">
                <div>
                    <h1>Welcome to CappaMath</h1>
                    <button type="button" onClick={startButton}>Start</button>
                </div>
            </div>

            <div id="questionsScreen" class="screen">
                <progress
                    id="questionLoadingBar"
                    ref={questionLoadingBarRef}
                    style="transition: none; animation: none;"
                >
                </progress>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                    <span id="questionDisplay" ref={questionDisplayRef}>
                        $$2+2$$
                    </span>
                </div>
                <button
                    type="button"
                    onClick={skipToEnd}
                    style="position: absolute; bottom: 0.5rem; right: 0.5rem; font-size: 0.7rem; padding: 0.5rem;"
                >
                    Skip to end
                </button>
            </div>

            <div id="answersWaitScreen" class="screen">
                <div>
                    <button
                        type="button"
                        onClick={(() => {
                            changeScreen("answers");
                        })()}
                    >
                        Show answers
                    </button>
                </div>
            </div>

            <div id="answersScreen" class="screen">
                <table>
                    <thead>
                        <th>#</th>
                        <th>question</th>
                        <th>answer</th>
                    </thead>
                    <tbody id="answersTable" ref={answersTableRef}>
                        <tr>
                            <td>
                                <i>Loading...</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
