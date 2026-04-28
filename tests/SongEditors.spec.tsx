import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableSongList } from "../src/components/EditableSongList";
import { SoundtrackEditor } from "../src/components/SoundtrackEditor";
import type { Song } from "../src/interfaces/song";

describe("song editors", () => {
    test("EditableSongList adds, edits, and deletes songs", () => {
        const setSongs = jest.fn();

        render(<EditableSongList songs={["first"]} setSongs={setSongs} />);

        userEvent.click(screen.getByRole("button", { name: /add song/i }));
        expect(setSongs).toHaveBeenCalledWith(["first", ""]);

        userEvent.type(screen.getByDisplayValue("first"), " remix");
        const editCall = setSongs.mock.calls.find(
            (call) =>
                Array.isArray(call[0]) &&
                call[0].length === 1 &&
                call[0][0] !== "first",
        );
        expect(editCall).toBeDefined();

        userEvent.click(screen.getByRole("button", { name: "❌" }));
        expect(setSongs).toHaveBeenLastCalledWith([]);
    });

    test("SoundtrackEditor updates title and artist by id", () => {
        const songs: Song[] = [
            { id: "song-1", name: "Song One", by: "Artist One" },
            { id: "song-2", name: "Song Two", by: "Artist Two" },
        ];
        const setSongs = jest.fn();

        render(<SoundtrackEditor songs={songs} setSongs={setSongs} />);

        userEvent.type(screen.getByDisplayValue("Song One"), " Updated");
        const titleEditCall = setSongs.mock.calls.find(
            (call) =>
                Array.isArray(call[0]) &&
                call[0][0].id === "song-1" &&
                call[0][0].name !== "Song One" &&
                call[0][1].id === "song-2" &&
                call[0][1].name === "Song Two",
        );
        expect(titleEditCall).toBeDefined();

        userEvent.type(screen.getByDisplayValue("Artist Two"), " Jr");
        const artistEditCall = setSongs.mock.calls.find(
            (call) =>
                Array.isArray(call[0]) &&
                call[0][0].id === "song-1" &&
                call[0][0].by === "Artist One" &&
                call[0][1].id === "song-2" &&
                call[0][1].by !== "Artist Two",
        );
        expect(artistEditCall).toBeDefined();
    });
});
