import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const VideoContext = createContext(null);

function getStoredVideos() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem('contalento_videos');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveVideos(videos) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('contalento_videos', JSON.stringify(videos));
  } catch {
    // ignore storage errors
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState(() => getStoredVideos());
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveVideos(videos);
  }, [videos]);

  const filtered = useMemo(() => {
    return videos.filter((video) => {
      const term = query.toLowerCase();
      return (
        video.title.toLowerCase().includes(term) ||
        video.creator.toLowerCase().includes(term) ||
        video.category.toLowerCase().includes(term)
      );
    });
  }, [query, videos]);

  const toggleLike = (id) => {
    setVideos((current) =>
      current.map((video) =>
        video.id === id
          ? {
              ...video,
              liked: !video.liked,
              likes: video.liked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );
  };

  const toggleSave = (id) => {
    setVideos((current) =>
      current.map((video) =>
        video.id === id ? { ...video, saved: !video.saved } : video
      )
    );
  };

  const uploadVideo = async ({ title, description, category, videoFile }) => {
    if (!videoFile) return;

    const dataUrl = await fileToDataUrl(videoFile);

    const nextVideo = {
      id: `v${videos.length + 1}`,
      title,
      creator: 'Creador ConTalento',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      saved: false,
      liked: false,
      category,
      description,
      url: dataUrl,
      fileName: videoFile.name,
    };

    setVideos((current) => [nextVideo, ...current]);
  };

  const savedVideos = videos.filter((video) => video.saved);

  return (
    <VideoContext.Provider
      value={{ videos: filtered, query, setQuery, toggleLike, toggleSave, uploadVideo, savedVideos, rawVideos: videos }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos debe usarse dentro de VideoProvider');
  }
  return context;
}

export function useLikes() {
  const { toggleLike } = useVideos();
  return { toggleLike };
}

export function useSaved() {
  const { toggleSave } = useVideos();
  return { toggleSave };
}
