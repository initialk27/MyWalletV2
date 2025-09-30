const bulanIndex = localStorage.getItem('bulanTerpilih');
const semuaBulan = JSON.parse(localStorage.getItem('catatanBulan')) || [];
const dataBulan = semuaBulan[bulanIndex];
const judulBulan = document.getElementById('judul-bulan');
const list = document.getElementById('list-pengeluaran');

if (!dataBulan) {
  alert('Data tidak ditemukan');
  location.href = 'index.html';
} else {
  judulBulan.textContent = `${dataBulan.bulan}, ${dataBulan.tahun}`;
}

function tampilkanPengeluaran() {
  const key = `pengeluaran-${bulanIndex}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];
  list.innerHTML = '';

  const kosongMsg = document.getElementById('kosong-pengeluaran');
  kosongMsg.style.display = data.length === 0 ? 'block' : 'none';

  let total = 0;

  data.forEach((item, index) => {
    const tanggal = item.tanggal || '-';
    const nominal = typeof item.nominal === 'number' ? item.nominal : 0;
    const keterangan = item.keterangan || '';

    total += nominal;

    const wrapper = document.createElement('div');
    wrapper.className = 'pengeluaran-item';
    wrapper.style.position = 'relative';

    wrapper.innerHTML = `
        <button class="menu-button" onclick="toggleMenu(this, event)">⋮</button>
        <div class="dropdown">
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="confirmHapus(${index})">Hapus</button>
        </div>
        <div class="tanggal">${tanggal}</div>
        <div class="nominal">Rp ${nominal.toLocaleString()}</div>
        <div class="keterangan">${keterangan}</div>
      `;

    list.appendChild(wrapper);
  });

  document.getElementById('total-pengeluaran').textContent =
    'Rp ' + total.toLocaleString();
}

document
  .getElementById('btn-tambah-pengeluaran')
  .addEventListener('click', () => {
    window.location.href = 'tambah-pengeluaran.html';
  });

document.getElementById('btn-kembali').addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.getElementById('btn-tambah-percent').addEventListener('click', () => {
  window.location.href = 'percent.html';
});

// === Dropdown Menu ===
window.toggleMenu = function (btn, event) {
  event.stopPropagation(); // cegah event bubbling

  const dropdown = btn.nextElementSibling;

  // Tutup semua dropdown lain
  const allDropdowns = document.querySelectorAll('.dropdown');
  allDropdowns.forEach((d) => {
    if (d !== dropdown) d.style.display = 'none';
  });

  // Toggle dropdown ini
  dropdown.style.display =
    dropdown.style.display === 'block' ? 'none' : 'block';
};

// Tutup dropdown jika klik di luar
document.addEventListener('click', function (event) {
  const allDropdowns = document.querySelectorAll('.dropdown');
  allDropdowns.forEach((dropdown) => {
    if (
      dropdown.style.display === 'block' &&
      !dropdown.contains(event.target) &&
      !dropdown.previousElementSibling.contains(event.target)
    ) {
      dropdown.style.display = 'none';
    }
  });
});

let indexToDelete = null;

window.confirmHapus = function (index) {
  indexToDelete = index;
  document.getElementById('confirm-modal').style.display = 'flex';
};

window.editItem = function (index) {
  localStorage.setItem('editPengeluaranIndex', index);
  window.location.href = 'edit-pengeluaran.html';
};

// === Konfirmasi Hapus ===
document.addEventListener('DOMContentLoaded', function () {
  const yesBtn = document.getElementById('confirm-yes');
  const noBtn = document.getElementById('confirm-no');

  if (yesBtn && noBtn) {
    yesBtn.addEventListener('click', function () {
      const key = `pengeluaran-${bulanIndex}`;
      const data = JSON.parse(localStorage.getItem(key)) || [];
      if (indexToDelete !== null) {
        data.splice(indexToDelete, 1);
        localStorage.setItem(key, JSON.stringify(data));
        tampilkanPengeluaran();
      }
      document.getElementById('confirm-modal').style.display = 'none';
      indexToDelete = null;
    });

    noBtn.addEventListener('click', function () {
      document.getElementById('confirm-modal').style.display = 'none';
      indexToDelete = null;
    });
  }
});

// Debug ukuran data
const data = localStorage.getItem('riwayatPengeluaran') || '';
const sizeInBytes = new Blob([data]).size;
console.log(`Ukuran: ${sizeInBytes} byte`);

tampilkanPengeluaran();
