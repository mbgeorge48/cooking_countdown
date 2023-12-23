import { Field, Form, Formik } from "formik";
import { useState } from "react";

import { Timer } from "./types";

interface Props {
    timerData: Timer[];
}

export function AdvancedMode(props: Props) {
    const [responseOk, setResponseOk] = useState<boolean>(false);
    const initialValues = { url: "" };

    const handleSubmit = async (values: { url: string }) => {
        console.log({ values });
        const response = await fetch(values.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(props.timerData),
        });
        const responseSuccess = await response.ok;
        setResponseOk(responseSuccess);
    };

    return (
        <>
            <p>
                Experimental! Posts the form data to a URL so you can
                programmatically set timers
            </p>
            <p>
                Not aware of any endpoints that accept this data at the minute
            </p>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {() => (
                    <Form className="grid">
                        <div className="field food-item">
                            <Field
                                className="item border"
                                name="url"
                                type="url"
                                placeholder="https://example.com/set-timers"
                                pattern="https?://.*"
                                size="30"
                                required
                            />
                            <label htmlFor="url">
                                URL you'd like to POST the data to
                            </label>
                        </div>
                        <button type="submit" className="item">
                            Post!
                        </button>
                        {responseOk && <p>Success!</p>}
                    </Form>
                )}
            </Formik>
        </>
    );
}
