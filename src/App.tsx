import { ArrayHelpers, FieldArray, Form, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { Contact } from "./Contact";
import { CookingTimeField } from "./CookingTimeField";
import { FoodItemField } from "./FoodItemField";
import { Heading } from "./Heading";
import { Instructions } from "./Instructions";

type Timer = {
    timeName: string;
    timeLength: number | undefined;
    timeAfter: number;
};
type Values = {
    timers: Timer[];
};

function handleUndefinedTimeLength(number: number | undefined) {
    if (number) {
        return number;
    }
    return 0;
}

function minuteWording(number: number) {
    return "minute".concat(number > 1 ? "s" : "");
}

function generateHtmlInstructions(formTimers: Timer[] | undefined) {
    if (!formTimers || !formTimers[0]) {
        return undefined;
    }

    const elements = [
        <span className="instruction" key={0}>
            <strong>{formTimers[0].timeName}</strong> goes in first for{" "}
            <strong>
                {formTimers[0].timeLength}{" "}
                {minuteWording(
                    handleUndefinedTimeLength(formTimers[0].timeLength)
                )}
            </strong>
        </span>,
    ];
    for (let i = 1; i < formTimers.length; i++) {
        if (formTimers[i].timeAfter === 0) {
            elements.push(
                <span className="instruction" key={i}>
                    <strong>{formTimers[i].timeName}</strong> starts at the{" "}
                    <strong>same time</strong> as{" "}
                    <strong>{formTimers[i - 1].timeName}</strong>
                </span>
            );
        } else {
            elements.push(
                <span className="instruction" key={i}>
                    <strong>{formTimers[i].timeName}</strong> starts{" "}
                    <strong>
                        {formTimers[i].timeAfter}{" "}
                        {minuteWording(formTimers[i].timeAfter)}
                    </strong>{" "}
                    after {formTimers[i - 1].timeName} and goes in for{" "}
                    <strong>
                        {formTimers[i].timeLength}{" "}
                        {minuteWording(
                            handleUndefinedTimeLength(formTimers[i].timeLength)
                        )}
                    </strong>
                </span>
            );
        }
    }
    return elements;
}
function generatePlainTextInstructions(formTimers: Timer[] | undefined) {
    if (!formTimers || !formTimers[0]) {
        return undefined;
    }

    const elements = [
        `1. ${formTimers[0].timeName} goes in first for ${
            formTimers[0].timeLength
        } ${minuteWording(
            handleUndefinedTimeLength(formTimers[0].timeLength)
        )}`,
    ];
    for (let i = 1; i < formTimers.length; i++) {
        if (formTimers[i].timeAfter === 0) {
            elements.push(
                `${i + 1}. ${
                    formTimers[i].timeName
                } starts at the same time as ${formTimers[i - 1].timeName}`
            );
        } else {
            elements.push(
                `${i + 1}. ${formTimers[i].timeName} starts ${
                    formTimers[i].timeAfter
                } ${minuteWording(formTimers[i].timeAfter)} after ${
                    formTimers[i - 1].timeName
                } and goes in for ${formTimers[i].timeLength} ${minuteWording(
                    handleUndefinedTimeLength(formTimers[i].timeLength)
                )}`
            );
        }
    }
    return elements;
}

export function App() {
    const [storedTimers, setStoredTimers] = useState<string | null>(
        window.localStorage.getItem("timers")
    );

    const [instructions, setInstructions] = useState<JSX.Element[]>();
    const [plainTextInstructions, setPlainTextInstructions] =
        useState<string[]>();

    useEffect(() => {
        const timers = window.localStorage.getItem("timers");
        if (timers) {
            setPlainTextInstructions(
                generatePlainTextInstructions(JSON.parse(timers))
            );
            setInstructions(generateHtmlInstructions(JSON.parse(timers)));
        }
    }, [storedTimers]);

    const emptyTimer = {
        timeName: "",
        timeLength: undefined,
        timeAfter: 0,
    };
    const initialValues: Values = {
        timers: storedTimers ? JSON.parse(storedTimers) : [emptyTimer],
    };
    console.log({ storedTimers });

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

        setStoredTimers(JSON.stringify(formattedTimers));
        window.localStorage.setItem("timers", JSON.stringify(formattedTimers));
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
}
