import { useState, useEffect } from "react";
import type { BoardDB } from "../types/db-types/boards";

export interface BoardApiResponse {
  board: BoardDB;
  folderLogo?: string;
  error?: string;
}

interface UseGetBoardReturn {
  board: BoardDB | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching a board by ID
 * @param boardId - The ID of the board to fetch
 * @returns Object containing board data, loading state, and error state
 */
export function useGetBoard(boardId: string): UseGetBoardReturn {
  const [board, setBoard] = useState<BoardDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoard() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3000/api/get-board?id=${encodeURIComponent(
            boardId
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data: BoardApiResponse = await res.json();

        if (!data.board) {
          throw new Error("No board in response");
        }

        setBoard(data.board);
      } catch (err) {
        console.error("useGetBoard: Failed to fetch board", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setBoard(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [boardId]);

  return { board, loading, error };
}
