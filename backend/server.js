import express from "express";
import cors from "cors";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer: almacena en memoria para pasar a Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB máx
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Solo se permiten archivos de video"), false);
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ─── GET /api/videos ────────────────────────────────────────────────────────
// Devuelve todos los videos ordenados por fecha
app.get("/api/videos", async (req, res) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── POST /api/videos ───────────────────────────────────────────────────────
// Sube el archivo a Storage y guarda metadatos en la tabla videos
app.post("/api/videos", upload.single("video"), async (req, res) => {
  const { title, description, category } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "Archivo de video requerido" });
  if (!title) return res.status(400).json({ error: "Título requerido" });

  // 1. Subir archivo a Supabase Storage
  const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
  const { error: storageError } = await supabase.storage
    .from("videos")
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (storageError) return res.status(500).json({ error: storageError.message });

  // 2. Obtener URL pública
  const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);
  const publicUrl = urlData.publicUrl;

  // 3. Guardar metadatos en la tabla
  const { data, error } = await supabase
    .from("videos")
    .insert([
      {
        title,
        description: description || "",
        category: category || "General",
        url: publicUrl,
        likes: 0,
        liked: false,
        saved: false,
        creator: "Usuario Demo",
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ─── PATCH /api/videos/:id/like ─────────────────────────────────────────────
app.patch("/api/videos/:id/like", async (req, res) => {
  const { id } = req.params;

  // Leer estado actual
  const { data: video, error: fetchError } = await supabase
    .from("videos")
    .select("liked, likes")
    .eq("id", id)
    .single();

  if (fetchError) return res.status(404).json({ error: "Video no encontrado" });

  const newLiked = !video.liked;
  const newLikes = newLiked ? video.likes + 1 : Math.max(0, video.likes - 1);

  const { data, error } = await supabase
    .from("videos")
    .update({ liked: newLiked, likes: newLikes })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── PATCH /api/videos/:id/save ─────────────────────────────────────────────
app.patch("/api/videos/:id/save", async (req, res) => {
  const { id } = req.params;

  const { data: video, error: fetchError } = await supabase
    .from("videos")
    .select("saved")
    .eq("id", id)
    .single();

  if (fetchError) return res.status(404).json({ error: "Video no encontrado" });

  const { data, error } = await supabase
    .from("videos")
    .update({ saved: !video.saved })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── DELETE /api/videos/:id ──────────────────────────────────────────────────
app.delete("/api/videos/:id", async (req, res) => {
  const { id } = req.params;

  // Obtener URL para borrar del storage también
  const { data: video } = await supabase
    .from("videos")
    .select("url")
    .eq("id", id)
    .single();

  if (video?.url) {
    const fileName = video.url.split("/").pop();
    await supabase.storage.from("videos").remove([fileName]);
  }

  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ─── Error handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.message === "Solo se permiten archivos de video") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
