/**
 * Firebase Storage Service - Sabor Tolima
 * Maneja subida de imágenes y documentos
 */
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from './config';

export type UploadPath =
  | 'logos'
  | 'banners'
  | 'products'
  | 'documents'
  | 'restaurants';

export interface UploadProgress {
  progress: number; // 0-100
  url?: string;
  error?: string;
}

/**
 * Sube un archivo a Firebase Storage con progreso
 */
export function uploadFile(
  file: File,
  path: UploadPath,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isFirebaseConfigured()) {
      // Modo demo: simular upload con URL de placeholder
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        onProgress?.({ progress });
        if (progress >= 100) {
          clearInterval(interval);
          const demoUrl = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`;
          onProgress?.({ progress: 100, url: demoUrl });
          resolve(demoUrl);
        }
      }, 200);
      return;
    }

    const ext = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.({ progress });
      },
      (error) => {
        onProgress?.({ progress: 0, error: error.message });
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress?.({ progress: 100, url });
        resolve(url);
      }
    );
  });
}

/**
 * Elimina un archivo de Storage por URL
 */
export async function deleteFile(url: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // Ignorar si el archivo no existe
  }
}

/**
 * Valida que el archivo sea una imagen válida
 */
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Solo se permiten imágenes JPG, PNG o WEBP';
  }
  if (file.size > maxSize) {
    return 'La imagen no puede superar 5MB';
  }
  return null;
}

/**
 * Valida que el archivo sea un documento válido
 */
export function validateDocumentFile(file: File): string | null {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return 'Solo se permiten PDF, JPG o PNG';
  }
  if (file.size > maxSize) {
    return 'El documento no puede superar 10MB';
  }
  return null;
}
