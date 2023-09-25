import { Field } from "formik";

export const CookingTimeField: React.FC<{ index: number }> = ({ index }) => {
    return (
        <div className="field cooking-time">
            <Field
                className="item border number"
                name={`timers.${index}.timeLength`}
                id={`timers.${index}.timeLength`}
                type="number"
            />
            <label htmlFor={`timers.${index}.timeLength`}>
                Cooking Time (mins)
            </label>
        </div>
    );
};
