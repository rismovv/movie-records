import { render, screen } from "@testing-library/react";
import { WatchStatus } from "../src/components/WatchStatus";

describe("WatchStatus component", () => {
    it("renders watched text when movie has been seen", () => {
        render(
            <WatchStatus
                watched={{
                    seen: true,
                    liked: true,
                    when: "2023-01-01",
                }}
            ></WatchStatus>,
        );
        const watchedText = screen.getByText("Watched");
        expect(watchedText).toBeInTheDocument();
    });

    it("renders not watched text when movie is unseen", () => {
        render(
            <WatchStatus
                watched={{
                    seen: false,
                    liked: false,
                    when: null,
                }}
            ></WatchStatus>,
        );
        const watchedText = screen.getByText("Not yet watched");
        expect(watchedText).toBeInTheDocument();
    });
});
