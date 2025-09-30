document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('list-container');
  const tambahBtn = document.getElementById('tambah-btn');

  function renderList() {
    const data = JSON.parse(localStorage.getItem('catatanBulan')) || [];
    const kosongMessage = document.getElementById('kosong-message');

    listContainer.innerHTML = '';

    if (data.length === 0) {
      kosongMessage.style.display = 'block';
      return;
    } else {
      kosongMessage.style.display = 'none';
    }

    data.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'bulan-item';
      div.innerHTML = `
        <span>${item.bulan}, ${item.tahun}</span>
        <div class="actions">
          <button class="hapus-btn" data-index="${index}">🗑️</button>
          <button class="lanjut-btn" data-index="${index}">→</button>
        </div>
      `;
      listContainer.appendChild(div);
    });

    // Tambah event listener tombol hapus & lanjut
    document.querySelectorAll('.hapus-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        hapusItem(this.dataset.index);
      });
    });

    document.querySelectorAll('.lanjut-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        lanjut(this.dataset.index);
      });
    });
  }

  let indexToDelete = null;

  function hapusItem(index) {
    indexToDelete = index;
    document.getElementById('confirm-modal').style.display = 'flex';
  }

  // ✅ Bagian ini diubah
  document.getElementById('confirm-yes').addEventListener('click', function () {
    if (indexToDelete !== null) {
      const data = JSON.parse(localStorage.getItem('catatanBulan')) || [];

      // Hapus bulan dari daftar
      data.splice(indexToDelete, 1);
      localStorage.setItem('catatanBulan', JSON.stringify(data));

      // Hapus juga semua pengeluaran yang terkait
      const key = `pengeluaran-${indexToDelete}`;
      localStorage.removeItem(key);

      // Reindex semua pengeluaran biar sinkron sama catatanBulan
      const semuaKeys = Object.keys(localStorage);
      semuaKeys.forEach((k) => {
        if (k.startsWith('pengeluaran-')) {
          const idx = parseInt(k.split('-')[1], 10);
          if (idx > indexToDelete) {
            const newKey = `pengeluaran-${idx - 1}`;
            const value = localStorage.getItem(k);
            localStorage.setItem(newKey, value);
            localStorage.removeItem(k);
          }
        }
      });

      renderList();
      indexToDelete = null;
      document.getElementById('confirm-modal').style.display = 'none';
    }
  });

  document.getElementById('confirm-no').addEventListener('click', function () {
    indexToDelete = null;
    document.getElementById('confirm-modal').style.display = 'none';
  });

  function lanjut(index) {
    localStorage.setItem('bulanTerpilih', index);
    window.location.href = 'pengeluaran.html';
  }

  tambahBtn.addEventListener('click', function () {
    window.location.href = 'tambah.html';
  });

  renderList();

  // Cek ukuran localStorage riwayat
  const data = localStorage.getItem('riwayatPengeluaran') || '';
  const sizeInBytes = new Blob([data]).size;
  console.log(`Ukuran: ${sizeInBytes} byte`);
});
