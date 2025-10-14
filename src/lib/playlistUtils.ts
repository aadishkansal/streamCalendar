import axios from "axios";

export const fetchPlaylistVideos = async (playlistId: string) => {
  const res = await axios.get(`/api/get-playlist-videos?playlistId=${playlistId}`);
  return res.data.videos as { id: string; title: string; thumbnail: string; duration: string }[];
};
