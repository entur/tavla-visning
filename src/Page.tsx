import type { BoardDB } from "./Shared/types/db-types/boards";
import { getBoard } from "./Board/scenarios/Board/firebase";
import { useEffect, useState } from "react";
import { Header } from "./Shared/components/Header";
import { Board } from "./Board/scenarios/Board";
import { InfoMessage } from "./Shared/components/InfoMessage";

function BoardPage() {
  const [board, setBoard] = useState<BoardDB | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id =
      pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      const boardData = await getBoard(id);
      if (!boardData) {
        setBoard(null);
        setLoading(false);
        return;
      }
      setBoard(boardData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const updatedBoard = board;

  const title = updatedBoard?.meta?.title
    ? updatedBoard.meta.title + " | Entur tavla"
    : "Entur Tavla";

  useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 24 * 60 * 60 * 1000);
    return () => clearTimeout(refreshTimeout);
  }, []);

  if (loading) {
    return <div>Laster tavle...</div>;
  }
  if (!updatedBoard) {
    return <div>Fant ikke tavle</div>;
  }

  return (
    <div
      className="w-full root h-full min-h-screen box-inherit bg-(--main-background-color) text-[3vmin]"
      data-theme={updatedBoard.theme}
      data-transport-palette={updatedBoard.transportPalette}
    >
      <div>
        <title>{updatedBoard.theme}</title>
      </div>

      <div className="flex flex-col bg-background h-screen w-full overflow-hidden p-3.5">
        <Header
          theme={updatedBoard.theme}
          folderLogo={undefined}
          hideClock={updatedBoard?.hideClock}
          hideLogo={updatedBoard?.hideLogo}
        />

        <Board board={updatedBoard} />

        <InfoMessage
          board={updatedBoard}
          showEnturLogo={updatedBoard?.hideLogo}
        />
      </div>
    </div>
  );
}

export default BoardPage;
