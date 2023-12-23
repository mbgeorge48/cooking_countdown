import { ArrayHelpers, FieldArray, Form, Formik } from "formik";
import { useCallback, useRef, useState } from "react";

import { AdvancedMode } from "./AdvancedMode";
import { Contact } from "./Contact";
import { Heading } from "./Heading";
import { Instructions } from "./Instructions";
import { TimerRow } from "./TimerRow";
import { Timer, Values } from "./types";
import { formatTimers } from "./utils";

export function App() {
    const instructionsRef = useRef<HTMLButtonElement>(null);
    const [storedTimers, setStoredTimers] = useState<string | null>(
        window.localStorage.getItem("timers")
    );

    const [timerData, setTimerData] = useState<Timer[] | null>(
        storedTimers && JSON.parse(storedTimers)
    );
    const advancedMode = window.location.pathname.toLowerCase() === "/advanced";

    const emptyTimer = {
        timeName: "",
        timeLength: "",
        timeAfter: 0,
    };
    const initialValues: Values = {
        timers: storedTimers ? JSON.parse(storedTimers) : [emptyTimer],
    };

    const handleSubmit = useCallback((values: Values) => {
        const formattedTimers = formatTimers(values.timers);

        if (formattedTimers.length > 0) {
            setTimerData(formattedTimers);
            setStoredTimers(JSON.stringify(formattedTimers));
            window.localStorage.setItem(
                "timers",
                JSON.stringify(formattedTimers)
            );
            instructionsRef.current?.scrollIntoView();
        }
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
                {timerData && (
                    <div>
                        <Instructions
                            timerData={timerData}
                            buttonRef={instructionsRef}
                        />
                        {advancedMode && timerData && (
                            <AdvancedMode timerData={timerData} />
                        )}
                    </div>
                )}
            </div>
            <Contact />
        </>
    );
}
