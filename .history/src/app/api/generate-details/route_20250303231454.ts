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
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const { url } = await request.json();

    if (!url || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing playlist URL or user ID" },
        { status: 400 }
      );
    }

    const numberOfProjects = user.projectIds;

    if(!numberOfProjects)

    if(numberOfProjects>=2){
      return 
    }

    // Extract Playlist ID from URL
    const urlParams = new URL(url);
    const playlistId = urlParams.searchParams.get("list");

    if (!playlistId) {
      return NextResponse.json(
        { success: false, message: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    const existingPlaylist = await Playlist.findOne({ playlistId });

    if (existingPlaylist) {
      return NextResponse.json(
        {
          success: true,
          message: "Playlist already exists",
          playlistId: existingPlaylist._id,
          data: {
            title: existingPlaylist.title,
            thumbnail: existingPlaylist.thumbnail,
            description: existingPlaylist.description,
            channelName: existingPlaylist.channelName,
          },
        },
        { status: 200 }
      );
    }

    // Fetch Playlist Details
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Playlist not found" },
        { status: 404 }
      );
    }

    const playlist = playlistData.items[0];
    const playlistTitle = playlist.snippet.title;
    const playlistThumbnail = playlist.snippet.thumbnails?.high?.url;
    const playlistDescription = playlist.snippet.description;
    const totalVideos = playlist.contentDetails.itemCount;
    const channelName = playlist.snippet.channelTitle;

    // Fetch Playlist Videos
    let totalDurationSeconds = 0;
    let nextPageToken = "";
    let videoList: { title: string; url: string; duration: string }[] = [];

    do {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
      );
      const videosData = await videosRes.json();

      if (!videosData.items || videosData.items.length === 0) break;

      const videoIds = videosData.items
        .map((item: any) => item.contentDetails.videoId)
        .join(",");

      if (!videoIds) break; // Prevent API call with empty video IDs

      // Fetch Video Durations
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
      );
      const detailsData = await detailsRes.json();

      videosData.items.forEach((item: any, index: number) => {
        const videoTitle = item.snippet.title;
        const videoId = item.contentDetails.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const durationISO = detailsData.items[index]?.contentDetails?.duration;
        const durationSeconds = durationISO ? parseDuration(durationISO) : 0;
        totalDurationSeconds += durationSeconds;

        videoList.push({
          title: videoTitle,
          url: videoUrl,
          duration: formatDuration(durationSeconds),
        });
      });

      nextPageToken = videosData.nextPageToken || "";
    } while (nextPageToken);

    // Convert total duration to HH:MM:SS format
    const totalDuration = formatDuration(totalDurationSeconds);

    const playlistDb = new Playlist({
      playlistId: playlistId,
      url,
      title: playlistTitle,
      thumbnail: playlistThumbnail,
      description: playlistDescription,
      totalVideos,
      totalDuration,
      channelName,
      videos: videoList,
    });

    await playlistDb.save();

    return NextResponse.json(
      {
        success: true,
        message: "Details fetched successfully",
        playlistId: playlistDb._id,
        data: {
          title: playlistTitle,
          thumbnail: playlistThumbnail,
          description: playlistDescription,
          channelName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting details:", error);
    return NextResponse.json(
      { success: false, message: "Error getting details" },
      { status: 500 }
    );
  }
}

// Function to parse ISO 8601 duration (e.g., PT2H15M30S -> seconds)
function parseDuration(duration: string): number {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = duration.match(regex);

  const hours = matches?.[1] ? parseInt(matches[1].replace("H", "")) * 3600 : 0;
  const minutes = matches?.[2] ? parseInt(matches[2].replace("M", "")) * 60 : 0;
  const seconds = matches?.[3] ? parseInt(matches[3].replace("S", "")) : 0;

  return hours + minutes + seconds;
}

// Function to format seconds into HH:MM:SS
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/* 
data -> 
{
  "success": true,
  "message": "Details fetched successfully",
  "data": {
    "title": "Top 100 Songs 2024",
    "thumbnail": "https://i.ytimg.com/vi/xyz123/hqdefault.jpg",
    "description": "This is the top 100 songs playlist of 2024.",
    "totalVideos": 100,
    "totalDuration": "05:45:30",
    "channelName": "Music Hits",
    "videos": [
      {
        "title": "Song One",
        "url": "https://www.youtube.com/watch?v=abc123"
      },
      {
        "title": "Song Two",
        "url": "https://www.youtube.com/watch?v=def456"
      },
      {
        "title": "Song Three",
        "url": "https://www.youtube.com/watch?v=ghi789"
      }
    ]
  }
}
*/
