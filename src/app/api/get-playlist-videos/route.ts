import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Playlist from "@/model/Playlist";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
      return NextResponse.json(
        { success: false, message: "Playlist ID is required" },
        { status: 400 }
      );
    }

    const playlist = await Playlist.findOne({ playlistId });

    if (!playlist) {
      return NextResponse.json(
        { success: false, message: "Playlist not found" },
        { status: 404 }
      );
    }

    const videosWithId = playlist.videos
      .map((video: any) => {
        let videoId = '';
        
        if (video.url) {
          try {
            const url = new URL(video.url);
            videoId = url.searchParams.get('v') || '';
          } catch (e) {
            console.error('Failed to parse video URL:', video.url);
          }
        }

        // Generate YouTube thumbnail URL from videoId if thumbnail is not in database
        const thumbnailUrl = video.thumbnail || 
          (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');

        return {
          id: videoId,
          title: video.title,
          url: video.url,
          duration: video.duration || '00:00:00',
          thumbnail: thumbnailUrl,
        };
      })
      // Filter out private/deleted/unavailable videos
      .filter((video: any) => {
        // Check if video has a valid ID
        if (!video.id || video.id.trim() === '') return false;
        
        // Check if title indicates private or deleted video
        const title = video.title.toLowerCase();
        const privatePatterns = [
          'private video',
          'deleted video',
          '[private video]',
          '[deleted video]',
          'private',
          'deleted'
        ];
        
        // If title exactly matches or contains these patterns, filter it out
        const isPrivateOrDeleted = privatePatterns.some(pattern => 
          title === pattern || title.includes(pattern)
        );
        
        return !isPrivateOrDeleted;
      });

    return NextResponse.json(
      {
        success: true,
        videos: videosWithId,
        totalVideos: videosWithId.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching videos" },
      { status: 500 }
    );
  }
}
