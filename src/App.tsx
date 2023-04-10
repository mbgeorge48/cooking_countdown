import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import "./App.css";

interface Timer {
    timeName: string;
    timeLength: number;
    timeAfter?: number;
}
interface Values {
    timers: Timer[];
}

const App: React.FC = () => {
    const [baseTimers, setBaseTimers] = useState<Timer[] | undefined>();
    const [instructions, setInstructions] = useState<
        JSX.Element[] | undefined
    >();

    const initialValues: Values = {
        timers: [
            {
                timeName: "",
                timeLength: 0,
            },
        ],
    };

    useEffect(() => {
        if (baseTimers) {
            const elements = [];
            for (let i = 1; i < baseTimers.length; i++) {
                elements.push(
                    <span>
                        {`${baseTimers[i].timeName} starts ${
                            baseTimers[i].timeAfter
                        } minutes after ${
                            baseTimers[i - 1].timeName
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
            .sort(function (a, b) {
                return a.timeLength - b.timeLength;
            })
            .reverse();
        for (let i = 1; i < formattedTimers.length; i++) {
            formattedTimers[i].timeAfter = Math.abs(
                formattedTimers[i].timeLength -
                    formattedTimers[i - 1].timeLength
            );
        }
        setBaseTimers(formattedTimers);
    }, []);

    // useCallback(() => {
    //     if (baseTimers) {
    //         for (let i = 1; i < baseTimers.length; i++) {
    //             console.log(
    //                 `${baseTimers[i].timeName} starts ${
    //                     baseTimers[i].timeAfter
    //                 } ${baseTimers[i - 1].timeName} and goes on for ${
    //                     baseTimers[i - 1].timeLength
    //                 }
    //                 )} minutes after ${baseTimers[i - 1].timeName}`
    //             );
    //         }
    //     }
    // }, [baseTimers]);

    return (
        <div className="App">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form>
                        <FieldArray name="timers">
                            {({ remove, push }) => (
                                <div>
                                    {values.timers.length > 0 &&
                                        values.timers.map((timer, index) => (
                                            <div className="row" key={index}>
                                                <div className="row">
                                                    <label
                                                        htmlFor={`timers.${index}`}
                                                    >
                                                        Timer {index}
                                                    </label>
                                                    <Field
                                                        name={`timers.${index}.timeName`}
                                                        type="text"
                                                    />
                                                    <Field
                                                        name={`timers.${index}.timeLength`}
                                                        type="number"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="secondary"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() =>
                                            push({
                                                timeName: "",
                                                timeLength: 0,
                                            })
                                        }
                                    >
                                        Add Timer
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <button type="submit">Go!</button>
                    </Form>
                )}
            </Formik>

            {instructions &&
                instructions.map((step, index) => {
                    return (
                        <span key={index} style={{ display: "block" }}>
                            {step}
                        </span>
                    );
                })}
        </div>
    );
};

export default App;
