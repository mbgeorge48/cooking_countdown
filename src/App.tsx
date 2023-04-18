import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";

interface Timer {
    timeName: string;
    timeLength: number;
    timeAfter: number;
}
interface Values {
    timers: Timer[];
}

function minuteWording(number: number) {
    return "minute".concat(number > 1 ? "s" : "");
}

const App: React.FC = () => {
    const initialValues: Values = {
        timers: [
            {
                timeName: "",
                timeLength: 0,
                timeAfter: 0,
            },
        ],
    };
    const [baseTimers, setBaseTimers] = useState<Timer[]>();
    const [instructions, setInstructions] = useState<JSX.Element[]>();

    useEffect(() => {
        if (baseTimers && baseTimers[0]) {
            const elements = [
                <span className="instruction">
                    {`${baseTimers[0].timeName} goes in first for ${baseTimers[0].timeLength
                        } ${minuteWording(baseTimers[0].timeLength)}`}
                </span>,
            ];
            for (let i = 1; i < baseTimers.length; i++) {
                elements.push(
                    <span className="instruction">
                        {`${baseTimers[i].timeName} starts ${baseTimers[i].timeAfter
                            } ${minuteWording(baseTimers[i].timeAfter)} after ${baseTimers[i - 1].timeName
                            } and goes in for ${baseTimers[i].timeLength}`}
                    </span>
                );
            }
            setInstructions(elements);
        }
    }, [baseTimers]);

    const handleSubmit = useCallback((values: Values) => {
        const formattedTimers = values.timers
            .slice()
            .filter((timer) => timer.timeLength > 0)
            .filter((timer) => timer.timeName)
            .sort(function (a, b) {
                return a.timeLength - b.timeLength;
            })
            .reverse();
        if (formattedTimers.length > 1) {
            for (let i = 1; i < formattedTimers.length; i++) {
                formattedTimers[i].timeAfter = Math.abs(
                    formattedTimers[i].timeLength -
                    formattedTimers[i - 1].timeLength
                );
            }
        }
        setBaseTimers(formattedTimers);
    }, []);

    return (
        <div className="App">
            <div className="container border">
                <h1>Cooking Timers</h1>
                <p>Simply enter the food item and the time it takes to cook, add as many timers as you like.<br />Hit go when you're ready!</p>
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
                                                        <div className="field">
                                                            <Field
                                                                className="item border"
                                                                name={`timers.${index}.timeName`}
                                                                id={`timers.${index}.timeName`}
                                                                type="text"
                                                                placeholder="Pizza"
                                                            />
                                                            <label htmlFor={`timers.${index}.timeName`}>Food Item</label>
                                                        </div>
                                                        <div className="field">
                                                            <Field
                                                                className="item border number"
                                                                name={`timers.${index}.timeLength`}
                                                                id={`timers.${index}.timeLength`}
                                                                type="number"
                                                            />
                                                            <label htmlFor={`timers.${index}.timeLength`}>Cooking Time</label>
                                                        </div>
                                                        <button
                                                            className="item"
                                                            type="button"
                                                            onClick={() =>
                                                                remove(index)
                                                            }
                                                            style={{
                                                                visibility:
                                                                    index === 0
                                                                        ? "hidden"
                                                                        : undefined,
                                                            }}
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
                                                    timeLength: 0,
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
                </div>
            ) : undefined}
        </div>
    );
};

export default App;
