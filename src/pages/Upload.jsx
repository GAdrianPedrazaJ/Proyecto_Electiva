import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../context/VideoContext.jsx';
import Button from '../components/Button.jsx';

function Upload() {
  const { uploadVideo } = useVideos();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!videoFile) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [videoFile]);

  const handleInput = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (file && !file.type.startsWith('video/')) {
      setError('Por favor selecciona un archivo de video válido.');
      setVideoFile(null);
      return;
    }
    setError('');
    setVideoFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category || !videoFile) {
      setError('Todos los campos son obligatorios y debes seleccionar un video.');
      return;
    }

    try {
      await uploadVideo({ ...form, videoFile });
      setSubmitted(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (uploadError) {
      setError('No se pudo subir el video. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Sube tu contenido</p>
          <h1 className="text-3xl font-semibold text-white">Formulario de subida de videos</h1>
          <p className="text-slate-400">Agrega un archivo de video para publicar en el feed de ConTalento.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Título del video
              <input
                value={form.title}
                onChange={handleInput('title')}
                placeholder="Ej. Cómo potenciar tu perfil LinkedIn"
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Categoría
              <select
                value={form.category}
                onChange={handleInput('category')}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Carrera">Carrera</option>
                <option value="Productividad">Productividad</option>
                <option value="Marca personal">Marca personal</option>
                <option value="Entrevistas">Entrevistas</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-200">
            Descripción
            <textarea
              value={form.description}
              onChange={handleInput('description')}
              rows="5"
              placeholder="Describe brevemente el contenido del video"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-200">
            Archivo de video
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition file:rounded-full file:border-0 file:bg-cyan-500/10 file:px-4 file:py-2 file:text-slate-100 file:font-semibold"
            />
          </label>

          {preview && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">Vista previa del video</p>
              <video controls src={preview} className="mt-4 w-full rounded-3xl bg-black" />
            </div>
          )}

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">Tu video será agregado al feed y guardado en tu navegador.</p>
            <Button type="submit" disabled={!form.title || !form.description || !form.category || !videoFile}>
              Publicar video
            </Button>
          </div>

          {submitted && (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Video subido correctamente. Serás redirigido al feed en breve.
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default Upload;
