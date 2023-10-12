import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form, FieldArray, ArrayHelpers } from "formik";
import { FoodItemField } from "./FoodItemField";
import { CookingTimeField } from "./CookingTimeField";
import { Heading } from "./Heading";
import { Instructions } from "./Instructions";
import { Contact } from "./Contact";

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
function generatePlainTextInstructions(baseTimers: Timer[] | undefined) {
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
    const emptyTimer = {
        timeName: "",
        timeLength: undefined,
        timeAfter: 0,
    };
    const initialValues: Values = {
        timers: [emptyTimer],
    };
    const [baseTimers, setBaseTimers] = useState<Timer[]>();
    const [instructions, setInstructions] = useState<JSX.Element[]>();
    const [plainTextInstructions, setPlainTextInstructions] =
        useState<string[]>();

    useEffect(() => {
        setInstructions(generateHtmlInstructions(baseTimers));
        setPlainTextInstructions(generatePlainTextInstructions(baseTimers));
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

    return (
        <>
            <div className="wrapper">
                <div className="container border">
                    <Heading />
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ values }) => (
                            <main>
                                <Form>
                                    <FieldArray name="timers">
                                        {({ remove, push }: ArrayHelpers) => (
                                            <div>
                                                {values.timers.length > 0 &&
                                                    values.timers.map(
                                                        (timer, index) => (
                                                            <div
                                                                className="grid"
                                                                key={index}
                                                            >
                                                                <FoodItemField
                                                                    index={
                                                                        index
                                                                    }
                                                                />
                                                                <CookingTimeField
                                                                    index={
                                                                        index
                                                                    }
                                                                />
                                                                <button
                                                                    className={`clear-button${
                                                                        index ===
                                                                        0
                                                                            ? " initial-clear-button"
                                                                            : ""
                                                                    }`}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index
                                                                        )
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
                                                        push(emptyTimer)
                                                    }
                                                >
                                                    Add Timer
                                                </button>
                                                <button
                                                    className="item"
                                                    type="submit"
                                                >
                                                    Go!
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </Form>
                            </main>
                        )}
                    </Formik>
                </div>
                {instructions && plainTextInstructions && (
                    <Instructions
                        instructions={instructions}
                        plainTextInstructions={plainTextInstructions}
                    />
                )}
            </div>
            <Contact />
        </>
    );
};

export default App;
