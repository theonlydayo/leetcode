import { prisma } from "@/lib/db";
import { getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user || "error" in user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserData();

    if (!user || "error" in user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      typeof body.name !== "string" ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "A valid playlist name is required" },
        { status: 400 },
      );
    }

    const description =
      "description" in body && typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const playlist = await prisma.playlist.create({
      data: {
        name: body.name.trim(),
        description,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create playlist" },
      { status: 500 },
    );
  }
}