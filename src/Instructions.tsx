import { useCallback, useState } from "react";

export const Instructions: React.FC<{
    instructions: JSX.Element[];
    plainTextInstructions: string[];
}> = ({ instructions, plainTextInstructions }) => {
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
                {instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
            </ol>
            <button
                type="button"
                className="item"
                onClick={handleCopyInstructions}
            >
                {copyClipboardWording}
            </button>
        </footer>
    );
};