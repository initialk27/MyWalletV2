document.addEventListener('DOMContentLoaded', function () {
  const nominalInput = document.getElementById('nominal');
  const kategoriInput = document.getElementById('kategori');
  const tanggalInput = document.getElementById('tanggal');

  // Format angka saat mengetik
  nominalInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    e.target.value = formatRupiah(value);
  });

  function formatRupiah(angka) {
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const bulanIndex = localStorage.getItem('bulanTerpilih');
  const editIndex = localStorage.getItem('editPengeluaranIndex');

  const key = `pengeluaran-${bulanIndex}`;
  const list = JSON.parse(localStorage.getItem(key)) || [];

  if (editIndex === null || !list[editIndex]) {
    alert('Data tidak ditemukan!');
    window.location.href = 'pengeluaran.html';
    return;
  }

  const data = list[editIndex];

  // Isi form dengan data lama
  tanggalInput.value = convertToDateValue(data.tanggal);
  nominalInput.value = formatRupiah(String(data.nominal));
  kategoriInput.value = data.keterangan || data.kategori || '';

  // Tombol kembali
  document.getElementById('btn-kembali').addEventListener('click', () => {
    window.location.href = 'pengeluaran.html';
  });

  // Tombol simpan
  document.getElementById('btn-simpan').addEventListener('click', () => {
    const tanggal = tanggalInput.value;
    const nominalStr = nominalInput.value.replace(/\./g, '');
    const nominal = parseInt(nominalStr);
    const kategori = kategoriInput.value;

    if (!tanggal || isNaN(nominal) || !kategori) {
      alert('Harap isi semua data dengan benar!');
      return;
    }

    // Update data lama
    list[editIndex] = {
      tanggal: formatTanggalIndonesia(tanggal),
      nominal,
      keterangan: kategori,
    };

    localStorage.setItem(key, JSON.stringify(list));
    localStorage.removeItem('editPengeluaranIndex');

    window.location.href = 'pengeluaran.html';
  });

  function formatTanggalIndonesia(tgl) {
    const hariArray = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const bulanArray = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const dateObj = new Date(tgl);
    const hari = hariArray[dateObj.getDay()];
    const tanggal = dateObj.getDate();
    const bulan = bulanArray[dateObj.getMonth()];
    const tahun = dateObj.getFullYear();
    return `${hari}, ${tanggal} ${bulan} ${tahun}`;
  }

  function convertToDateValue(tglIndo) {
    // contoh: "Senin, 29 September 2025"
    const parts = tglIndo.split(' ');
    if (parts.length < 4) return '';

    const tanggal = parts[1];
    const bulanNama = parts[2];
    const tahun = parts[3];

    const bulanArray = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const bulanIndex = bulanArray.indexOf(bulanNama);
    if (bulanIndex === -1) return '';

    const bulan = String(bulanIndex + 1).padStart(2, '0');
    const hari = String(tanggal).padStart(2, '0');

    return `${tahun}-${bulan}-${hari}`;
  }
});
