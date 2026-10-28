/**
 * Transaction List Component
 * Menampilkan daftar pengeluaran
 */

const TransactionList = (() => {
  let $container = null;
  let deleteCallback = null;
  let deleteListenerAttached = false;

  /**
   * Initialize component
   */
  const initialize = () => {
    $container = document.getElementById('transactionList');
    
    if (!$container) {
      console.error('Transaction list container tidak ditemukan di DOM');
      return false;
    }

    return true;
  };

  /**
   * Render transaksi list
   * @param {Array} transactions - Array transaksi
   */
  const render = (transactions) => {
    if (!$container) return;

    // Clear container
    $container.innerHTML = '';

    if (!transactions || transactions.length === 0) {
      $container.innerHTML = '<p class="empty-state">Belum ada pengeluaran. Mulai tambahkan sekarang!</p>';
      return;
    }

    // Create document fragment untuk efficient DOM insertion
    const fragment = document.createDocumentFragment();

    transactions.forEach(transaction => {
      const $item = createTransactionItem(transaction);
      fragment.appendChild($item);
    });

    $container.appendChild(fragment);
    attachDeleteListeners();
  };

  /**
   * Create transaction item element
   * @param {Object} transaction - Transaction object
   * @returns {HTMLElement} Transaction item element
   */
  const createTransactionItem = (transaction) => {
    const $item = document.createElement('div');
    $item.className = `transaction-item ${Formatters.formatCategoryToClass(transaction.category)}`;
    $item.dataset.transactionId = transaction.id;

    const formattedAmount = Formatters.formatCurrency(transaction.amount);
    const formattedCategory = Formatters.formatCategory(transaction.category);

    $item.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-name">${escapeHtml(transaction.itemName)}</div>
        <span class="transaction-category">${escapeHtml(transaction.category)}</span>
      </div>
      <div class="transaction-amount">${formattedAmount}</div>
      <button class="btn btn-danger btn-sm delete-btn" aria-label="Hapus transaksi">
        Hapus
      </button>
    `;

    return $item;
  };

  /**
   * Attach delete event listeners ke semua delete buttons (event delegation)
   */
  const attachDeleteListeners = () => {
    if (!$container || deleteListenerAttached) return;
    deleteListenerAttached = true;

    $container.addEventListener('click', (event) => {
      if (event.target.matches('.delete-btn')) {
        const $item = event.target.closest('.transaction-item');
        if ($item) {
          const transactionId = $item.dataset.transactionId;
          if (deleteCallback) {
            deleteCallback(transactionId);
          }
        }
      }
    });
  };

  /**
   * Set callback untuk delete action
   * @param {Function} callback - Callback function dengan transactionId parameter
   */
  const onDelete = (callback) => {
    if (typeof callback === 'function') {
      deleteCallback = callback;
    }
  };

  /**
   * Escape HTML untuk prevent XSS
   * @param {string} text - Text yang akan di-escape
   * @returns {string} Escaped text
   */
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Public API
  return {
    initialize,
    render,
    onDelete
  };
})();
