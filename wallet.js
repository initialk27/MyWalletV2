function getWalletAwal() {
  return parseInt(localStorage.getItem('walletSaldoAwal')) || 0;
}

function updateWallet() {
  const bulanIndex = localStorage.getItem('bulanTerpilih');
  const saldoAwal = getWalletAwal();

  if (bulanIndex === null) {
    document.getElementById(
      'wallet-saldo'
    ).textContent = `Rp ${saldoAwal.toLocaleString()}`;
    return;
  }

  const key = `pengeluaran-${bulanIndex}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const total = data.reduce((sum, item) => sum + (item.nominal || 0), 0);
  const sisa = saldoAwal - total;

  document.getElementById(
    'wallet-saldo'
  ).textContent = `Rp ${sisa.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateWallet();

  // tombol +
  const btnPlus = document.getElementById('wallet-plus');
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      window.location.href = 'tambahWallet.html';
    });
  }

  // tombol -
  const btnMinus = document.getElementById('wallet-minus');
  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      window.location.href = 'kurangiWallet.html';
    });
  }
});
