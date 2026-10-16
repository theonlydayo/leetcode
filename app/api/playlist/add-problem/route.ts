
import { prisma } from "@/lib/db";
import { getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user || "error" in user || !("id" in user)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { problemId, playlistId } = await request.json();

    if (
      typeof problemId !== "string" ||
      !problemId.trim() ||
      typeof playlistId !== "string" ||
      !playlistId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Problem id and playlist id are required",
        },
        { status: 400 },
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: user.id,
      },
    });

    if (!playlist) {
      return NextResponse.json(
        {
          success: false,
          error: "Playlist not found or unauthorized",
        },
        { status: 404 },
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true },
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: "Problem not found" },
        { status: 404 },
      );
    }

    const problemInPlayList = await prisma.problemInPlaylist.create({
      data: {
        problemId,
        playlistId,
      },
    });

    return NextResponse.json({
      success: true,
      data: problemInPlayList,
    });
  } catch (error: unknown) {
    console.error("Error adding problem to playlist:", error);

    return NextResponse.json(
      { success: false, error: "Failed to add problem to playlist" },
      { status: 500 },
    );
  }
}
