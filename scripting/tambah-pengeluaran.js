document.addEventListener('DOMContentLoaded', function () {
  const nominalInput = document.getElementById('nominal');
  const kategoriInput = document.getElementById('kategori');

  // Format angka saat mengetik
  nominalInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    e.target.value = formatRupiah(value);
  });

  // Fungsi format angka ke format ribuan (tanpa Rp)
  function formatRupiah(angka) {
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const bulanIndex = localStorage.getItem('bulanTerpilih');
  const semuaBulan = JSON.parse(localStorage.getItem('catatanBulan')) || [];
  const dataBulan = semuaBulan[bulanIndex];

  if (!dataBulan) {
    alert('Data bulan tidak ditemukan. Silakan kembali ke halaman utama.');
    window.location.href = 'index.html';
    return;
  }

  // Atur tanggal default berdasarkan bulan & tahun terpilih
  const inputTanggal = document.getElementById('tanggal');
  const today = new Date();
  today.setFullYear(dataBulan.tahun);
  today.setMonth(getMonthIndex(dataBulan.bulan));
  inputTanggal.value = today.toISOString().split('T')[0];

  // Tombol kembali
  document.getElementById('btn-kembali').addEventListener('click', () => {
    window.location.href = 'pengeluaran.html';
  });

  // Tombol simpan/lanjut
  document.getElementById('btn-lanjut').addEventListener('click', () => {
    const tanggal = document.getElementById('tanggal').value;
    const nominalStr = nominalInput.value.replace(/\./g, '');
    const nominal = parseInt(nominalStr);
    const kategori = kategoriInput.value;

    if (!tanggal || isNaN(nominal) || !kategori) {
      alert('Harap isi semua data dengan benar!');
      return;
    }

    const item = {
      tanggal: formatTanggalIndonesia(tanggal),
      nominal,
      kategori,
    };

    const key = `pengeluaran-${bulanIndex}`;
    const list = JSON.parse(localStorage.getItem(key)) || [];
    list.push(item);
    localStorage.setItem(key, JSON.stringify(list));

    window.location.href = 'pengeluaran.html';
  });

  function getMonthIndex(namaBulan) {
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
    return bulanArray.indexOf(namaBulan);
  }

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
    const date = new Date(tgl);
    const hari = hariArray[date.getDay()];
    const tanggal = date.getDate();
    const bulan = bulanArray[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hari}, ${tanggal} ${bulan} ${tahun}, ${kategoriInput.value}`;
  }
});
