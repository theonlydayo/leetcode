"use client";

import { useState } from "react";
import { toast } from "sonner";

type CreatePlaylistData = {
  name: string;
  description?: string | null;
};

type ApiResponse = {
  success: boolean;
  error?: string;
};

export function usePlaylistActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );

  const handleCreatePlaylist = async (
    data: CreatePlaylistData,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create playlist");
      }

      setIsCreateModalOpen(false);
      toast.success("Playlist created successfully");
      return true;
    } catch (error: unknown) {
      console.error("Error creating playlist:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create playlist",
      );

      return false;
    }
  };

  const handleAddToPlaylist = async (
    problemId: string,
    playlistId: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/playlist/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, playlistId }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to add problem to playlist");
      }

      setIsAddToPlaylistModalOpen(false);
      toast.success("Problem added to playlist");
      return true;
    } catch (error: unknown) {
      console.error("Error adding to playlist:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add problem to playlist",
      );

      return false;
    }
  };

  const openAddToPlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModalOpen(false);
    setSelectedProblemId(null);
  };

  return {
    isCreateModalOpen,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    handleCreatePlaylist,

    isAddToPlaylistModalOpen,
    selectedProblemId,
    openAddToPlaylist,
    closeAddToPlaylistModal,
    handleAddToPlaylist,
  };
}