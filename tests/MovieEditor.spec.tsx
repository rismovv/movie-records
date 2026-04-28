import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    function renderEditor() {
        return render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            ></MovieEditor>,
        );
    }

    beforeEach(() => {
        jest.clearAllMocks();
        renderEditor();
    });

    test("renders MovieEditor with initial movie data", () => {
        const title = screen.getByDisplayValue("The Test Movie");

        expect(title).toBeInTheDocument();
    });

    test("saves edited fields and soundtrack changes", () => {
        const titleInput = screen.getByDisplayValue("The Test Movie");
        const yearInput = screen.getByDisplayValue("2020");
        const ratingSelect = screen.getByDisplayValue("⭐⭐⭐⭐✰");
        const descriptionInput = screen.getByDisplayValue("A movie for testing");
        const songNameInput = screen.getByDisplayValue("Test Song");
        const songByInput = screen.getByDisplayValue("Test Artist");

        userEvent.clear(titleInput);
        userEvent.type(titleInput, "Edited Title");
        userEvent.clear(yearInput);
        userEvent.type(yearInput, "2024");
        userEvent.selectOptions(ratingSelect, "10");
        userEvent.clear(descriptionInput);
        userEvent.type(descriptionInput, "Updated description");
        userEvent.clear(songNameInput);
        userEvent.type(songNameInput, "Edited Song");
        userEvent.clear(songByInput);
        userEvent.type(songByInput, "Edited Artist");

        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({
                title: "Edited Title",
                released: 2024,
                rating: 10,
                description: "Updated description",
                soundtrack: [
                    {
                        id: "song1",
                        name: "Edited Song",
                        by: "Edited Artist",
                    },
                ],
            }),
        );
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    test("uses zero fallback for invalid number fields", () => {
        const yearInput = screen.getByDisplayValue("2020");
        const ratingSelect = screen.getByDisplayValue("⭐⭐⭐⭐✰");

        userEvent.clear(yearInput);
        userEvent.selectOptions(ratingSelect, "0");
        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({
                released: 0,
                rating: 0,
            }),
        );
    });

    test("cancel exits editor without saving", () => {
        userEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).not.toHaveBeenCalled();
    });

    test("delete triggers delete callback with movie id", () => {
        userEvent.click(screen.getByRole("button", { name: /delete/i }));

        expect(mockDeleteMovie).toHaveBeenCalledTimes(1);
        expect(mockDeleteMovie).toHaveBeenCalledWith("test-movie-123");
    });
});
