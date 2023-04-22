import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
    test("renders the basic form", () => {
        render(<App />);
        expect(screen.getByText(/Cooking Timers/i)).toBeInTheDocument();
        const buttons = screen.getAllByRole("button");

        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent(/add timer/i);
        expect(buttons[1]).toHaveTextContent(/go!/i);

        expect(screen.getAllByRole("textbox")).toHaveLength(1);
        expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    });

    test("adds new fields when button is pressed", async () => {
        render(<App />);

        expect(screen.getAllByRole("textbox")).toHaveLength(1);
        expect(screen.getAllByRole("spinbutton")).toHaveLength(1);

        fireEvent.click(screen.getByText(/add timer/i));

        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(2);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
    });

    test("removes fields when button is pressed", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(2);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(2);

        fireEvent.click(screen.getAllByText(/clear/i)[1]);
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(1);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    });

    test("renders the instructions when go is pressed", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = screen.getAllByRole("textbox");
        const timerLengthFields = screen.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 8 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 5 } });

        fireEvent.click(screen.getByText(/go!/i));

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(3);
        });
        const listItems = screen.getAllByRole("listitem");

        expect(listItems[0]).toHaveTextContent(
            /Food A goes in first for 10 minutes/i
        );
        expect(listItems[1]).toHaveTextContent(
            /Food B starts 2 minutes after Food A and goes in for 8 minutes/i
        );
        expect(listItems[2]).toHaveTextContent(
            /Food C starts 3 minutes after Food B and goes in for 5 minutes/i
        );
    });

    test("renders minute or minutes correctly", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(2);
        });

        const timerNameFields = screen.getAllByRole("textbox");
        const timerLengthFields = screen.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 2 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 1 } });

        fireEvent.click(screen.getByText(/go!/i));

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2);
        });
        const listItems = screen.getAllByRole("listitem");

        expect(listItems[0]).toHaveTextContent(
            /Food A goes in first for 2 minutes/i
        );
        expect(listItems[1]).toHaveTextContent(
            /Food B starts 1 minute after Food A and goes in for 1 minute/i
        );
    });

    test("removes timers that have 0 timer length", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = screen.getAllByRole("textbox");
        const timerLengthFields = screen.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 8 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 0 } });

        fireEvent.click(screen.getByText(/go!/i));

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2);
        });
    });
    test("renders the instructions in time order", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(3);
        });
        expect(screen.getAllByRole("spinbutton")).toHaveLength(3);

        const timerNameFields = screen.getAllByRole("textbox");
        const timerLengthFields = screen.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerNameFields[2], { target: { value: "Food C" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 1 } });
        fireEvent.change(timerLengthFields[2], { target: { value: 9 } });

        fireEvent.click(screen.getByText(/go!/i));

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(3);
        });
        const listItems = screen.getAllByRole("listitem");

        expect(listItems[0]).toHaveTextContent(
            /Food A goes in first for 10 minutes/i
        );
        expect(listItems[1]).toHaveTextContent(
            /Food C starts 1 minute after Food A and goes in for 9 minutes/i
        );
        expect(listItems[2]).toHaveTextContent(
            /Food B starts 8 minutes after Food C and goes in for 1 minute/i
        );
    });
    test("renders the instruction correct if things start at the same time", async () => {
        render(<App />);

        fireEvent.click(screen.getByText(/add timer/i));
        await waitFor(() => {
            expect(screen.getAllByRole("textbox")).toHaveLength(2);
        });

        const timerNameFields = screen.getAllByRole("textbox");
        const timerLengthFields = screen.getAllByRole("spinbutton");

        fireEvent.change(timerNameFields[0], { target: { value: "Food A" } });
        fireEvent.change(timerNameFields[1], { target: { value: "Food B" } });
        fireEvent.change(timerLengthFields[0], { target: { value: 10 } });
        fireEvent.change(timerLengthFields[1], { target: { value: 10 } });

        fireEvent.click(screen.getByText(/go!/i));

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2);
        });
        const listItems = screen.getAllByRole("listitem");

        expect(listItems[0]).toHaveTextContent(
            /Food B goes in first for 10 minutes/i
        );
        expect(listItems[1]).toHaveTextContent(
            /Food A starts at the same time as Food B/i
        );
    });
});
