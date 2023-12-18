import { Timer } from "./types";

export function handleUndefinedTimeLength(number: number | undefined) {
    if (number) {
        return number;
    }
    return 0;
}

export function minuteWording(number: number) {
    return "minute".concat(number > 1 ? "s" : "");
}

export function generateHtmlInstructions(formTimers: Timer[] | undefined) {
    if (!formTimers || !formTimers[0]) {
        return undefined;
    }

    const elements = [
        <span className="instruction" key={0}>
            <strong>{formTimers[0].timeName}</strong> goes in first for{" "}
            <strong>
                {formTimers[0].timeLength}{" "}
                {minuteWording(
                    handleUndefinedTimeLength(formTimers[0].timeLength)
                )}
            </strong>
        </span>,
    ];
    for (let i = 1; i < formTimers.length; i++) {
        if (formTimers[i].timeAfter === 0) {
            elements.push(
                <span className="instruction" key={i}>
                    <strong>{formTimers[i].timeName}</strong> starts at the{" "}
                    <strong>same time</strong> as{" "}
                    <strong>{formTimers[i - 1].timeName}</strong>
                </span>
            );
        } else {
            elements.push(
                <span className="instruction" key={i}>
                    <strong>{formTimers[i].timeName}</strong> starts{" "}
                    <strong>
                        {formTimers[i].timeAfter}{" "}
                        {minuteWording(formTimers[i].timeAfter)}
                    </strong>{" "}
                    after {formTimers[i - 1].timeName} and goes in for{" "}
                    <strong>
                        {formTimers[i].timeLength}{" "}
                        {minuteWording(
                            handleUndefinedTimeLength(formTimers[i].timeLength)
                        )}
                    </strong>
                </span>
            );
        }
    }
    return elements;
}
export function generatePlainTextInstructions(formTimers: Timer[] | undefined) {
    if (!formTimers || !formTimers[0]) {
        return undefined;
    }

    const elements = [
        `1. ${formTimers[0].timeName} goes in first for ${
            formTimers[0].timeLength
        } ${minuteWording(
            handleUndefinedTimeLength(formTimers[0].timeLength)
        )}`,
    ];
    for (let i = 1; i < formTimers.length; i++) {
        if (formTimers[i].timeAfter === 0) {
            elements.push(
                `${i + 1}. ${
                    formTimers[i].timeName
                } starts at the same time as ${formTimers[i - 1].timeName}`
            );
        } else {
            elements.push(
                `${i + 1}. ${formTimers[i].timeName} starts ${
                    formTimers[i].timeAfter
                } ${minuteWording(formTimers[i].timeAfter)} after ${
                    formTimers[i - 1].timeName
                } and goes in for ${formTimers[i].timeLength} ${minuteWording(
                    handleUndefinedTimeLength(formTimers[i].timeLength)
                )}`
            );
        }
    }
    return elements;
}
