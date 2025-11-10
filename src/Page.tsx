import { useEffect } from "react";
import { Header } from "./Shared/components/Header";
import { Board } from "./Board/scenarios/Board";
import { InfoMessage } from "./Shared/components/InfoMessage";
import { useGetBoard } from "./Shared/hooks/useGetBoard";

function BoardPage() {
  const getBoardId = () => {
    const pathParts = window.location.pathname.split("/");
    return (
      pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || ""
    );
  };

  const { board, loading, error } = useGetBoard(getBoardId());

  const title = board?.meta?.title
    ? `${board.meta.title} | Entur tavla`
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

  if (error) {
    return <div>Feil ved lasting av tavle: {error}</div>;
  }

  if (!board) {
    return <div>Fant ikke tavle</div>;
  }

  return (
    <div
      className="w-full root h-full min-h-screen box-inherit bg-(--main-background-color) text-[3vmin]"
      data-theme={board.theme}
      data-transport-palette={board.transportPalette}
    >
      <div>
        <title>{title}</title>
      </div>

      <div className="flex flex-col bg-background h-screen w-full overflow-hidden p-3.5">
        <Header
          theme={board.theme}
          folderLogo={undefined}
          hideClock={board?.hideClock}
          hideLogo={board?.hideLogo}
        />

        <Board board={board} />

        <InfoMessage board={board} showEnturLogo={board?.hideLogo} />
      </div>
    </div>
  );
}

export default BoardPage;
