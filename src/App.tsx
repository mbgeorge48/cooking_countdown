import { ArrayHelpers, FieldArray, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";

import { Contact } from "./Contact";
import { Heading } from "./Heading";
import { Instructions } from "./Instructions";
import { TimerRow } from "./TimerRow";
import { Values } from "./types";
import {
    formatTimers,
    generateHtmlInstructions,
    generatePlainTextInstructions,
} from "./utils";

export function App() {
    const [storedTimers, setStoredTimers] = useState<string | null>(
        window.localStorage.getItem("timers")
    );
    const [instructions, setInstructions] = useState<JSX.Element[]>();
    const [plainTextInstructions, setPlainTextInstructions] =
        useState<string[]>();

    const advancedMode = window.location.search.toLowerCase() === "advanced";

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
        const formattedTimers = formatTimers(values.timers);

        setStoredTimers(JSON.stringify(formattedTimers));
        window.localStorage.setItem("timers", JSON.stringify(formattedTimers));
    }, []);

    const handleReset = () => {
        window.localStorage.removeItem("timers");
        window.location.reload();
    };

    return (
        <>
            <div className="wrapper">
                <div className="container border">
                    <Heading />
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ values, dirty }) => (
                            <main>
                                <Form>
                                    <FieldArray name="timers">
                                        {({ remove, push }: ArrayHelpers) => (
                                            <div>
                                                {values.timers.length > 0 &&
                                                    values.timers.map(
                                                        (timer, index) => (
                                                            <TimerRow
                                                                key={index}
                                                                index={index}
                                                                removeTimer={
                                                                    remove
                                                                }
                                                            />
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
                                                    type="submit"
                                                    className="item"
                                                >
                                                    Go!
                                                </button>
                                                {(dirty || storedTimers) && (
                                                    <button
                                                        type="button"
                                                        className="item"
                                                        onClick={handleReset}
                                                    >
                                                        Reset timers
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </FieldArray>
                                </Form>
                            </main>
                        )}
                    </Formik>
                </div>
                {instructions && plainTextInstructions && (
                    <>
                        <Instructions
                            instructions={instructions}
                            plainTextInstructions={plainTextInstructions}
                        />
                        {advancedMode && <div />}
                    </>
                )}
            </div>
            <Contact />
        </>
    );
}
