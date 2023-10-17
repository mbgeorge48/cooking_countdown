import { Field } from "formik";

interface Props {
    index: number;
}

export const CookingTimeField = (props: Props) => {
    return (
        <div className="field cooking-time">
            <Field
                className="item border number"
                name={`timers.${props.index}.timeLength`}
                id={`timers.${props.index}.timeLength`}
                type="number"
            />
            <label htmlFor={`timers.${props.index}.timeLength`}>
                Cooking Time (mins)
            </label>
        </div>
    );
};
