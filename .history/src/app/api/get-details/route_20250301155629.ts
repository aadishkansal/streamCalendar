import dbConnect from '@/lib/dbConnect';

const API_KEY = process.env.YOUTUBE_API_KEY; // Store API key in .env.local

export async function GET(request : ) {
  await dbConnect();

  try {
    const { url } = await request.json();

    // Extract Playlist ID from URL
    const urlParams = new URL(url);
    const playlistId = urlParams.searchParams.get("list");

    if (!playlistId) {
      return Response.json({ success: false, message: "Invalid playlist URL" }, { status: 400 });
    }

    // Fetch Playlist Details
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return Response.json({ success: false, message: "Playlist not found" }, { status: 404 });
    }

    const playlist = playlistData.items[0];
    const playlistTitle = playlist.snippet.title;
    const playlistThumbnail = playlist.snippet.thumbnails?.high?.url;
    const playlistDescription = playlist.snippet.description;
    const totalVideos = playlist.contentDetails.itemCount;
    const channelName = playlist.snippet.channelTitle; // Get channel name

    // Fetch Playlist Videos (for duration calculation)
    let totalDurationSeconds = 0;
    let nextPageToken = "";
    let videoList = []; // Store video details

    do {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
      );
      const videosData = await videosRes.json();

      const videoIds = videosData.items.map(item => item.contentDetails.videoId).join(",");

      // Fetch Video Details for duration
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
      );
      const detailsData = await detailsRes.json();

      videosData.items.forEach((item, index) => {
        const videoTitle = item.snippet.title;
        const videoId = item.contentDetails.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Get duration in seconds and formatted form
        const durationISO = detailsData.items[index]?.contentDetails?.duration;
        const durationSeconds = parseDuration(durationISO);
        totalDurationSeconds += durationSeconds;

        // Store in structured format
        videoList.push({
          title: videoTitle,
          url: videoUrl,
          duration: formatDuration(durationSeconds), // Store formatted duration
        });
      });

      nextPageToken = videosData.nextPageToken;
    } while (nextPageToken);

    // Convert total duration to HH:MM:SS format
    const totalDuration = formatDuration(totalDurationSeconds);

    return Response.json(
      {
        success: true,
        message: "Details fetched successfully",
        data: {
          title: playlistTitle,
          thumbnail: playlistThumbnail,
          description: playlistDescription,
          totalVideos,
          totalDuration,
          channelName,
          videos: videoList, // Include video details with duration
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting details:", error);
    return Response.json({ success: false, message: "Error getting details" }, { status: 500 });
  }
}

// Function to parse ISO 8601 duration (e.g., PT2H15M30S -> seconds)
function parseDuration(duration) {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = duration.match(regex);

  const hours = matches[1] ? parseInt(matches[1].replace("H", "")) * 3600 : 0;
  const minutes = matches[2] ? parseInt(matches[2].replace("M", "")) * 60 : 0;
  const seconds = matches[3] ? parseInt(matches[3].replace("S", "")) : 0;

  return hours + minutes + seconds;
}

// Function to format seconds into HH:MM:SS
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
