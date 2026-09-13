const FILES_DB_NAME = 'si_amang_files_db';
const FILES_STORE_NAME = 'documents';
const FILES_DB_VERSION = 1;

// Key IndexedDB untuk foto profil — string biasa, bukan angka seperti id
// dokumen (1-5), supaya tidak pernah bentrok dengan key dokumen persyaratan.
export const PROFILE_PHOTO_KEY = 'profile_photo';

function openFilesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak tersedia di browser ini.'));
      return;
    }

    const request = indexedDB.open(FILES_DB_NAME, FILES_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FILES_STORE_NAME)) {
        db.createObjectStore(FILES_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocumentFileToDb(key: IDBValidKey, file: File): Promise<void> {
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE_NAME, 'readwrite');
    tx.objectStore(FILES_STORE_NAME).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteDocumentFileFromDb(key: IDBValidKey): Promise<void> {
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE_NAME, 'readwrite');
    tx.objectStore(FILES_STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Ambil semua dokumen persyaratan (key numerik 1-5) dari IndexedDB.
 * Key non-numerik seperti PROFILE_PHOTO_KEY sengaja dilewati — foto profil
 * punya jalur pemulihannya sendiri lewat getFileFromDb().
 */
export async function getAllDocumentFilesFromDb(): Promise<Record<number, File>> {
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE_NAME, 'readonly');
    const store = tx.objectStore(FILES_STORE_NAME);
    const result: Record<number, File> = {};
    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (cursor) {
        if (typeof cursor.key === 'number') {
          result[cursor.key] = cursor.value as File;
        }
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    cursorRequest.onerror = () => reject(cursorRequest.error);
  });
}

/**
 * Ambil satu berkas dari IndexedDB berdasarkan key spesifiknya.
 * Dipakai untuk memulihkan foto profil (key string PROFILE_PHOTO_KEY),
 * berbeda dari getAllDocumentFilesFromDb() yang khusus dokumen bernomor.
 */
export async function getFileFromDb(key: IDBValidKey): Promise<File | undefined> {
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE_NAME, 'readonly');
    const request = tx.objectStore(FILES_STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result as File | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllDocumentFilesFromDb(): Promise<void> {
  const db = await openFilesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES_STORE_NAME, 'readwrite');
    tx.objectStore(FILES_STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}