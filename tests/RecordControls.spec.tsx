import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordControls } from "../src/components/RecordControls";

describe("RecordControls", () => {
    test("marks unseen movie as watched and opens editor", () => {
        const setMovieWatched = jest.fn();
        const changeEditing = jest.fn();

        render(
            <RecordControls
                watched={{ seen: false, liked: false, when: null }}
                setMovieWatched={setMovieWatched}
                changeEditing={changeEditing}
            />,
        );

        userEvent.click(screen.getByRole("button", { name: /mark as watched/i }));
        userEvent.click(screen.getByRole("button", { name: /edit/i }));

        expect(setMovieWatched).toHaveBeenCalledWith(true, false);
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    test("toggles liked state for seen movie", () => {
        const setMovieWatched = jest.fn();
        const changeEditing = jest.fn();

        const { rerender } = render(
            <RecordControls
                watched={{ seen: true, liked: false, when: "today" }}
                setMovieWatched={setMovieWatched}
                changeEditing={changeEditing}
            />,
        );

        userEvent.click(screen.getByRole("button", { name: /not liked/i }));
        expect(setMovieWatched).toHaveBeenLastCalledWith(true, true);

        rerender(
            <RecordControls
                watched={{ seen: true, liked: true, when: "today" }}
                setMovieWatched={setMovieWatched}
                changeEditing={changeEditing}
            />,
        );

        userEvent.click(screen.getByRole("button", { name: /liked/i }));
        expect(setMovieWatched).toHaveBeenLastCalledWith(true, false);
    });

    test("marks seen movie as unwatched", () => {
        const setMovieWatched = jest.fn();

        render(
            <RecordControls
                watched={{ seen: true, liked: false, when: "today" }}
                setMovieWatched={setMovieWatched}
                changeEditing={jest.fn()}
            />,
        );

        userEvent.click(
            screen.getByRole("button", {
                name: /mark as unwatched/i,
            }),
        );

        expect(setMovieWatched).toHaveBeenCalledWith(false, false);
    });
});
