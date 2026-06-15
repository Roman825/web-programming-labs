import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadedFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [clientError, setClientError] = useState('');
  const [serverError, setServerError] = useState('');
  const [uploadedList, setUploadedList] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Звільняємо objectURL при зміні файлу або розмонтуванні
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Завантажуємо список файлів при старті
  useEffect(() => {
    axios.get<UploadedFile[]>(`${API_URL}/files`).then(r => setUploadedList(r.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Звільняємо попередній URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setClientError('');
    setServerError('');
    setUploaded(null);
    setProgress(0);

    // Клієнтська валідація
    if (!ALLOWED_TYPES.includes(file.type)) {
      setClientError('Дозволені лише зображення: JPEG, PNG, WebP');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      setClientError(`Файл завеликий. Максимум 5 МБ (розмір: ${(file.size / 1024 / 1024).toFixed(2)} МБ)`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    // Прев'ю через createObjectURL — не читаємо весь файл у base64
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Формуємо FormData — НЕ встановлюємо Content-Type вручну
    // axios сам додасть multipart/form-data з правильним boundary
    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setServerError('');
    setProgress(0);

    try {
      const { data } = await axios.post<UploadedFile>(
        `${API_URL}/files`,
        formData,
        {
          // Відстежуємо прогрес відправлення байтів на сервер
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
          },
        },
      );
      setUploaded(data);
      setUploadedList(prev => [data, ...prev]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 400) {
          setServerError('Сервер відхилив файл: невірний тип або перевищено розмір.');
        } else {
          setServerError('Помилка сервера. Спробуйте пізніше.');
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} КБ`;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>📁 Завантаження зображень</h1>

      {/* Вибір файлу */}
      <div style={{ border: '2px dashed #e2e8f0', borderRadius: 10, padding: '1.5rem', textAlign: 'center', background: '#f8fafc', marginBottom: '1rem' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          style={{ padding: '0.6rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
        >
          Обрати зображення
        </button>
        <p style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
          JPEG, PNG, WebP — максимум 5 МБ
        </p>
      </div>

      {/* Помилка клієнтської валідації */}
      {clientError && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 6, marginBottom: '1rem' }}>
          ❌ {clientError}
        </div>
      )}

      {/* Прев'ю обраного файлу */}
      {selectedFile && previewUrl && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Попередній перегляд:</p>
          <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 6, display: 'block' }} />
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            <div>📄 {selectedFile.name}</div>
            <div>📦 {formatSize(selectedFile.size)}</div>
            <div>🏷️ {selectedFile.type}</div>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            style={{ marginTop: '1rem', width: '100%', padding: '0.6rem', background: isUploading ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {isUploading ? 'Завантаження...' : '⬆️ Завантажити'}
          </button>
        </div>
      )}

      {/* Прогрес завантаження */}
      {isUploading && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
            <span>Завантаження...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8 }}>
            <div style={{ background: '#3b82f6', borderRadius: 4, height: 8, width: `${progress}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      {/* Помилка сервера */}
      {serverError && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 6, marginBottom: '1rem' }}>
          ❌ {serverError}
        </div>
      )}

      {/* Успішний результат */}
      {uploaded && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: '0.75rem' }}>✅ Файл успішно завантажено!</p>
          <img src={uploaded.url} alt={uploaded.originalname} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 6, display: 'block' }} />
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            <div>📄 {uploaded.originalname} → {uploaded.filename}</div>
            <div>📦 {formatSize(uploaded.size)}</div>
          </div>
        </div>
      )}

      {/* Список завантажених файлів */}
      {uploadedList.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Завантажені файли ({uploadedList.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {uploadedList.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                <img src={f.url} alt={f.originalname} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600 }}>{f.originalname}</div>
                  <div style={{ color: '#94a3b8' }}>{formatSize(f.size)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
