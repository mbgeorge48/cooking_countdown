import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";

interface Timer {
    timeName: string;
    timeLength: number | undefined;
    timeAfter: number;
}
interface Values {
    timers: Timer[];
}

function handleUndefinedTimeLength(number: number | undefined) {
    if (number) {
        return number;
    }
    return 0;
}

function minuteWording(number: number) {
    return "minute".concat(number > 1 ? "s" : "");
}

function generateHtmlInstructions(baseTimers: Timer[] | undefined) {
    if (!baseTimers || !baseTimers[0]) {
        return undefined;
    }

    const elements = [
        <span className="instruction">
            <strong>{baseTimers[0].timeName}</strong> goes in first for{" "}
            <strong>
                {baseTimers[0].timeLength}{" "}
                {minuteWording(
                    handleUndefinedTimeLength(baseTimers[0].timeLength)
                )}
            </strong>
        </span>,
    ];
    for (let i = 1; i < baseTimers.length; i++) {
        if (baseTimers[i].timeAfter === 0) {
            elements.push(
                <span className="instruction">
                    <strong>{baseTimers[i].timeName}</strong> starts at the{" "}
                    <strong>same time</strong> as{" "}
                    <strong>{baseTimers[i - 1].timeName}</strong>
                </span>
            );
        } else {
            elements.push(
                <span className="instruction">
                    <strong>{baseTimers[i].timeName}</strong> starts{" "}
                    <strong>
                        {baseTimers[i].timeAfter}{" "}
                        {minuteWording(baseTimers[i].timeAfter)}
                    </strong>{" "}
                    after {baseTimers[i - 1].timeName} and goes in for{" "}
                    <strong>
                        {baseTimers[i].timeLength}{" "}
                        {minuteWording(
                            handleUndefinedTimeLength(baseTimers[i].timeLength)
                        )}
                    </strong>
                </span>
            );
        }
    }
    return elements;
}
function generateRawInstructions(baseTimers: Timer[] | undefined) {
    if (!baseTimers || !baseTimers[0]) {
        return undefined;
    }

    const elements = [
        `1. ${baseTimers[0].timeName} goes in first for ${
            baseTimers[0].timeLength
        } ${minuteWording(
            handleUndefinedTimeLength(baseTimers[0].timeLength)
        )}`,
    ];
    for (let i = 1; i < baseTimers.length; i++) {
        if (baseTimers[i].timeAfter === 0) {
            elements.push(
                `${i + 1}. ${
                    baseTimers[i].timeName
                } starts at the same time as ${baseTimers[i - 1].timeName}`
            );
        } else {
            elements.push(
                `${i + 1}. ${baseTimers[i].timeName} starts ${
                    baseTimers[i].timeAfter
                } ${minuteWording(baseTimers[i].timeAfter)} after ${
                    baseTimers[i - 1].timeName
                } and goes in for ${baseTimers[i].timeLength} ${minuteWording(
                    handleUndefinedTimeLength(baseTimers[i].timeLength)
                )}`
            );
        }
    }
    return elements;
}

const App: React.FC = () => {
    const initialValues: Values = {
        timers: [
            {
                timeName: "",
                timeLength: undefined,
                timeAfter: 0,
            },
        ],
    };
    const [baseTimers, setBaseTimers] = useState<Timer[]>();
    const [instructions, setInstructions] = useState<JSX.Element[]>();
    const [rawInstructions, setRawInstructions] = useState<string[]>();
    const copyClipboardWordingDefault = "Copy to Clipboard";
    const [copyClipboardWording, setCopyClipboardWording] = useState<string>(
        copyClipboardWordingDefault
    );

    useEffect(() => {
        setInstructions(generateHtmlInstructions(baseTimers));
        setRawInstructions(generateRawInstructions(baseTimers));
    }, [baseTimers]);

    const handleSubmit = useCallback((values: Values) => {
        const formattedTimers = values.timers
            .slice()
            .filter((timer) => handleUndefinedTimeLength(timer.timeLength) > 0)
            .filter((timer) => timer.timeName)
            .sort(function (a, b) {
                return (
                    handleUndefinedTimeLength(a.timeLength) -
                    handleUndefinedTimeLength(b.timeLength)
                );
            })
            .reverse();
        if (formattedTimers.length > 1) {
            for (let i = 1; i < formattedTimers.length; i++) {
                formattedTimers[i].timeAfter = Math.abs(
                    handleUndefinedTimeLength(formattedTimers[i].timeLength) -
                        handleUndefinedTimeLength(
                            formattedTimers[i - 1].timeLength
                        )
                );
            }
        }
        setBaseTimers(formattedTimers);
    }, []);

    const handleCopyInstructions = useCallback(() => {
        if (!window.isSecureContext) {
            alert(
                "Unable to copy, looks like the website is on an unsecure origin"
            );
        } else {
            rawInstructions &&
                navigator.clipboard
                    .writeText(rawInstructions.join("\r\n"))
                    .then(() => {
                        alert("successfully copied");
                    });
            setCopyClipboardWording("Copied!");
            setTimeout(() => {
                setCopyClipboardWording(copyClipboardWordingDefault);
            }, 500);
        }
    }, [rawInstructions]);

    return (
        <div className="wrapper">
            <div className="container border">
                <h1>Cooking Countdown!</h1>
                <p>
                    Simply enter the food item and the time it takes to cook,
                    add as many timers as you like.
                    <br />
                    Hit go when you're ready!
                </p>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form>
                            <FieldArray name="timers">
                                {({ remove, push }) => (
                                    <div>
                                        {values.timers.length > 0 &&
                                            values.timers.map(
                                                (timer, index) => (
                                                    <div
                                                        className="grid"
                                                        key={index}
                                                    >
                                                        <div className="field food-item">
                                                            <Field
                                                                className="item border"
                                                                name={`timers.${index}.timeName`}
                                                                id={`timers.${index}.timeName`}
                                                                type="text"
                                                            />
                                                            <label
                                                                htmlFor={`timers.${index}.timeName`}
                                                            >
                                                                Food Item
                                                            </label>
                                                        </div>
                                                        <div className="field cooking-time">
                                                            <Field
                                                                className="item border number"
                                                                name={`timers.${index}.timeLength`}
                                                                id={`timers.${index}.timeLength`}
                                                                type="number"
                                                            />
                                                            <label
                                                                htmlFor={`timers.${index}.timeLength`}
                                                            >
                                                                Cooking Time
                                                            </label>
                                                        </div>
                                                        <button
                                                            className={`item clear - button ${
                                                                index === 0 &&
                                                                "initial-clear-button"
                                                            } `}
                                                            type="button"
                                                            onClick={() =>
                                                                remove(index)
                                                            }
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )
                                            )}

                                        <button
                                            type="button"
                                            className="item"
                                            onClick={() =>
                                                push({
                                                    timeName: "",
                                                    timeLength: undefined,
                                                    timeAfter: 0,
                                                })
                                            }
                                        >
                                            Add Timer
                                        </button>
                                        <button className="item" type="submit">
                                            Go!
                                        </button>
                                    </div>
                                )}
                            </FieldArray>
                        </Form>
                    )}
                </Formik>
            </div>
            {instructions && instructions.length > 0 ? (
                <div className="container border">
                    <ol type="1">
                        {instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                    <button
                        type="button"
                        className="item"
                        onClick={handleCopyInstructions}
                    >
                        {copyClipboardWording}
                    </button>
                </div>
            ) : undefined}
        </div>
    );
};

export default App;
