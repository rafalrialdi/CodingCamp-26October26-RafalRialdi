/**
 * Total Balance Component
 * Displays the total amount of all transactions
 */

const TotalBalance = (() => {
  // Private state
  let $totalAmount = null;

  /**
   * Initialize total balance element reference
   * @returns {void}
   */
  const initialize = () => {
    $totalAmount = document.getElementById('totalAmount');
  };

  /**
   * Calculate total from transactions
   * @param {array} transactions - Array of transactions
   * @returns {number} Total amount
   */
  const calculateTotal = (transactions) => {
    if (!Array.isArray(transactions)) {
      return 0;
    }

    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      return sum + amount;
    }, 0);
  };

  /**
   * Update total balance display
   * @param {array} transactions - Array of transactions
   * @returns {void}
   */
  const update = (transactions) => {
    if (!$totalAmount) {
      return;
    }

    const total = calculateTotal(transactions);
    const formatted = Formatters.formatCurrency(total);

    // Update with animation effect
    $totalAmount.style.transform = 'scale(0.95)';
    $totalAmount.textContent = formatted;

    setTimeout(() => {
      $totalAmount.style.transform = 'scale(1)';
    }, 0);
  };

  /**
   * Get current total
   * @param {array} transactions - Array of transactions
   * @returns {number} Total amount
   */
  const getTotal = (transactions) => {
    return calculateTotal(transactions);
  };

  /**
   * Render total balance display
   * @param {array} transactions - Array of transactions
   * @returns {void}
   */
  const render = (transactions) => {
    update(transactions);
  };

  // Public API
  return {
    initialize,
    render,
    update,
    calculateTotal,
    getTotal
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TotalBalance;
}
