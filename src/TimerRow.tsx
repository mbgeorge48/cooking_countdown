import { CookingTimeField } from "./CookingTimeField";
import { FoodItemField } from "./FoodItemField";

interface Props {
    index: number;
    removeTimer: (index: number) => void | undefined;
}

export function TimerRow(props: Props) {
    const { index, removeTimer } = props;
    return (
        <div className="grid" key={index}>
            <FoodItemField index={index} />
            <CookingTimeField index={index} />
            <button
                className={`clear-button${
                    index === 0 ? " initial-clear-button" : ""
                }`}
                type="button"
                onClick={() => removeTimer(index)}
            >
                Clear
            </button>
        </div>
    );
}
