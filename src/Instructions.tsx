import { useCallback, useState } from "react";

import { Timer } from "./types";
import {
    generateHtmlInstructions,
    generatePlainTextInstructions,
} from "./utils";

interface Props {
    timerData: Timer[];
    buttonRef: React.RefObject<HTMLButtonElement>;
}

export const Instructions = (props: Props) => {
    const plainTextInstructions = generatePlainTextInstructions(
        props.timerData
    );
    const htmlInstructions = generateHtmlInstructions(props.timerData);

    const copyClipboardWordingDefault = "Copy to Clipboard";
    const [copyClipboardWording, setCopyClipboardWording] = useState<string>(
        copyClipboardWordingDefault
    );

    const handleCopyInstructions = useCallback(() => {
        if (!window.isSecureContext) {
            alert(
                "Unable to copy, looks like the website is on an unsecure origin"
            );
        } else {
            plainTextInstructions &&
                navigator.clipboard.writeText(
                    plainTextInstructions.join("\r\n")
                );
            setCopyClipboardWording("Copied!");
            setTimeout(() => {
                setCopyClipboardWording(copyClipboardWordingDefault);
            }, 1000);
        }
    }, [plainTextInstructions]);

    return (
        <footer className="container border">
            <ol type="1">
                {htmlInstructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
            </ol>
            <button
                type="button"
                className="item"
                onClick={handleCopyInstructions}
                ref={props.buttonRef}
            >
                {copyClipboardWording}
            </button>
        </footer>
    );
};
