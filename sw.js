// Import atau sertakan library atau modul yang diperlukan di sini jika diperlukan

// Nama cache
const cacheName = 'my-cache';

// Daftar sumber daya yang ingin Anda cache
const cacheAssets = [
  '/index.html',
  '/style.css',
  '/main.js',
  '/img/Favicon.png',
  '/img/notif.png',
  '/img/comment-icon.png',
  '/img/Profile.jpg',
  '/img/profile-icon.jpg',
  '/Favicon.ico',

  // Daftar sumber daya lainnya
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Caching sumber daya');
      return cache.addAll(cacheAssets);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Logika penghapusan cache lama jika diperlukan
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Jika sumber daya ada di cache, kembalikan dari cache
      }
      return fetch(event.request).then((response) => {
        // Tambahkan sumber daya yang tidak ada di cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Jika gagal mengambil sumber daya, tampilkan pesan kesalahan khusus atau tampilan offline
        // Misalnya, jika ingin menampilkan halaman offline tersendiri
        return caches.match('/offline.html');
      });
    })
  );
});

