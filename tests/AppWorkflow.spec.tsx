import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

describe("App workflow behavior", () => {
    test("adds a movie from modal and prevents duplicate ids", () => {
        const { container } = render(<App />);

        userEvent.click(
            screen.getByRole("button", {
                name: /add new movie/i,
            }),
        );
        userEvent.type(screen.getByLabelText(/youtube id/i), "new-trailer-id");
        userEvent.click(
            screen.getByRole("button", {
                name: /save changes/i,
            }),
        );

        const trailerAfterFirstAdd = container.querySelectorAll(
            'iframe[src*="new-trailer-id"]',
        );
        expect(trailerAfterFirstAdd).toHaveLength(1);

        userEvent.click(
            screen.getByRole("button", {
                name: /add new movie/i,
            }),
        );
        userEvent.click(
            screen.getByRole("button", {
                name: /save changes/i,
            }),
        );

        const trailerAfterDuplicateAdd = container.querySelectorAll(
            'iframe[src*="new-trailer-id"]',
        );
        expect(trailerAfterDuplicateAdd).toHaveLength(1);
    });

    test("marks movie watched, opens editor, and deletes movie", () => {
        const { container } = render(<App />);

        userEvent.click(
            screen.getByRole("button", {
                name: /add new movie/i,
            }),
        );
        userEvent.type(screen.getByLabelText(/youtube id/i), "delete-me-id");
        userEvent.click(
            screen.getByRole("button", {
                name: /save changes/i,
            }),
        );

        const trailer = container.querySelector('iframe[src*="delete-me-id"]');
        expect(trailer).not.toBeNull();
        const card = trailer?.closest(".bg-light");
        expect(card).not.toBeNull();
        if (!card) {
            throw new Error("Expected movie card for added movie");
        }

        const scoped = within(card as HTMLElement);
        userEvent.click(
            scoped.getByRole("button", {
                name: /mark as watched/i,
            }),
        );
        expect(
            scoped.getByRole("button", {
                name: /mark as unwatched/i,
            }),
        ).toBeInTheDocument();

        userEvent.click(
            scoped.getByRole("button", {
                name: /edit/i,
            }),
        );
        userEvent.click(
            scoped.getByRole("button", {
                name: /delete/i,
            }),
        );

        expect(container.querySelector('iframe[src*="delete-me-id"]')).toBeNull();
    });
});
