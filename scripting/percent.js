let indexToDelete = null;

// Load data kategori + progress bar
function loadData() {
  const listContainer = document.getElementById('list-container');
  listContainer.innerHTML = '';

  const data = JSON.parse(localStorage.getItem('persen_data')) || [];

  // Ambil bulan terpilih
  const bulanIndex = localStorage.getItem('bulanTerpilih');
  const key = `pengeluaran-${bulanIndex}`;
  const pengeluaranList = JSON.parse(localStorage.getItem(key)) || [];

  if (data.length === 0) {
    listContainer.innerHTML =
      "<p style='text-align:center; color:gray'>Belum ada kategori ditetapkan</p>";
    return;
  }

  data.forEach((item, index) => {
    // Hitung total pengeluaran untuk kategori ini
    const total = pengeluaranList
      .filter((p) => p.kategori === item.kategori)
      .reduce((sum, p) => sum + p.nominal, 0);

    // Persentase
    let persen = 0;
    if (item.maksimal > 0) {
      persen = (total / item.maksimal) * 100;
    }
    const persenTampil = persen.toFixed(0);
    const persenBar = Math.min(persen, 100).toFixed(0);

    // Buat card
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${item.kategori} (Rp ${total.toLocaleString('id-ID')})</h3>
      <div class="progress-wrapper">
        <div class="progress-container">
          <div class="progress-bar" style="width: ${persenBar}%;"></div>
        </div>
        <div class="percentage">${persenTampil}%</div>
      </div>

      <!-- Tombol titik tiga -->
      <button class="menu-btn">⋮</button>

      <!-- Dropdown menu -->
      <div class="dropdown">
        <button class="edit-btn">Edit</button>
        <button class="hapus-btn">Hapus</button>
      </div>
    `;

    // Tombol titik tiga
    const menuBtn = card.querySelector('.menu-btn');
    const dropdown = card.querySelector('.dropdown');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Tutup dropdown lain
      document.querySelectorAll('.dropdown').forEach((d) => {
        if (d !== dropdown) d.style.display = 'none';
      });
      dropdown.style.display =
        dropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    // Tutup menu kalau klik di luar
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });

    // Aksi Hapus → buka modal
    dropdown.querySelector('.hapus-btn').addEventListener('click', () => {
      indexToDelete = index;
      document.getElementById('confirm-modal').style.display = 'flex';
    });

    // Aksi Edit
    dropdown.querySelector('.edit-btn').addEventListener('click', () => {
      localStorage.setItem('edit_kategori', item.kategori);
      window.location.href = 'addpercent.html';
    });

    listContainer.appendChild(card);
  });
}

// Event listener untuk modal konfirmasi
document.addEventListener('DOMContentLoaded', () => {
  const yesBtn = document.getElementById('confirm-yes');
  const noBtn = document.getElementById('confirm-no');

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      let newData = JSON.parse(localStorage.getItem('persen_data')) || [];
      if (indexToDelete !== null) {
        newData.splice(indexToDelete, 1);
        localStorage.setItem('persen_data', JSON.stringify(newData));
        loadData();
      }
      document.getElementById('confirm-modal').style.display = 'none';
      indexToDelete = null;
    });
  }

  if (noBtn) {
    noBtn.addEventListener('click', () => {
      document.getElementById('confirm-modal').style.display = 'none';
      indexToDelete = null;
    });
  }

  // Panggil load pertama kali
  loadData();
});
