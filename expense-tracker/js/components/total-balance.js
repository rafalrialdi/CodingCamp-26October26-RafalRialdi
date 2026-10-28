/**
 * Total Balance Component
 * Menampilkan total pengeluaran
 */

const TotalBalance = (() => {
  let $container = null;

  /**
   * Initialize component
   */
  const initialize = () => {
    $container = document.getElementById('totalBalance');
    
    if (!$container) {
      console.error('Total balance container tidak ditemukan di DOM');
      return false;
    }

    return true;
  };

  /**
   * Update dan render total balance
   * @param {Array} transactions - Array transaksi
   */
  const update = (transactions) => {
    if (!$container) return;

    const total = calculateTotal(transactions);
    const formattedTotal = Formatters.formatCurrency(total);

    $container.textContent = formattedTotal;
  };

  /**
   * Calculate total dari transactions
   * @param {Array} transactions - Array transaksi
   * @returns {number} Total amount
   */
  const calculateTotal = (transactions) => {
    if (!Array.isArray(transactions)) return 0;
    
    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  /**
   * Get current total
   * @returns {string} Current total text
   */
  const getTotal = () => {
    return $container ? $container.textContent : 'Rp 0';
  };

  // Public API
  return {
    initialize,
    update,
    calculateTotal,
    getTotal
  };
})();
