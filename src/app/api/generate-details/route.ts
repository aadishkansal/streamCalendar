import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Playlist from "@/model/Playlist";
import mongoose from "mongoose";

const API_KEY = process.env.YOUTUBE_API_KEY as string;

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Authenticate
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { success: false, message: "Missing playlist URL" },
        { status: 400 }
      );
    }

    // Extract YouTube playlist ID
    const playlistId = new URL(url).searchParams.get("list");
    if (!playlistId) {
      return NextResponse.json(
        { success: false, message: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    // Check credits
    const projectCount = user.projectIds?.length || 0;
    if (projectCount >= 4) {
      return NextResponse.json(
        { success: false, message: "Credits expired" },
        { status: 400 }
      );
    }

    // If playlist already in DB
    const existing = await Playlist.findOne({ playlistId });
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message: "Playlist already exists",
          data: {
            playlistId,
            title: existing.title,
            thumbnail: existing.thumbnail,
            description: existing.description,
            channelName: existing.channelName,
            url: existing.url,
          },
        },
        { status: 200 }
      );
    }

    // Fetch playlist metadata
    const plistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
    );
    const plistJson = await plistRes.json();
    if (!plistJson.items?.length) {
      return NextResponse.json(
        { success: false, message: "Playlist not found" },
        { status: 404 }
      );
    }
    const snippet = plistJson.items[0].snippet;
    const playlistTitle = snippet.title;
    const playlistThumbnail = snippet.thumbnails.high?.url || "";
    const playlistDescription = snippet.description || "No description";
    const channelName = snippet.channelTitle;

    // Fetch all videos and durations
    let nextPageToken = "";
    let totalSeconds = 0;
    const videoList: { title: string; url: string; duration: string }[] = [];

    do {
      const itemsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
      );
      const itemsJson = await itemsRes.json();
      if (!itemsJson.items?.length) break;

      const ids = itemsJson.items
        .map((i: any) => i.contentDetails.videoId)
        .join(",");
      if (!ids) break;

      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${API_KEY}`
      );
      const detailsJson = await detailsRes.json();

      itemsJson.items.forEach((item: any, idx: number) => {
        const vidId = item.contentDetails.videoId;
        const title = item.snippet.title;
        const durISO = detailsJson.items[idx]?.contentDetails.duration;
        const secs = parseDuration(durISO || "PT0S");
        totalSeconds += secs;
        videoList.push({
          title,
          url: `https://www.youtube.com/watch?v=${vidId}`,
          duration: formatDuration(secs),
        });
      });

      nextPageToken = itemsJson.nextPageToken || "";
    } while (nextPageToken);

    // Save playlist
    const playlistDb = new Playlist({
      playlistId,
      url,
      title: playlistTitle,
      thumbnail: playlistThumbnail,
      description: playlistDescription,
      totalVideos: videoList.length,
      totalDuration: formatDuration(totalSeconds),
      channelName,
      videos: videoList,
    });
    await playlistDb.save();

    // Return YouTube ID, not Mongo _id
    return NextResponse.json(
      {
        success: true,
        message: "Details fetched successfully",
        data: {
          playlistId,
          title: playlistTitle,
          thumbnail: playlistThumbnail,
          description: playlistDescription,
          channelName,
          url,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in generate-details:", error);
    return NextResponse.json(
      { success: false, message: "Error getting details", error: error.message },
      { status: 500 }
    );
  }
}

// Helpers
function parseDuration(iso: string): number {
  const m = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const h = m?.[1] ? parseInt(m[1].replace("H", "")) * 3600 : 0;
  const min = m?.[2] ? parseInt(m[2].replace("M", "")) * 60 : 0;
  const s = m?.[3] ? parseInt(m[3].replace("S", "")) : 0;
  return h + min + s;
}

function formatDuration(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}


/* data -> { "success": true, "message": "Details fetched successfully", "data": { "title": "Top 100 Songs 2024", "thumbnail": "https://i.ytimg.com/vi/xyz123/hqdefault.jpg", "description": "This is the top 100 songs playlist of 2024.", "totalVideos": 100, "totalDuration": "05:45:30", "channelName": "Music Hits", "videos": [ { "title": "Song One", "url": "https://www.youtube.com/watch?v=abc123" }, { "title": "Song Two", "url": "https://www.youtube.com/watch?v=def456" }, { "title": "Song Three", "url": "https://www.youtube.com/watch?v=ghi789" } ] } } */