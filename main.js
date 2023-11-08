document.addEventListener('DOMContentLoaded', function () {
  const commentInput = document.getElementById('commentInput');
  const addCommentButton = document.getElementById('addComment');

  // Membuka atau membuat database IndexedDB
  const request = indexedDB.open('comments-db', 1);

  // Handler ketika database terbuka
  request.onsuccess = function (event) {
    const db = event.target.result;

    // Tambahkan komentar ke database IndexedDB saat tombol diklik
    addCommentButton.addEventListener('click', () => {
      const commentText = commentInput.value.trim();
      if (commentText !== '') {
        const tx = db.transaction('comments', 'readwrite');
        const commentsStore = tx.objectStore('comments');
        const newComment = { text: commentText };

        const addRequest = commentsStore.add(newComment);
        addRequest.onsuccess = function () {
          commentInput.value = '';
          console.log('Komentar berhasil disimpan.');
          alert('Komentar berhasil disimpan.');
        };

        addRequest.onerror = function () {
          console.error('Error saat menyimpan komentar.');
        };
      }
    });
  };

  // Handler ketika database perlu diperbarui
  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Buat object store jika belum ada
    if (!db.objectStoreNames.contains('comments')) {
      db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
    }
  };

  // Handler ketika terjadi kesalahan
  request.onerror = function (event) {
    console.error('Error saat membuka database IndexedDB:', event.target.error);
  };


  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
})