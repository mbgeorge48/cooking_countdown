import { ArrayHelpers, FieldArray, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Contact } from "./Contact";
import { CookingTimeField } from "./CookingTimeField";
import { FoodItemField } from "./FoodItemField";
import { Heading } from "./Heading";
import { Instructions } from "./Instructions";
import { Values } from "./types";
import {
    generateHtmlInstructions,
    generatePlainTextInstructions,
    handleUndefinedTimeLength,
} from "./utils";

export function App() {
    const [storedTimers, setStoredTimers] = useState<string | null>(
        window.localStorage.getItem("timers")
    );

    const [instructions, setInstructions] = useState<JSX.Element[]>();
    const [plainTextInstructions, setPlainTextInstructions] =
        useState<string[]>();

    useEffect(() => {
        if (storedTimers) {
            setPlainTextInstructions(
                generatePlainTextInstructions(JSON.parse(storedTimers))
            );
            setInstructions(generateHtmlInstructions(JSON.parse(storedTimers)));
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
