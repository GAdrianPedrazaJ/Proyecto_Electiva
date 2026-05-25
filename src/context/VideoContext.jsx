import { createContext, useContext, useState, useEffect, useCallback } from "react";

const VideoContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function VideoProvider({ children }) {
  const [rawVideos, setRawVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Cargar videos desde el backend ──────────────────────────────────────
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/videos`);
      if (!res.ok) throw new Error("Error al cargar videos");
      const data = await res.json();
      setRawVideos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ── Videos filtrados por búsqueda ────────────────────────────────────────
  const videos = query.trim()
    ? rawVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase()) ||
          v.creator?.toLowerCase().includes(query.toLowerCase())
      )
    : rawVideos;

  // ── Videos guardados ─────────────────────────────────────────────────────
  const savedVideos = rawVideos.filter((v) => v.saved);

  // ── Toggle like ──────────────────────────────────────────────────────────
  const toggleLike = async (id) => {
    // Optimistic update
    setRawVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
          : v
      )
    );
    try {
      const res = await fetch(`${API_URL}/videos/${id}/like`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setRawVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    } catch {
      // Revertir si falla
      setRawVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
            : v
        )
      );
    }
  };

  // ── Toggle save ──────────────────────────────────────────────────────────
  const toggleSave = async (id) => {
    // Optimistic update
    setRawVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, saved: !v.saved } : v))
    );
    try {
      const res = await fetch(`${API_URL}/videos/${id}/save`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setRawVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    } catch {
      // Revertir si falla
      setRawVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, saved: !v.saved } : v))
      );
    }
  };

  // ── Subir video ──────────────────────────────────────────────────────────
  const uploadVideo = async ({ title, description, category, videoFile }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("category", category || "General");
    formData.append("video", videoFile);

    const res = await fetch(`${API_URL}/videos`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al subir el video");
    }

    const newVideo = await res.json();
    setRawVideos((prev) => [newVideo, ...prev]);
    return newVideo;
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        rawVideos,
        savedVideos,
        query,
        setQuery,
        toggleLike,
        toggleSave,
        uploadVideo,
        loading,
        error,
        refetch: fetchVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  return useContext(VideoContext);
}

export function useLikes() {
  const { toggleLike, videos } = useContext(VideoContext);
  return { toggleLike, videos };
}

export function useSaved() {
  const { toggleSave, savedVideos } = useContext(VideoContext);
  return { toggleSave, savedVideos };
}