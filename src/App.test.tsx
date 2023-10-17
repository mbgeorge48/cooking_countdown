import { fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
    test("renders the basic form", () => {
        const subject = render(<App />);
        expect(subject.getByText(/Cooking Countdown!/i));
        const buttons = subject.getAllByRole("button");

        expect(buttons).toHaveLength(3);
        expect(buttons[0].textContent).toBe("Clear");
        expect(buttons[1].textContent).toBe("Add Timer");
        expect(buttons[2].textContent).toBe("Go!");

        expect(subject.getAllByRole("textbox")).toHaveLength(1);
        expect(subject.getAllByRole("spinbutton")).toHaveLength(1);
    });

    test("adds new fields when button is pressed", async () => {
        const subject = render(<App />);

        expect(subject.getAllByRole("textbox")).toHaveLength(1);
        expect(subject.getAllByRole("spinbutton")).toHaveLength(1);

        fireEvent.click(subject.getByText(/add timer/i));

        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(2);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(2);
    });

    test("removes fields when button is pressed", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(2);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(2);

        fireEvent.click(subject.getAllByText(/clear/i)[1]);
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(1);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(1);
    });

    test("renders the instructions when go is pressed", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        await waitFor(() => {
            fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        });
        fireEvent.change(timerLengthFields[1], { target: { value: 8 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 5 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(3);
        });
        const listItems = subject.getAllByRole("listitem");

        expect(listItems[0].textContent).toBe(
            "Food A goes in first for 10 minutes"
        );
        expect(listItems[1].textContent).toBe(
            "Food B starts 2 minutes after Food A and goes in for 8 minutes"
        );
        expect(listItems[2].textContent).toBe(
            "Food C starts 3 minutes after Food B and goes in for 5 minutes"
        );
    });

    test("renders single instruction when only one set is populated", async () => {
        const subject = render(<App />);

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(1);
        });
        const listItems = subject.getAllByRole("listitem");

        expect(listItems[0].textContent).toBe(
            "Food A goes in first for 10 minutes"
        );
    });

    test("renders minute or minutes correctly", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(2);
        });

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 2 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 1 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(2);
        });
        const listItems = subject.getAllByRole("listitem");

        expect(listItems[0].textContent).toBe(
            "Food A goes in first for 2 minutes"
        );
        expect(listItems[1].textContent).toBe(
            "Food B starts 1 minute after Food A and goes in for 1 minute"
        );
    });

    test("removes timers that have 0 timer length", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 8 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 0 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(2);
        });
    });
    test("renders the instructions in time order", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(subject.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 1 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 9 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(3);
        });
        const listItems = subject.getAllByRole("listitem");

        expect(listItems[0].textContent).toBe(
            "Food A goes in first for 10 minutes"
        );
        expect(listItems[1].textContent).toBe(
            "Food C starts 1 minute after Food A and goes in for 9 minutes"
        );
        expect(listItems[2].textContent).toBe(
            "Food B starts 8 minutes after Food C and goes in for 1 minute"
        );
    });
    test("renders the instruction correct if things start at the same time", async () => {
        const subject = render(<App />);

        fireEvent.click(subject.getByText(/add timer/i));
        await waitFor(() => {
            expect(subject.getAllByRole("textbox")).toHaveLength(2);
        });

        const timerNameFields = subject.getAllByRole("textbox");
        const timerLengthFields = subject.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 10 } });

        fireEvent.click(subject.getByText(/go!/i));

        await waitFor(() => {
            expect(subject.getAllByRole("listitem")).toHaveLength(2);
        });
        const listItems = subject.getAllByRole("listitem");

        expect(listItems[0].textContent).toBe(
            "Food B goes in first for 10 minutes"
        );
        expect(listItems[1].textContent).toBe(
            "Food A starts at the same time as Food B"
        );
    });
});
