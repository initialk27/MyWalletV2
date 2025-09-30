const maksimalInput = document.getElementById('maksimal');

// Format angka saat diketik
maksimalInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/[^\d]/g, ''); // hanya angka
  e.target.value = formatRupiah(value);
});

function formatRupiah(angka) {
  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = 'percent.html';
});

document.getElementById('nextBtn').addEventListener('click', function () {
  const kategori = document.getElementById('kategori').value;
  const maksimalRaw = document.getElementById('maksimal').value;

  if (!kategori || !maksimalRaw) {
    alert('Isi semua data dulu!');
    return;
  }

  // Hapus titik sebelum simpan
  const maksimal = parseInt(maksimalRaw.replace(/\./g, ''));

  // Ambil data pengeluaran terakhir dari index2.html
  const pengeluaranKategori = localStorage.getItem('pengeluaran_kategori');
  const pengeluaranNominal = parseInt(
    localStorage.getItem('pengeluaran_nominal') || 0
  );

  // Ambil data lama dari localStorage
  let data = JSON.parse(localStorage.getItem('persen_data')) || [];

  // Cek apakah kategori sudah ada
  const existingIndex = data.findIndex((item) => item.kategori === kategori);
  if (existingIndex >= 0) {
    // Update data lama
    data[existingIndex].maksimal = maksimal;
    data[existingIndex].terpakai =
      pengeluaranKategori === kategori
        ? data[existingIndex].terpakai + pengeluaranNominal
        : data[existingIndex].terpakai;
  } else {
    // Tambah data baru
    data.push({
      kategori: kategori,
      maksimal: maksimal,
      terpakai: pengeluaranKategori === kategori ? pengeluaranNominal : 0,
    });
  }

  // Simpan kembali
  localStorage.setItem('persen_data', JSON.stringify(data));

  // Kembali ke persentase.html
  window.location.href = 'percent.html';
});
