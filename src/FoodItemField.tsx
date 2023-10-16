import { Field } from "formik";

interface Props {
    index: number;
}

export const FoodItemField = (props: Props) => {
    return (
        <div className="field food-item">
            <Field
                className="item border"
                name={`timers.${props.index}.timeName`}
                id={`timers.${props.index}.timeName`}
                type="text"
            />
            <label htmlFor={`timers.${props.index}.timeName`}>Food Item</label>
        </div>
    );
};
