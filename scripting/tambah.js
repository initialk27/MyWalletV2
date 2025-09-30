// ==== Isi dropdown tahun secara dinamis ====
const tahunSelect = document.getElementById('tahun');
const tahunSekarang = new Date().getFullYear();
for (let i = tahunSekarang; i >= tahunSekarang - 20; i--) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  tahunSelect.appendChild(option);
}

// ==== Ambil bulan & tahun hari ini ====
const today = new Date();
const bulanSekarang = today.toLocaleString('id-ID', { month: 'long' });
const tahunNow = today.getFullYear();

// ==== Set bulan & tahun sekarang ke select ====
document.getElementById('bulan').value =
  bulanSekarang.charAt(0).toUpperCase() + bulanSekarang.slice(1);
document.getElementById('tahun').value = tahunNow;

// ==== Fungsi tampilkan modal warning ====
function showWarning(message) {
  document.getElementById('warning-message').textContent = message;
  document.getElementById('warning-modal').style.display = 'flex';
}

// ==== Tombol OK pada modal warning ====
document.getElementById('warning-ok').addEventListener('click', function () {
  document.getElementById('warning-modal').style.display = 'none';
});

// ==== Tombol batal ====
document.getElementById('batal-btn').addEventListener('click', function () {
  window.location.href = 'index.html';
});

// ==== Tombol lanjut ====
document.getElementById('lanjut-btn').addEventListener('click', function () {
  const bulan = document.getElementById('bulan').value;
  const tahun = document.getElementById('tahun').value;

  // Validasi input kosong
  if (!bulan || !tahun) {
    showWarning('Pilih bulan dan tahun!');
    return;
  }

  let data = JSON.parse(localStorage.getItem('catatanBulan')) || [];

  // 🔎 Cek apakah bulan + tahun sudah ada
  const sudahAda = data.some(
    (item) => item.bulan === bulan && item.tahun === tahun
  );

  if (sudahAda) {
    showWarning(`Bulan ${bulan} ${tahun} sudah digunakan!`);
    return; // hentikan proses simpan
  }

  // Jika belum ada, simpan ke localStorage
  data.push({ bulan, tahun });
  localStorage.setItem('catatanBulan', JSON.stringify(data));

  // Redirect ke index
  window.location.href = 'index.html';
});
