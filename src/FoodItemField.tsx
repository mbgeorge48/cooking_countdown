import { Field } from "formik";

export const FoodItemField: React.FC<{ index: number }> = ({ index }) => {
    return (
        <div className="field food-item">
            <Field
                className="item border"
                name={`timers.${index}.timeName`}
                id={`timers.${index}.timeName`}
                type="text"
            />
            <label htmlFor={`timers.${index}.timeName`}>Food Item</label>
        </div>
    );
};
